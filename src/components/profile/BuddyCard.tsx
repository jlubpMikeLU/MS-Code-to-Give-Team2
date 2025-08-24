import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Heart, Flower } from 'lucide-react'

export interface BuddyCardProps {
  currentPoints: number
  nextCap: number
  level: number
  remainingText: string
}

export function BuddyCard({ currentPoints, nextCap, level, remainingText }: BuddyCardProps) {
  const progressPct = Math.min(100, Math.max(0, (currentPoints / nextCap) * 100))
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-green-600" />
          Your Learning Buddy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-4 bg-green-100 rounded-full">
                <Flower className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h3 className="font-bold text-green-900 mb-1">Young Plant</h3>
            <p className="text-sm text-green-700">Level {level}</p>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-green-900">Growth Progress</span>
              <span className="text-sm text-green-700">{currentPoints}/{nextCap}</span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-green-200 rounded-full h-3" aria-label="Growth Progress">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-600">{remainingText}</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-green-700">
            Your buddy grows stronger with every point you earn! 🌱⭐
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 