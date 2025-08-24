import React from 'react'
import { Badge } from '../ui/badge'
import { Camera, FileText, Mic, Video, CheckCircle, Clock, Star } from 'lucide-react'

export type TaskStatus = 'reviewed' | 'completed' | 'to-do' | 'pending'
export type TaskMedia = 'photo' | 'mic' | 'doc' | 'video'

export interface TaskItemProps {
  day: 'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'
  media: TaskMedia
  title: string
  points: number
  status: TaskStatus
  rightIcon: 'check'|'clock'
  expanded?: boolean
  hideStatusChip?: boolean
}

const mediaIconFor: Record<TaskMedia, any> = {
  photo: Camera,
  mic: Mic,
  doc: FileText,
  video: Video,
}

export default function TaskItem({ day, media, title, points, status, rightIcon, hideStatusChip }: TaskItemProps) {
  const MediaIcon = mediaIconFor[media]
  const statusChip = (
    status === 'reviewed' ? <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">reviewed</Badge>
    : status === 'completed' ? <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">completed</Badge>
    : status === 'pending' ? <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">pending</Badge>
    : <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800">to-do</Badge>
  )
  return (
    <div className="flex items-center w-full">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 bg-primary/10 rounded-full"><MediaIcon className="h-4 w-4 text-primary" /></div>
        <div className="min-w-0">
          <div className="font-medium truncate hover:no-underline select-none">{title}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-4">
            <span>{day}</span>
            {points > 0 && (
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />{points}</span>
            )}
          </div>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 shrink-0">
        {!hideStatusChip && statusChip}
        {rightIcon === 'check' && <CheckCircle className="h-5 w-5 text-green-500" />}
        {rightIcon === 'clock' && <Clock className="h-5 w-5 text-gray-500" />}
      </div>
    </div>
  )
} 