'use client'

import { Button } from "@/components/ui/button"
import type { TimeFrame } from "@/types/market"

interface TimeframeSelectorProps {
  selected: TimeFrame
  onChange: (timeframe: TimeFrame) => void
}

export function TimeframeSelector({ selected, onChange }: TimeframeSelectorProps) {
  const timeframes: TimeFrame[] = ['1D', '1W', '1M', 'ALL']
  
  return (
    <div className="flex items-center gap-2">
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe}
          variant={selected === timeframe ? "secondary" : "ghost"}
          size="sm"
          className={selected === timeframe ? "bg-teal-500/20 text-teal-300" : "text-gray-400"}
          onClick={() => onChange(timeframe)}
        >
          {timeframe}
        </Button>
      ))}
    </div>
  )
}

