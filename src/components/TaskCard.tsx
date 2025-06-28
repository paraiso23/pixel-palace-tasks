
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ScheduledTask, Task } from '../types/game';

interface TaskCardProps {
  scheduledTask: ScheduledTask;
  task: Task;
  selectedUser?: 'eli' | 'orlando';
}

const TaskCard: React.FC<TaskCardProps> = ({ scheduledTask, task, selectedUser }) => {
  const { completeTask, startTask } = useGame();
  const [showSpark, setShowSpark] = useState(false);

  const handleStart = () => {
    if (selectedUser && scheduledTask.status === 'pending') {
      startTask(scheduledTask.id, selectedUser);
    }
  };

  const handleComplete = () => {
    if (selectedUser && scheduledTask.status !== 'completed') {
      // Complete the task first
      completeTask(scheduledTask.id, selectedUser);
      
      // Then show the spark effect without blocking the update
      setShowSpark(true);
      setTimeout(() => setShowSpark(false), 400);
    }
  };

  const getStatusColor = () => {
    switch (scheduledTask.status) {
      case 'completed':
        return 'border-neon-green bg-neon-green text-retro-black';
      case 'in-progress':
        return 'border-neon-yellow bg-retro-gray text-neon-yellow';
      default:
        return 'border-retro-lightgray text-retro-lightgray hover:border-neon-cyan';
    }
  };

  const getStatusIcon = () => {
    switch (scheduledTask.status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '⚡';
      default:
        return '⏱️';
    }
  };

  const canInteract = selectedUser && scheduledTask.status !== 'completed';

  return (
    <div className={`relative p-3 border-2 transition-all duration-200 ${getStatusColor()}`}>
      {/* Efecto spark al completar */}
      {showSpark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-neon-green text-2xl animate-bounce">✨</div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg pixel-icon">{task.icon}</span>
          <div>
            <div className="font-mono text-xs font-bold">
              {task.name.toUpperCase()}
            </div>
            <div className="font-mono text-xs opacity-75">
              ⚡ {task.energy} energía • 🪙 {task.tokens} tokens
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          
          {canInteract && (
            <div className="flex gap-1">
              {scheduledTask.status === 'pending' && (
                <button
                  onClick={handleStart}
                  className="btn-16bit text-xs py-1 px-2"
                  disabled={!selectedUser}
                >
                  INICIAR
                </button>
              )}
              
              {scheduledTask.status !== 'completed' && (
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

      {/* Mostrar quién completó la tarea */}
      {scheduledTask.status === 'completed' && scheduledTask.completedBy && (
        <div className="mt-2 pt-2 border-t border-current">
          <div className="font-mono text-xs">
            Completada por: <span className="font-pixel">{scheduledTask.completedBy.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
