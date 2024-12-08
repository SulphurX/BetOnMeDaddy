import { useState, useEffect } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface ChartData {
  timestamp: number
  probability: number
}

interface MarketChartProps {
  data: ChartData[]
  timeframe: '1D' | '1W' | '1M' | 'ALL'
}

export function MarketChart({ data, timeframe }: MarketChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    // Filter data based on timeframe
    const now = Date.now()
    const filteredData = data.filter(point => {
      switch (timeframe) {
        case '1D':
          return now - point.timestamp < 24 * 60 * 60 * 1000
        case '1W':
          return now - point.timestamp < 7 * 24 * 60 * 60 * 1000
        case '1M':
          return now - point.timestamp < 30 * 24 * 60 * 60 * 1000
        case 'ALL':
        default:
          return true
      }
    })
    setChartData(filteredData)
  }, [data, timeframe])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis 
          dataKey="timestamp" 
          domain={['dataMin', 'dataMax']}
          type="number"
          scale="time"
          tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleDateString()}
        />
        <YAxis domain={[0, 100]} />
        <Tooltip
          labelFormatter={(label) => new Date(label * 1000).toLocaleString()}
          formatter={(value: number) => `${value.toFixed(2)}%`}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="probability" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

