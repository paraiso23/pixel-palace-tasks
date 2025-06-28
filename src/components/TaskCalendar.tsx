
import React from 'react';
import { useGame } from '../context/GameContext';
import TaskCard from './TaskCard';

interface TaskCalendarProps {
  selectedUser?: 'eli' | 'orlando';
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ selectedUser }) => {
  const { state } = useGame();
  const { scheduledTasks, tasks } = state;

  // Agrupar tareas por fecha
  const tasksByDate = scheduledTasks.reduce((acc, scheduledTask) => {
    if (!acc[scheduledTask.date]) {
      acc[scheduledTask.date] = { morning: [], afternoon: [] };
    }
    acc[scheduledTask.date][scheduledTask.timeSlot].push(scheduledTask);
    return acc;
  }, {} as Record<string, { morning: any[], afternoon: any[] }>);

  // Obtener próximos 14 días
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-4">
      <h2 className="font-pixel text-neon-green text-center mb-6 neon-text">
        📅 CALENDARIO DE TAREAS
      </h2>
      
      <div className="grid gap-4">
        {getDates().map((date) => {
          const dateString = date.toISOString().split('T')[0];
          const dayTasks = tasksByDate[dateString] || { morning: [], afternoon: [] };
          
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
                {/* Mañana */}
                <div>
                  <h4 className="font-mono text-xs text-retro-lightgray mb-2">
                    🌅 MAÑANA
                  </h4>
                  <div className="space-y-2">
                    {dayTasks.morning.map((scheduledTask) => (
                      <TaskCard
                        key={scheduledTask.id}
                        scheduledTask={scheduledTask}
                        task={tasks[scheduledTask.taskId]}
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

                {/* Tarde */}
                <div>
                  <h4 className="font-mono text-xs text-retro-lightgray mb-2">
                    🌆 TARDE
                  </h4>
                  <div className="space-y-2">
                    {dayTasks.afternoon.map((scheduledTask) => (
                      <TaskCard
                        key={scheduledTask.id}
                        scheduledTask={scheduledTask}
                        task={tasks[scheduledTask.taskId]}
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
          );
        })}
      </div>
    </div>
  );
};

export default TaskCalendar;
