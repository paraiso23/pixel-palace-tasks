import React, { useState } from 'react'
import { SupabaseGameProvider, useSupabaseGame } from '@/context/SupabaseGameContext'
import SupabaseUserSelector from '@/components/SupabaseUserSelector'
import SupabaseScoreBoard from '@/components/SupabaseScoreBoard'
import SupabaseTaskCalendar from '@/components/SupabaseTaskCalendar'
import SupabaseWeeklySummary from '@/components/SupabaseWeeklySummary'

const SupabaseGameContent: React.FC = () => {
  const { users, isLoading, currentSession } = useSupabaseGame()
  const [selectedUser, setSelectedUser] = useState<string | undefined>()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-retro-black flex items-center justify-center">
        <div className="text-center">
          <div className="font-pixel text-neon-green text-xl animate-pixel-blink">
            CARGANDO...
          </div>
          <div className="font-mono text-retro-lightgray text-sm mt-2">
            Conectando con Supabase
          </div>
        </div>
      </div>
    )
  }

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-retro-black flex items-center justify-center">
        <div className="text-center card-16bit">
          <div className="font-pixel text-neon-yellow text-xl mb-4">
            ⚠️ NO HAY SESIÓN ACTIVA
          </div>
          <div className="font-mono text-retro-lightgray text-sm mb-4">
            Necesitas crear una nueva sesión de juego para comenzar
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-retro-black p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-pixel text-2xl md:text-4xl text-neon-green neon-text mb-2">
          🎮 TASKGAME 16-BIT 🎮
        </h1>
        <p className="font-mono text-sm text-retro-lightgray">
          Gamificación de tareas domésticas • Conectado a Supabase
        </p>
      </div>

      {/* User selector */}
      <SupabaseUserSelector 
        users={users}
        onUserSelect={setSelectedUser}
        selectedUser={selectedUser}
      />

      {/* Message if no user selected */}
      {!selectedUser && (
        <div className="card-16bit text-center mb-6">
          <p className="font-mono text-neon-yellow animate-pixel-blink">
            ⚠️ Selecciona un jugador para interactuar con las tareas
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column: Calendar */}
        <div className="lg:col-span-2">
          <SupabaseTaskCalendar selectedUser={selectedUser} />
        </div>

        {/* Side column: Scores and summary */}
        <div className="space-y-6">
          <SupabaseScoreBoard />
          <SupabaseWeeklySummary />
          
          {/* Additional information */}
          <div className="card-16bit">
            <h3 className="font-pixel text-xs text-neon-cyan mb-2">ℹ️ CÓMO JUGAR</h3>
            <div className="font-mono text-xs text-retro-lightgray space-y-1">
              <p>• Selecciona tu usuario</p>
              <p>• Inicia y completa tareas</p>
              <p>• Gana tokens por completar</p>
              <p>• El primero en completar gana</p>
              <p>• Catch-up los sábados AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Retro footer */}
      <div className="text-center mt-12 py-6 border-t border-retro-gray">
        <p className="font-pixel text-xs text-retro-lightgray">
          © 2024 TASKGAME 16-BIT • POWERED BY SUPABASE
        </p>
      </div>
    </div>
  )
}

const SupabaseIndex: React.FC = () => {
  return (
    <SupabaseGameProvider>
      <SupabaseGameContent />
    </SupabaseGameProvider>
  )
}

export default SupabaseIndex