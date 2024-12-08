import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'

interface FormData {
  statement: string
  yesDescription: string
  noDescription: string
  initialValue: string
}

interface CreateMarketFormProps {
  onSubmit: (formData: FormData) => Promise<void>
}

export function CreateMarketForm({ onSubmit }: CreateMarketFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    statement: 'Will we finish this hack by the deadline?',
    yesDescription: 'We submit the project',
    noDescription: 'Doomsday is here',
    initialValue: '1000'
  })

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      setFormData({
        statement: '',
        yesDescription: '',
        noDescription: '',
        initialValue: ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="statement" className="text-sm font-medium text-gray-300">Market Question</Label>
          <Textarea
            id="statement"
            placeholder="What are you predicting? Be specific and unambiguous."
            value={formData.statement}
            onChange={handleInputChange('statement')}
            className="bg-gray-700/50 border-gray-600 focus:border-teal-500 text-white placeholder-gray-400"
            required
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="yesDescription" className="text-sm font-medium text-gray-300">"Yes" Outcome Description</Label>
          <Input
            id="yesDescription"
            placeholder="Define what constitutes a 'Yes' outcome"
            value={formData.yesDescription}
            onChange={handleInputChange('yesDescription')}
            className="bg-gray-700/50 border-gray-600 focus:border-teal-500 text-white placeholder-gray-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noDescription" className="text-sm font-medium text-gray-300">"No" Outcome Description</Label>
          <Input
            id="noDescription"
            placeholder="Define what constitutes a 'No' outcome"
            value={formData.noDescription}
            onChange={handleInputChange('noDescription')}
            className="bg-gray-700/50 border-gray-600 focus:border-teal-500 text-white placeholder-gray-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noDescription" className="text-sm font-medium text-gray-300">"Initial Market Value</Label>
          <Input
            id="initialValue"
            placeholder="Initial Market Value"
            value={formData.initialValue}
            onChange={handleInputChange('initialValue')}
            className="bg-gray-700/50 border-gray-600 focus:border-teal-500 text-white placeholder-gray-400"
            required
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          type="submit" 
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Market...
            </>
          ) : (
            "Create Market"
          )}
        </Button>
      </CardFooter>
    </form>
  )
}

