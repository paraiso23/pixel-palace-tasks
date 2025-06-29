import React, { useState } from 'react'
import { useSupabaseGame } from '@/context/SupabaseGameContext'

interface SupabaseTaskCardProps {
  assignment: any
  selectedUser?: string
}

const SupabaseTaskCard: React.FC<SupabaseTaskCardProps> = ({ assignment, selectedUser }) => {
  const { completeTask, startTask } = useSupabaseGame()
  const [showSpark, setShowSpark] = useState(false)

  const handleStart = () => {
    if (selectedUser && assignment.status === 'pending') {
      startTask(assignment.id, selectedUser)
    }
  }

  const handleComplete = () => {
    if (selectedUser && assignment.status !== 'completed') {
      completeTask(assignment.id, selectedUser)
      
      setShowSpark(true)
      setTimeout(() => setShowSpark(false), 400)
    }
  }

  const getStatusColor = () => {
    switch (assignment.status) {
      case 'completed':
        return 'border-neon-green bg-neon-green text-retro-black'
      case 'in_progress':
        return 'border-neon-yellow bg-retro-gray text-neon-yellow'
      default:
        return 'border-retro-lightgray text-retro-lightgray hover:border-neon-cyan'
    }
  }

  const getStatusIcon = () => {
    switch (assignment.status) {
      case 'completed':
        return '✅'
      case 'in_progress':
        return '⚡'
      default:
        return '⏱️'
    }
  }

  const canInteract = selectedUser && assignment.status !== 'completed'

  return (
    <div className={`relative p-3 border-2 transition-all duration-200 ${getStatusColor()}`}>
      {/* Spark effect when completing */}
      {showSpark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-neon-green text-2xl animate-bounce">✨</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg pixel-icon">{assignment.task?.icon || '📋'}</span>
          <div>
            <div className="font-mono text-xs font-bold">
              {assignment.task?.name?.toUpperCase() || 'TAREA'}
            </div>
            <div className="font-mono text-xs opacity-75">
              ⚡ {assignment.task?.energy || 1} energía • 🪙 {assignment.tokens} tokens
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          
          {canInteract && (
            <div className="flex gap-1">
              {assignment.status === 'pending' && (
                <button
                  onClick={handleStart}
                  className="btn-16bit text-xs py-1 px-2"
                  disabled={!selectedUser}
                >
                  INICIAR
                </button>
              )}
              
              {assignment.status !== 'completed' && (
                <button
                  onClick={handleComplete}
                  className="btn-16bit-cyan text-xs py-1 px-2"
                  disabled={!selectedUser}
                >
                  ✓
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Show who completed the task */}
      {assignment.status === 'completed' && assignment.completed_by && (
        <div className="mt-2 pt-2 border-t border-current">
          <div className="font-mono text-xs">
            Completada por: <span className="font-pixel">{assignment.completed_by.name?.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SupabaseTaskCard