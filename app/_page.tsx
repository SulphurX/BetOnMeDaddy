'use client'

import { useSession } from "next-auth/react"
import { LoginButton } from "./components/LoginButton"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0b14] to-[#131429] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image 
            src="/placeholder.svg"
            alt="Sulphur Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-semibold">Sulphur</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/discover" className="text-gray-300 hover:text-white transition-colors">
            Discover
          </Link>
          <Link href="/markets" className="text-gray-300 hover:text-white transition-colors">
            Markets
          </Link>
          <Link href="/leaderboard" className="text-gray-300 hover:text-white transition-colors">
            Leaderboard
          </Link>
          <Link href="/learn" className="text-gray-300 hover:text-white transition-colors">
            Learn
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/sign-in"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-md transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 pt-24 pb-32 relative">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Predict Tomorrow, Profit Today
            </h1>
            <p className="text-xl text-gray-400">
              Where insight meets opportunity in the world's most dynamic prediction markets
            </p>
            <p className="text-lg text-gray-400 max-w-xl">
              Join thousands of traders forecasting everything from election outcomes to tech launches. 
              Turn your knowledge into rewards with AI-powered market analytics.
            </p>
            
            <div className="space-y-4">
              <LoginButton/>
              
              <p className="text-sm text-gray-500 text-center sm:text-left">
                New users receive <span className="text-violet-400 font-semibold">1,000 prediction tokens</span> to start their journey!
              </p>
            </div>
          </div>

          <div className="relative w-full h-[400px] hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-blue-600/20 rounded-lg backdrop-blur-sm">
              <div className="absolute inset-0 bg-[url('/trading-graph.svg')] bg-center bg-cover opacity-75 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* New Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
          {['Real-time Analytics', 'Community Insights', 'Secure Trading'].map((feature) => (
            <div key={feature} className="p-6 rounded-lg bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              <p className="text-gray-400">Experience the future of prediction markets with our cutting-edge platform.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

