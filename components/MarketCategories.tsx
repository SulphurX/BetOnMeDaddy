import { Button } from "@/components/ui/button"

export function MarketCategories() {
  return (
    <div className="border-b border-gray-800">
      <div className="flex items-center gap-6 px-6 py-2 overflow-x-auto max-w-7xl mx-auto">
        <Button variant="ghost" className="text-violet-400">LIVE</Button>
        <Button variant="ghost">Politics</Button>
        <Button variant="ghost">Crypto</Button>
        <Button variant="ghost">Sports</Button>
        <Button variant="ghost">Global Elections</Button>
        <Button variant="ghost">Business</Button>
      </div>
    </div>
  )
}

