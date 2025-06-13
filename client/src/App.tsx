import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DonationArtifact from "./artifacts/contracts/Donation.sol/Donation.json";
import ConnectWallet from "./components/ConnectWallet";
import DonationForm from "./components/DonationForm";
import DonationList from "./components/DonationList";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [balance, setBalance] = useState("0");

  // Initialize ethers and contract
  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // Get network
          const network = await provider.getNetwork();
          if (network.chainId.toString() !== "11155111") {
            // Sepolia network ID
            alert("Please connect to Sepolia Testnet");
            setLoading(false);
            return;
          }

          // Set contract address - should be updated after deployment
          const contractAddress = "0xYourDeployedContractAddressHere";
          const donationContract = new ethers.Contract(
            contractAddress,
            DonationArtifact.abi,
            provider
          );
          setContract(donationContract);

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              handleConnect();
            } else {
              setAccount("");
              setSigner(null);
            }
          });
        } else {
          alert("Please install MetaMask to use this dApp");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
      setLoading(false);
    };

    init();
  }, []);

  // Connect wallet function
  const handleConnect = async () => {
    try {
      setLoading(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);

      const signer = await provider.getSigner();
      setSigner(signer);

      // Get account balance
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));

      // Load donations
      await loadDonations();

      setLoading(false);
    } catch (error) {
      console.error("Connection error:", error);
      setLoading(false);
    }
  };

  // Load all donations
  const loadDonations = async () => {
    if (contract) {
      try {
        // Get donations count
        const count = await contract.getDonationsCount();
        const donationsArray = [];

        // Get all donations
        for (let i = 0; i < count; i++) {
          const donation = await contract.getDonation(i);
          donationsArray.push({
            donor: donation[0],
            recipient: donation[1],
            amount: ethers.formatEther(donation[2]),
            timestamp: new Date(Number(donation[3]) * 1000).toLocaleString(),
            message: donation[4],
          });
        }

        setDonations(donationsArray.reverse()); // Show newest first
      } catch (error) {
        console.error("Error loading donations:", error);
      }
    }
  };

  // Handle donation submission
  const handleDonate = async (recipientAddress, amount, message) => {
    if (!signer || !contract) return;

    try {
      setLoading(true);

      // Create contract with signer for write operations
      const contractWithSigner = contract.connect(signer);

      // Send donation transaction
      const tx = await contractWithSigner.donate(recipientAddress, message, {
        value: ethers.parseEther(amount),
      });

      // Wait for transaction to be mined
      await tx.wait();

      // Reload donations and update balance
      await loadDonations();
      const newBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(newBalance));

      setLoading(false);
    } catch (error) {
      console.error("Donation error:", error);
      setLoading(false);
      alert("Error making donation: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10 p-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Donation dApp
            </h1>
          </div>
          <ConnectWallet
            account={account}
            balance={balance}
            handleConnect={handleConnect}
          />
        </div>
      </header>

      <main className="container mx-auto my-12 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-purple-400">Make a Donation</h2>
              <DonationForm
                handleDonate={handleDonate}
                isConnected={!!account}
              />
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-6 text-purple-400">Recent Donations</h2>
              <DonationList donations={donations} userAddress={account} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black/30 backdrop-blur-lg border-t border-white/10 p-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">© 2024 Donation dApp - Built with ❤️ by Mukundwa Aurore</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
