import React, { useState } from "react";
import { ethers } from "ethers";

interface DonationFormProps {
  handleDonate: (recipient: string, amount: string, message: string) => void;
  isConnected: boolean;
}

interface FormErrors {
  recipient?: string;
  amount?: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ handleDonate, isConnected }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: { [key: string]: any } = {};

    if (!recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!ethers.isAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipient && amount) {
      handleDonate(recipient, amount, message);
      setRecipient("");
      setAmount("");
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
          Amount (ETH)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          step="0.001"
          min="0"
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message (Optional)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message with your donation..."
          rows={3}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
        />
      </div>

      <button
        type="submit"
        disabled={!isConnected}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
          isConnected
            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isConnected ? "Send Donation" : "Connect Wallet to Donate"}
      </button>
    </form>
  );
};

export default DonationForm;
