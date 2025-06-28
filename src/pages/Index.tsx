
import React, { useState } from 'react';
import { GameProvider, useGame } from '../context/GameContext';
import UserSelector from '../components/UserSelector';
import ScoreBoard from '../components/ScoreBoard';
import TaskCalendar from '../components/TaskCalendar';
import WeeklySummary from '../components/WeeklySummary';

const GameContent: React.FC = () => {
  const { state } = useGame();
  const [selectedUser, setSelectedUser] = useState<'eli' | 'orlando' | undefined>();

  return (
    <div className="min-h-screen bg-retro-black p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-pixel text-2xl md:text-4xl text-neon-green neon-text mb-2">
          🎮 TASKGAME 16-BIT 🎮
        </h1>
        <p className="font-mono text-sm text-retro-lightgray">
          Gamificación de tareas domésticas • Estilo retro
        </p>
      </div>

      {/* Selector de usuario */}
      <UserSelector 
        users={state.users}
        onUserSelect={setSelectedUser}
        selectedUser={selectedUser}
      />

      {/* Mensaje si no hay usuario seleccionado */}
      {!selectedUser && (
        <div className="card-16bit text-center mb-6">
          <p className="font-mono text-neon-yellow animate-pixel-blink">
            ⚠️ Selecciona un jugador para interactuar con las tareas
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna principal: Calendario */}
        <div className="lg:col-span-2">
          <TaskCalendar selectedUser={selectedUser} />
        </div>

        {/* Columna lateral: Puntuaciones y resumen */}
        <div className="space-y-6">
          <ScoreBoard />
          <WeeklySummary />
          
          {/* Información adicional */}
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

      {/* Footer retro */}
      <div className="text-center mt-12 py-6 border-t border-retro-gray">
        <p className="font-pixel text-xs text-retro-lightgray">
          © 2024 TASKGAME 16-BIT • MADE WITH ❤️ IN PIXEL STYLE
        </p>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
