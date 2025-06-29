import React from 'react'
import { useSupabaseGame } from '@/context/SupabaseGameContext'

const SupabaseScoreBoard: React.FC = () => {
  const { users, scores } = useSupabaseGame()

  // Calculate weekly totals for each user
  const userScores = users.map((user: any) => {
    const userWeeklyScores = scores.filter((score: any) => score.user_id === user.id)
    const weeklyTotal = userWeeklyScores.reduce((sum: number, score: any) => sum + (score.weekly_tokens || 0), 0)
    
    return {
      ...user,
      weeklyTokens: weeklyTotal
    }
  }).sort((a, b) => b.weeklyTokens - a.weeklyTokens)

  return (
    <div className="card-16bit mb-6">
      <h2 className="font-pixel text-neon-green mb-4 text-center neon-text">
        🏆 PUNTUACIÓN SEMANAL 🏆
      </h2>
      
      <div className="space-y-3">
        {userScores.map((user: any, index: number) => (
          <div 
            key={user.id}
            className={`flex justify-between items-center p-3 border ${
              index === 0 ? 'border-neon-green bg-retro-gray' : 'border-retro-lightgray'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-pixel text-lg">
                {index === 0 ? '👑' : `#${index + 1}`}
              </span>
              <span className="font-pixel text-sm text-neon-cyan">
                {user.name.toUpperCase()}
              </span>
            </div>
            
            <div className="text-right">
              <div className="font-pixel text-neon-green">
                {user.weeklyTokens} pts
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Difference indicator for catch-up */}
      {userScores.length === 2 && (
        <div className="mt-4 p-2 border border-neon-yellow text-center">
          <span className="font-mono text-xs text-neon-yellow">
            Diferencia: {Math.abs(userScores[0].weeklyTokens - userScores[1].weeklyTokens)} puntos
          </span>
        </div>
      )}
    </div>
  )
}

export default SupabaseScoreBoard