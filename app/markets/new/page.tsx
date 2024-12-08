'use client'

import { useOkto, type OktoContextType } from 'okto-sdk-react'
import { ethers } from 'ethers'
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CreateMarketForm } from "@/components/CreateMarketForm"
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useState } from 'react'

const MARKET_FACTORY_ADDRESS = "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3"
const MARKET_FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_statement",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_yes",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_no",
        "type": "string"
      }
    ],
    "name": "createMarket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "createFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export default function CreateMarketPage() {
  const { data: session } = useSession();
  const { executeRawTransaction, getWallets } = useOkto() as OktoContextType
  const [publicKey, setPublicKey] = useState<string>("");
  const { toast } = useToast()

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (session) {
        try {
          const walletData = await getWallets();
          console.log(walletData)
          const polygonWallet = walletData.wallets.find(wallet => wallet.network_name === "POLYGON_TESTNET_AMOY");
          if (polygonWallet) {
            setPublicKey(polygonWallet.address);
          }
          console.log(publicKey);
        } catch (error) {
          console.error("Error fetching wallet:", error);
        }
      }
    };

    fetchWalletAddress();
  }, [session, getWallets]);

  const handleSubmit = async (formData: { 
    statement: string; 
    yesDescription: string; 
    noDescription: string;
    initialValue: string;
  }) => {
    try {
        console.log("Sending Transaction")
      console.log("Creating interface for market factory ABI");
      const iface = new ethers.Interface(MARKET_FACTORY_ABI);
      console.log("iface:", iface);

      console.log("Encoding function data for createMarket with statement, yesDescription, and noDescription");
      const data = iface.encodeFunctionData("createMarket", [
        formData.statement,
        formData.yesDescription,
        formData.noDescription
      ]);
      console.log("data:", data);

      console.log("Encoding function data for createFee");
      const createFeeData = iface.encodeFunctionData("createFee");
      console.log("createFeeData:", createFeeData);
      const parsedValue = ethers.parseEther(formData.initialValue);

      // console.log("Executing raw transaction for createFee with initial value", formData.initialValue);
      // const response = await executeRawTransaction({
      //   network_name: "POLYGON_TESTNET_AMOY",
      //   transaction: {
      //     from: publicKey,
      //     to: MARKET_FACTORY_ADDRESS,
      //     data: createFeeData,
      //     value: "1000000000000000000"
      //   }
      // });
      // console.log("response:", response);

      console.log("Executing raw transaction for createMarket with response as value");
      const tx = await executeRawTransaction({
        network_name: "POLYGON_TESTNET_AMOY",
        transaction: {
          from: publicKey,
          to: MARKET_FACTORY_ADDRESS,
          data,
          value: "1000000000000000000"
        }
      });
      console.log("tx:", tx);

      toast({
        title: "Market Created!",
        description: "Your prediction market has been created successfully.",
      })

    } catch (error: any) {
      toast({
        title: "Error Creating Market",
        description: error.message || "Something went wrong",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create New Market</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Create a new prediction market. You will need to pay a creation fee.
            </CardDescription>
          </CardHeader>

          <CreateMarketForm onSubmit={handleSubmit} />
        </Card>
      </div>
    </div>
  )
}

