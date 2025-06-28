
import React from 'react';
import { useGame } from '../context/GameContext';

const WeeklySummary: React.FC = () => {
  const { state, resetWeek, enableCatchUp } = useGame();
  const { users, scheduledTasks, currentWeek } = state;

  // Calcular estadísticas de la semana
  const completedTasks = scheduledTasks.filter(t => t.status === 'completed');
  const pendingTasks = scheduledTasks.filter(t => t.status === 'pending');
  const inProgressTasks = scheduledTasks.filter(t => t.status === 'in-progress');

  const tasksByUser = {
    eli: completedTasks.filter(t => t.completedBy === 'eli').length,
    orlando: completedTasks.filter(t => t.completedBy === 'orlando').length,
  };

  const totalTasks = scheduledTasks.length;
  const completionRate = Math.round((completedTasks.length / totalTasks) * 100);

  // Verificar si es sábado para el modo catch-up
  const today = new Date();
  const isSaturday = today.getDay() === 6;
  const isMorning = today.getHours() < 12;

  return (
    <div className="card-16bit mb-6">
      <h2 className="font-pixel text-neon-pink mb-4 text-center neon-text">
        📊 RESUMEN SEMANAL #{currentWeek}
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Estadísticas generales */}
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

        {/* Estadísticas por usuario */}
        <div className="space-y-2">
          <h3 className="font-pixel text-xs text-neon-cyan">TAREAS POR JUGADOR</h3>
          <div className="font-mono text-sm">
            <div>👤 Eli: {tasksByUser.eli} tareas</div>
            <div>👤 Orlando: {tasksByUser.orlando} tareas</div>
          </div>
        </div>
      </div>

      {/* Modo Catch-up los sábados por la mañana */}
      {isSaturday && isMorning && (
        <div className="p-4 border border-neon-yellow bg-retro-darkgray mb-4">
          <h3 className="font-pixel text-xs text-neon-yellow mb-2">
            ⚡ MODO CATCH-UP DISPONIBLE ⚡
          </h3>
          <p className="font-mono text-xs text-retro-lightgray mb-3">
            Es sábado por la mañana. El jugador con menos puntos puede hacer tareas extra para equilibrar.
          </p>
          <button
            onClick={enableCatchUp}
            className="btn-16bit text-xs"
          >
            ACTIVAR CATCH-UP
          </button>
        </div>
      )}

      {/* Botón para nueva semana */}
      <div className="text-center">
        <button
          onClick={resetWeek}
          className="btn-16bit-cyan"
        >
          🔄 NUEVA SEMANA
        </button>
      </div>
    </div>
  );
};

export default WeeklySummary;
