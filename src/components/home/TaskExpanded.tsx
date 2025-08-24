import React from 'react'
import { Button } from '../ui/button'
import { Bot } from 'lucide-react'

export interface TaskExpandedProps {
  showCheckSubmission?: boolean
  showViewHomework?: boolean
  scoreText?: string // e.g., "15 · Top 3% of all submissions!"
  aiText?: string
  reachText?: string
  showChat?: boolean
  showResubmit?: boolean
  fridayTwoButtons?: boolean
  recognitionBadges?: string[]
  startOnly?: boolean
}

export default function TaskExpanded({ showCheckSubmission, showViewHomework, scoreText, aiText, reachText, showChat, showResubmit, fridayTwoButtons, recognitionBadges, startOnly }: TaskExpandedProps) {
  if (fridayTwoButtons) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">View</Button>
          <Button className="flex-1">Start your homework!</Button>
        </div>
      </div>
    )
  }

  if (startOnly) {
    return (
      <div className="space-y-3">
        <Button className="w-full">Start your homework!</Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {showViewHomework && <Button variant="outline" className="w-full">View homework</Button>}
      {showCheckSubmission && <Button variant="outline" className="w-full">Check the submission</Button>}
      {recognitionBadges && recognitionBadges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recognitionBadges.map((b, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{b}</span>
          ))}
        </div>
      )}
      {scoreText && <div className="text-sm"><span className="font-medium">{scoreText}</span></div>}
      {(aiText || reachText) && (
        <div className="space-y-2">
          {aiText && (
            <div className="flex items-start gap-2">
              <div className="p-2 bg-blue-50 rounded-full"><Bot className="h-4 w-4 text-blue-600" /></div>
              <div className="bg-muted rounded-2xl p-3 text-sm flex-1">{aiText}</div>
            </div>
          )}
          {reachText && (
            <div className="flex items-start gap-2">
              <img src="/REACH_icon.png" alt="REACH" className="w-6 h-6 rounded-full" />
              <div className="bg-muted rounded-2xl p-3 text-sm flex-1">{reachText}</div>
            </div>
          )}
          {showChat && <input className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Type to chat with AI/REACH…" />}
        </div>
      )}
      {showResubmit && <Button variant="secondary" className="w-full">Try again!</Button>}
    </div>
  )
} 