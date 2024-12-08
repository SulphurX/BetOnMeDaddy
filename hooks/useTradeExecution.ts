import { useState } from 'react';
import { ethers } from 'ethers';
import { useMarketContracts } from './useMarketContracts';

export function useTradeExecution() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contracts = useMarketContracts();

  const executeTrade = async (
    marketAddress: string,
    type: 'Buy' | 'Sell',
    outcome: 'Yes' | 'No',
    amount: number,
    maxPrice?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // const amountWei = ethers.parseEther(amount.toString());
      // const maxPriceWei = maxPrice ? ethers.parseEther(maxPrice) : '0';

      let tx;
      if (type === 'Buy') {
        tx = outcome === 'Yes' 
          ? await contracts.buyYesPosition(marketAddress, amount.toString(), "0x1000000000")
          : await contracts.buyNoPosition(marketAddress, amount.toString(), "0x10000000");
      } else {
        tx = outcome === 'Yes'
          ? await contracts.sellYesPosition(marketAddress, amount.toString())
          : await contracts.sellNoPosition(marketAddress, amount.toString());
      }

      return tx;
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeTrade,
    isLoading,
    error
  };
}