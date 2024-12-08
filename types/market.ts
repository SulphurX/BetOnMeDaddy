export interface Market {
  id: string
  title: string
  creator: {
    name: string
    avatar: string
    isPremium: boolean
  }
  stats: {
    likes: number
    traders: number
    volume: string
    createdAt: string
  }
  probability: number
}

export type TimeFrame = '1D' | '1W' | '1M' | 'ALL'

export interface ChartData {
  timestamp: number
  probability: number
}

export interface MarketData extends Market {
  chartData: ChartData[]
}

export function generateMockChartData(
  days: number = 2,
  startProb: number = 65,
  volatility: number = 10
): ChartData[] {
  const data: ChartData[] = [];
  let currentProb = startProb;
  
  // Get current timestamp
  const now = Date.now();
  const twoDaysAgo = now - (2 * 24 * 60 * 60 * 1000);
  
  // Generate data points every 15 minutes
  const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
  let timestamp = twoDaysAgo;

  while (timestamp <= now) {
    // Random walk with mean reversion
    const change = (Math.random() - 0.5) * volatility;
    currentProb += change;
    // Keep probability between 1 and 99
    currentProb = Math.min(Math.max(currentProb, 1), 99);
    
    data.push({
      timestamp: Math.floor(timestamp / 1000),
      probability: Math.round(currentProb)
    });

    timestamp += interval;
  }

  return data.sort((a, b) => a.timestamp - b.timestamp);
}

