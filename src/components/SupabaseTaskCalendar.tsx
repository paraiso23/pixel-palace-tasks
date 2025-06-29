import React from 'react'
import { useSupabaseGame } from '@/context/SupabaseGameContext'
import SupabaseTaskCard from './SupabaseTaskCard'
import SupabaseTaskManager from './SupabaseTaskManager'

interface SupabaseTaskCalendarProps {
  selectedUser?: string
}

const SupabaseTaskCalendar: React.FC<SupabaseTaskCalendarProps> = ({ selectedUser }) => {
  const { taskAssignments, tasks } = useSupabaseGame()

  // Group task assignments by date
  const tasksByDate = taskAssignments.reduce((acc: any, assignment: any) => {
    if (!acc[assignment.assigned_date]) {
      acc[assignment.assigned_date] = { morning: [], afternoon: [] }
    }
    acc[assignment.assigned_date][assignment.time_slot].push(assignment)
    return acc
  }, {})

  // Get next 14 days
  const getDates = () => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-4">
      <h2 className="font-pixel text-neon-green text-center mb-6 neon-text">
        📅 CALENDARIO DE TAREAS
      </h2>
      
      <div className="grid gap-4">
        {getDates().map((date) => {
          const dateString = date.toISOString().split('T')[0]
          const dayTasks = tasksByDate[dateString] || { morning: [], afternoon: [] }
          
          return (
            <div 
              key={dateString}
              className={`card-16bit ${isToday(date) ? 'border-neon-yellow animate-glow' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm text-neon-cyan">
                  {formatDate(date).toUpperCase()}
                </h3>
                {isToday(date) && (
                  <span className="font-pixel text-xs text-neon-yellow animate-pixel-blink">
                    HOY
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Morning */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-mono text-xs text-retro-lightgray">
                      🌅 MAÑANA
                    </h4>
                    <SupabaseTaskManager date={dateString} timeSlot="morning" />
                  </div>
                  <div className="space-y-2">
                    {dayTasks.morning.map((assignment: any) => (
                      <SupabaseTaskCard
                        key={assignment.id}
                        assignment={assignment}
                        selectedUser={selectedUser}
                      />
                    ))}
                    {dayTasks.morning.length === 0 && (
                      <div className="text-retro-lightgray font-mono text-xs p-2 border border-retro-gray">
                        Sin tareas
                      </div>
                    )}
                  </div>
                </div>

                {/* Afternoon */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-mono text-xs text-retro-lightgray">
                      🌆 TARDE
                    </h4>
                    <SupabaseTaskManager date={dateString} timeSlot="afternoon" />
                  </div>
                  <div className="space-y-2">
                    {dayTasks.afternoon.map((assignment: any) => (
                      <SupabaseTaskCard
                        key={assignment.id}
                        assignment={assignment}
                        selectedUser={selectedUser}
                      />
                    ))}
                    {dayTasks.afternoon.length === 0 && (
                      <div className="text-retro-lightgray font-mono text-xs p-2 border border-retro-gray">
                        Sin tareas
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SupabaseTaskCalendar