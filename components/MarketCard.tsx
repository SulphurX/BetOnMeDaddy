import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MarketCardProps {
  id: string;
  title: string
  chance: number
  volume: string
}

export function MarketCard({ id, title, chance, volume }: MarketCardProps) {
  return (
    <Link href={`/markets/${id}`} className="block">
    <Card className="bg-gray-800/50 border-gray-700 p-4">
      <div className="flex items-start gap-3">
        {/* <Image
          src={imageUrl}
          alt={title}
          width={40}
          height={40}
          className="rounded-full"
        /> */}
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-2">{title}</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">{chance}% chance</span>
            <span className="text-sm text-gray-400">${volume} Vol.</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-green-600 text-green-500 hover:bg-green-600/20">
              Buy Yes ↑
            </Button>
            <Button variant="outline" className="border-red-600 text-red-500 hover:bg-red-600/20">
              Buy No ↓
            </Button>
          </div>
        </div>
      </div>
    </Card>
    </Link>
  )
}

