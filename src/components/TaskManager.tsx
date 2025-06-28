
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface TaskManagerProps {
  date: string;
  timeSlot: 'morning' | 'afternoon';
}

const TaskManager: React.FC<TaskManagerProps> = ({ date, timeSlot }) => {
  const { state, addTask, removeTask } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  
  const { tasks, scheduledTasks } = state;
  
  // Get current tasks for this date/timeSlot
  const currentTasks = scheduledTasks.filter(
    st => st.date === date && st.timeSlot === timeSlot
  );
  
  // Get available tasks that aren't already scheduled for this slot
  const availableTasks = Object.values(tasks).filter(
    task => !currentTasks.some(st => st.taskId === task.id)
  );

  const handleAddTask = (taskId: string) => {
    addTask(taskId, date, timeSlot);
  };

  const handleRemoveTask = (scheduledTaskId: string) => {
    removeTask(scheduledTaskId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="btn-16bit-cyan text-xs py-1 px-2">
          <Plus size={12} />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-retro-darkgray border-2 border-neon-green text-neon-green max-w-md">
        <DialogHeader>
          <DialogTitle className="font-pixel text-neon-green">
            GESTIONAR TAREAS
          </DialogTitle>
          <p className="font-mono text-xs text-retro-lightgray">
            {new Date(date).toLocaleDateString('es-ES', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            }).toUpperCase()} - {timeSlot === 'morning' ? 'MAÑANA' : 'TARDE'}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Tasks */}
          {currentTasks.length > 0 && (
            <div>
              <h3 className="font-pixel text-xs text-neon-cyan mb-2">
                TAREAS ACTUALES
              </h3>
              <div className="space-y-2">
                {currentTasks.map((scheduledTask) => {
                  const task = tasks[scheduledTask.taskId];
                  return (
                    <div
                      key={scheduledTask.id}
                      className="flex items-center justify-between p-2 border border-retro-gray"
                    >
                      <div className="flex items-center gap-2">
                        <span>{task.icon}</span>
                        <span className="font-mono text-xs">{task.name}</span>
                      </div>
                      {scheduledTask.status === 'pending' && (
                        <button
                          onClick={() => handleRemoveTask(scheduledTask.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Tasks */}
          {availableTasks.length > 0 && (
            <div>
              <h3 className="font-pixel text-xs text-neon-cyan mb-2">
                AGREGAR TAREA
              </h3>
              <div className="space-y-2">
                {availableTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 border border-retro-gray hover:border-neon-cyan transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{task.icon}</span>
                      <div>
                        <span className="font-mono text-xs">{task.name}</span>
                        <div className="font-mono text-xs opacity-75">
                          ⚡ {task.energy} • 🪙 {task.tokens}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddTask(task.id)}
                      className="btn-16bit text-xs py-1 px-2"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {availableTasks.length === 0 && currentTasks.length === 0 && (
            <div className="text-center text-retro-lightgray font-mono text-xs p-4">
              No hay tareas disponibles
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskManager;
