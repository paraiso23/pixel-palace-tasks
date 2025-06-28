
import React from 'react';
import { useGame } from '../context/GameContext';

const ScoreBoard: React.FC = () => {
  const { state } = useGame();
  const { users } = state;

  const userArray = Object.values(users).sort((a, b) => b.weeklyTokens - a.weeklyTokens);

  return (
    <div className="card-16bit mb-6">
      <h2 className="font-pixel text-neon-green mb-4 text-center neon-text">
        🏆 PUNTUACIÓN SEMANAL 🏆
      </h2>
      
      <div className="space-y-3">
        {userArray.map((user, index) => (
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
              <div className="font-mono text-xs text-retro-lightgray">
                Total: {user.tokens}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de diferencia para catch-up */}
      {userArray.length === 2 && (
        <div className="mt-4 p-2 border border-neon-yellow text-center">
          <span className="font-mono text-xs text-neon-yellow">
            Diferencia: {Math.abs(userArray[0].weeklyTokens - userArray[1].weeklyTokens)} puntos
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
