// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, BarChart3, Calendar } from 'lucide-react'
import type { Market } from "@/types/market"

interface MarketHeaderProps {
  market: Market
}

export function MarketHeader({ market }: MarketHeaderProps) {
  if (!market) return null;
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">{market.title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* <Avatar className="h-8 w-8">
            <AvatarImage src={market.creator.avatar} />
            <AvatarFallback>{market.creator.name[0]}</AvatarFallback>
          </Avatar> */}
          <span className="text-gray-300">{market.creator.name}</span>
          {market.creator.isPremium && (
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-300">
              Premium
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {market.stats.likes}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {market.stats.traders}
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            ₳{market.stats.volume}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {market.stats.createdAt}
          </div>
        </div>
      </div>
    </div>
  )
}

