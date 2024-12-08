import { ethers } from 'ethers';
import { useOkto, type OktoContextType } from 'okto-sdk-react';
import MARKET_ABI from '../contracts/MarketABI.json';
import MARKET_FACTORY_ABI from '../contracts/MarketFactoryABI.json';

export function useMarketContracts() {
  const { executeRawTransaction } = useOkto() as OktoContextType;
  // Hardcodes // It's a hackathon eh
  // const MARKET_CONTRACT_ADDRESS = "0x842bf68Bbd4A0cCBFeBa54ea9fdec2Dd72e97F90"
  const MARKET_CONTRACT_ADDRESS = "0x5C9eb5D6a6C2c1B3EFc52255C0b356f116f6f66D"
  const publicKey = "0x7832348f1B8F74F3EAa651D90a36cEb93098256e"
  
  // Factory Interactions
  const createMarket = async (
    factoryAddress: string,
    statement: string,
    yesLabel: string,
    noLabel: string,
    createFee: string
  ) => {
    const iface = new ethers.Interface(MARKET_FACTORY_ABI);
    const data = iface.encodeFunctionData("createMarket", [
      statement,
      yesLabel, 
      noLabel
    ]);

    // return executeRawTransaction({
    //   network_name: "POLYGON_TESTNET_AMOY",
    //   transaction: {
    //     from: publicKey,
    //     // to: factoryAddress,
    //     to: MARKET_CONTRACT_ADDRESS,
    //     data,
    //     value: createFee
    //   }
    // });
  };

  // Market Interactions
  const buyYesPosition = async (
    marketAddress: string,
    amount: string,
    maxPrice: string
  ) => {
    const iface = new ethers.Interface(MARKET_ABI);
    const data = iface.encodeFunctionData("buyOption1", [amount]);
    console.log(data);

    return executeRawTransaction({
      network_name: "POLYGON_TESTNET_AMOY", 
      transaction: {
        from: publicKey,
        // to: marketAddress,
        to: MARKET_CONTRACT_ADDRESS,
        data,
        value: maxPrice
      }
    });
  };

  const buyNoPosition = async (
    marketAddress: string,  
    amount: string,
    maxPrice: string
  ) => {
    const iface = new ethers.Interface(MARKET_ABI);
    const data = iface.encodeFunctionData("buyOption2", [amount]);

    return executeRawTransaction({
      network_name: "POLYGON_TESTNET_AMOY",
      transaction: {
        from: publicKey,
        // to: marketAddress,
        to: MARKET_CONTRACT_ADDRESS,
        data,
        // value: maxPrice
      }
    });
  };

  const sellYesPosition = async (
    marketAddress: string,
    amount: string
  ) => {
    const iface = new ethers.Interface(MARKET_ABI);
    const data = iface.encodeFunctionData("sellOption1", [amount]);

    return executeRawTransaction({
      network_name: "POLYGON_TESTNET_AMOY",
      transaction: {
        from: publicKey,
        // to: marketAddress,
        to: MARKET_CONTRACT_ADDRESS,
        data
      }
    });
  };

  const sellNoPosition = async (
    marketAddress: string,
    amount: string
  ) => {
    const iface = new ethers.Interface(MARKET_ABI);
    const data = iface.encodeFunctionData("sellOption2", [amount]);

    return executeRawTransaction({
      network_name: "POLYGON_TESTNET_AMOY",
      transaction: {
        from: publicKey,
        // to: marketAddress,
        to: MARKET_CONTRACT_ADDRESS,
        data
      }
    });
  };

  // Error wrapper
  const executeWithErrorHandling = async (
    operation: () => Promise<any>
  ) => {
    try {
      const result = await operation();
      console.log('Transaction submitted:', result);
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  return {
    // createMarket: (marketName: string, description: string, resolutionTime: number) => 
    //   executeWithErrorHandling(() => createMarket(marketName, description, resolutionTime)),
    buyYesPosition: (marketAddress: string, amount: string, maxPrice: string) => 
      executeWithErrorHandling(() => buyYesPosition(marketAddress, amount, maxPrice)),
    buyNoPosition: (marketAddress: string, amount: string, maxPrice: string) => 
      executeWithErrorHandling(() => buyNoPosition(marketAddress, amount, maxPrice)),
    sellYesPosition: (marketAddress: string, amount: string) => 
      executeWithErrorHandling(() => sellYesPosition(marketAddress, amount)), 
    sellNoPosition: (marketAddress: string, amount: string) => 
      executeWithErrorHandling(() => sellNoPosition(marketAddress, amount))
  };
}