'use client'

import { Navbar } from "@/components/Navbar"
import { MarketCategories } from "@/components/MarketCategories"
import { MarketCard } from "@/components/MarketCard"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <Navbar />
      <MarketCategories />

      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MarketCard
            id="unfold"
            title="Will we finish this hack before the deadline?"
            chance={45}
            volume="4.8m"
          />
          <MarketCard
            id="eth-100k"
            title="Will ETH reach $10k by end of 2024?"
            chance={15}
            volume="12.5m"
          />
        </div>
      </main>
    </div>
  )
}

