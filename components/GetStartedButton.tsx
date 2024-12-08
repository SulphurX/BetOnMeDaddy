"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { OktoContextType, useOkto } from "okto-sdk-react";
import { useEffect, useState } from "react";

export function GetStartedButton() {
  const { data: session } = useSession();
  const { getWallets } = useOkto() as OktoContextType;
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (session) {
        try {
          const walletData = await getWallets();
          console.log(walletData)
          if (walletData && walletData.wallets.length > 0) {
            setWalletAddress(walletData.wallets[0].address);
          }
        } catch (error) {
          console.error("Error fetching wallet:", error);
        }
      }
    };

    fetchWalletAddress();
  }, [session, getWallets]);

  const handleClick = () => {
    session ? signOut() : signIn();
  };

  // Helper function to truncate wallet address
  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      className={`border border-transparent rounded px-4 py-2 transition-colors ${
        session
          ? "bg-gray-800 hover:bg-gray-700 text-white"
          : "bg-blue-500 hover:bg-blue-700 text-white"
      }`}
      onClick={handleClick}
    >
      {session ? (
        walletAddress ? walletAddress : (
          "Loading..."
        )
      ) : (
        "Get Started"
      )}
    </button>
  );
} 