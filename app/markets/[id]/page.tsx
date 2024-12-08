'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MarketHeader } from "@/components/MarketHeader"
import { TimeframeSelector } from "@/components/TimeframeSelector"
import { TradeInterface } from "@/components/TradeInterface"
import { Button } from "@/components/ui/button"
import { MarketChart } from "@/components/MarketChart"
import type { Market, TimeFrame, ChartData, MarketData } from "@/types/market"
import { generateMockChartData } from "@/types/market"
import { Navbar } from "@/components/Navbar"

export default function MarketPage() {
  const params = useParams()
  const [timeframe, setTimeframe] = useState<TimeFrame>('ALL')
  const [showTrade, setShowTrade] = useState(false)
  const [chartData, setChartData] = useState<ChartData[]>([])
  
  const mockMarket: Market = {
    id: "unfold",
    title: "Will we finish this hack before the deadline?",
    creator: {
      name: "Team Sulphur",
      avatar: "https://example.com/unfold-avatar.png", 
      isPremium: true,
    },
    stats: {
      likes: 245,
      traders: 120,
      volume: "4.8m",
      createdAt: "2024-01-20",
    },
    probability: 45,
  }
  const [market, setMarket] = useState<Market>(mockMarket)

  const mockChart: ChartData[] = generateMockChartData(90, mockMarket.probability);

  

  useEffect(() => {
    async function fetchMarketData() {
      if (typeof params.id !== 'string') {
        console.error('Invalid market ID')
        return
      }

      try {
        setMarket(mockMarket)
        setChartData(mockChart)
        // const response = await fetch(`/api/markets/${params.id}`)
        // const data: MarketData = await response.json()
        // setMarket(data)
        // setChartData(data.chartData)
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      }
    }
    fetchMarketData()
  }, [params.id])

  // if (!market) {
  //   return (
  //     <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center">
  //       Loading...
  //     </div>
  //   )
  // }


  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <Navbar></Navbar>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <MarketHeader market={market} />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold">{chartData[chartData.length - 1]?.probability}%</span>
              <span className="text-gray-400">chance</span>
            </div>
            <TimeframeSelector selected={timeframe} onChange={setTimeframe} />
          </div>

          <div className="relative aspect-[2/1] bg-gray-900 rounded-lg overflow-hidden">
            <MarketChart data={chartData} timeframe={timeframe} />
          </div>

          {showTrade ? (
            <TradeInterface 
              probability={market.probability} 
              onClose={() => setShowTrade(false)} 
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                size="lg"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => setShowTrade(true)}
              >
                Trade YES ↑
              </Button>
              <Button 
                size="lg"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowTrade(true)}
              >
                Trade NO ↓
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

