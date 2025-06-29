import React from 'react'
import { useSupabaseGame } from '@/context/SupabaseGameContext'

const SupabaseWeeklySummary: React.FC = () => {
  const { currentSession, taskAssignments, createSession } = useSupabaseGame()

  // Calculate statistics
  const completedTasks = taskAssignments.filter((t: any) => t.status === 'completed')
  const pendingTasks = taskAssignments.filter((t: any) => t.status === 'pending')
  const inProgressTasks = taskAssignments.filter((t: any) => t.status === 'in_progress')

  const totalTasks = taskAssignments.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  // Check if it's Saturday morning for catch-up mode
  const today = new Date()
  const isSaturday = today.getDay() === 6
  const isMorning = today.getHours() < 12

  return (
    <div className="card-16bit mb-6">
      <h2 className="font-pixel text-neon-pink mb-4 text-center neon-text">
        📊 RESUMEN SEMANAL #{currentSession?.week_number || 1}
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* General statistics */}
        <div className="space-y-2">
          <h3 className="font-pixel text-xs text-neon-cyan">PROGRESO GENERAL</h3>
          <div className="font-mono text-sm">
            <div>✅ Completadas: {completedTasks.length}</div>
            <div>⚡ En progreso: {inProgressTasks.length}</div>
            <div>⏱️ Pendientes: {pendingTasks.length}</div>
            <div className="text-neon-green">
              📈 Finalización: {completionRate}%
            </div>
          </div>
        </div>

        {/* Session info */}
        <div className="space-y-2">
          <h3 className="font-pixel text-xs text-neon-cyan">SESIÓN ACTUAL</h3>
          <div className="font-mono text-sm">
            <div>📅 Inicio: {currentSession?.week_start_date}</div>
            <div>📊 Estado: {currentSession?.status?.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Catch-up mode on Saturday mornings */}
      {isSaturday && isMorning && (
        <div className="p-4 border border-neon-yellow bg-retro-darkgray mb-4">
          <h3 className="font-pixel text-xs text-neon-yellow mb-2">
            ⚡ MODO CATCH-UP DISPONIBLE ⚡
          </h3>
          <p className="font-mono text-xs text-retro-lightgray mb-3">
            Es sábado por la mañana. El jugador con menos puntos puede hacer tareas extra para equilibrar.
          </p>
        </div>
      )}

      {/* Button for new week */}
      <div className="text-center">
        <button
          onClick={createSession}
          className="btn-16bit-cyan"
        >
          🔄 NUEVA SEMANA
        </button>
      </div>
    </div>
  )
}

export default SupabaseWeeklySummary