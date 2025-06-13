import React from "react";

interface Donation {
  donor: string;
  recipient: string;
  amount: string;
  timestamp: string;
  message: string;
}

interface DonationListProps {
  donations: Donation[];
  userAddress: string;
}

const DonationList: React.FC<DonationListProps> = ({ donations, userAddress }) => {
  if (donations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-gray-400">No donations yet. Be the first to donate!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {donations.map((donation, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-gray-400">
                From:{" "}
                <span className="text-purple-400">
                  {donation.donor === userAddress
                    ? "You"
                    : `${donation.donor.slice(0, 6)}...${donation.donor.slice(-4)}`}
                </span>
              </p>
              <p className="text-sm text-gray-400">
                To:{" "}
                <span className="text-pink-400">
                  {donation.recipient === userAddress
                    ? "You"
                    : `${donation.recipient.slice(0, 6)}...${donation.recipient.slice(-4)}`}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-purple-400">{donation.amount} ETH</p>
              <p className="text-xs text-gray-500">{donation.timestamp}</p>
            </div>
          </div>
          {donation.message && (
            <div className="mt-2 p-3 bg-white/5 rounded-lg">
              <p className="text-sm text-gray-300">{donation.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DonationList;
