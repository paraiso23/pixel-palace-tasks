
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, ScheduledTask, User } from '../types/game';

// Tareas predefinidas con iconos pixel art
const INITIAL_TASKS = {
  'lavar-platos': { id: 'lavar-platos', name: 'Lavar platos', energy: 4, tokens: 4, icon: '🍽️' },
  'barrer': { id: 'barrer', name: 'Barrer', energy: 3, tokens: 3, icon: '🧹' },
  'fregar-suelos': { id: 'fregar-suelos', name: 'Fregar suelos', energy: 10, tokens: 10, icon: '🧽' },
  'limpiar-banos': { id: 'limpiar-banos', name: 'Limpiar baños', energy: 8, tokens: 8, icon: '🚿' },
  'hacer-comida': { id: 'hacer-comida', name: 'Hacer comida', energy: 7, tokens: 7, icon: '🍳' },
  'poner-colada': { id: 'poner-colada', name: 'Poner colada', energy: 6, tokens: 6, icon: '👕' },
  'airear-recoger': { id: 'airear-recoger', name: 'Airear/recoger', energy: 4, tokens: 4, icon: '🛏️' },
  'limpiar-cacas-gato': { id: 'limpiar-cacas-gato', name: 'Limpiar cacas de gato', energy: 3, tokens: 3, icon: '🐱' },
  'cambiar-sabanas': { id: 'cambiar-sabanas', name: 'Cambiar sábanas', energy: 5, tokens: 5, icon: '🛌' },
};

const INITIAL_USERS: Record<string, User> = {
  eli: { id: 'eli', name: 'Eli', tokens: 0, weeklyTokens: 0 },
  orlando: { id: 'orlando', name: 'Orlando', tokens: 0, weeklyTokens: 0 },
};

// Generar tareas para las próximas 2 semanas
const generateInitialSchedule = (): ScheduledTask[] => {
  const tasks: ScheduledTask[] = [];
  const taskIds = Object.keys(INITIAL_TASKS);
  
  // Generar para 14 días
  for (let day = 0; day < 14; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    const dateString = date.toISOString().split('T')[0];
    
    // 2-3 tareas por día, distribuidas en mañana y tarde
    const dailyTaskCount = Math.floor(Math.random() * 2) + 2; // 2-3 tareas
    const selectedTasks = [...taskIds].sort(() => 0.5 - Math.random()).slice(0, dailyTaskCount);
    
    selectedTasks.forEach((taskId, index) => {
      const timeSlot = index % 2 === 0 ? 'morning' : 'afternoon';
      tasks.push({
        id: `${taskId}-${dateString}-${timeSlot}`,
        taskId,
        date: dateString,
        timeSlot,
        status: 'pending'
      });
    });
  }
  
  return tasks;
};

const INITIAL_STATE: GameState = {
  users: INITIAL_USERS,
  tasks: INITIAL_TASKS,
  scheduledTasks: generateInitialSchedule(),
  currentWeek: 1,
  isCatchUpMode: false,
};

type GameAction = 
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; userId: 'eli' | 'orlando' } }
  | { type: 'START_TASK'; payload: { taskId: string; userId: 'eli' | 'orlando' } }
  | { type: 'RESET_WEEK' }
  | { type: 'ENABLE_CATCH_UP' }
  | { type: 'LOAD_STATE'; payload: GameState };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'COMPLETE_TASK': {
      const { taskId, userId } = action.payload;
      const scheduledTask = state.scheduledTasks.find(t => t.id === taskId);
      const task = scheduledTask ? state.tasks[scheduledTask.taskId] : null;
      
      if (!scheduledTask || !task || scheduledTask.status === 'completed') {
        return state;
      }

      const updatedScheduledTasks = state.scheduledTasks.map(t => 
        t.id === taskId 
          ? { ...t, status: 'completed' as const, completedBy: userId, completedAt: new Date() }
          : t
      );

      const updatedUsers = {
        ...state.users,
        [userId]: {
          ...state.users[userId],
          tokens: state.users[userId].tokens + task.tokens,
          weeklyTokens: state.users[userId].weeklyTokens + task.tokens,
        }
      };

      return {
        ...state,
        scheduledTasks: updatedScheduledTasks,
        users: updatedUsers,
      };
    }
    
    case 'START_TASK': {
      const { taskId, userId } = action.payload;
      const updatedScheduledTasks = state.scheduledTasks.map(t => 
        t.id === taskId && t.status === 'pending'
          ? { ...t, status: 'in-progress' as const, assignedTo: userId }
          : t
      );

      return {
        ...state,
        scheduledTasks: updatedScheduledTasks,
      };
    }

    case 'ENABLE_CATCH_UP': {
      // Lógica para el sábado por la mañana - modo catch-up
      const userTokens = Object.values(state.users).map(u => u.weeklyTokens);
      const minTokens = Math.min(...userTokens);
      const maxTokens = Math.max(...userTokens);
      
      return {
        ...state,
        isCatchUpMode: maxTokens - minTokens > 10, // Solo si hay diferencia significativa
      };
    }

    case 'RESET_WEEK': {
      const resetUsers = Object.keys(state.users).reduce((acc, userId) => {
        acc[userId] = { ...state.users[userId], weeklyTokens: 0 };
        return acc;
      }, {} as Record<string, User>);

      return {
        ...state,
        users: resetUsers,
        currentWeek: state.currentWeek + 1,
        isCatchUpMode: false,
      };
    }

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  completeTask: (taskId: string, userId: 'eli' | 'orlando') => void;
  startTask: (taskId: string, userId: 'eli' | 'orlando') => void;
  enableCatchUp: () => void;
  resetWeek: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const savedState = localStorage.getItem('taskgame-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('taskgame-state', JSON.stringify(state));
  }, [state]);

  const completeTask = (taskId: string, userId: 'eli' | 'orlando') => {
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, userId } });
  };

  const startTask = (taskId: string, userId: 'eli' | 'orlando') => {
    dispatch({ type: 'START_TASK', payload: { taskId, userId } });
  };

  const enableCatchUp = () => {
    dispatch({ type: 'ENABLE_CATCH_UP' });
  };

  const resetWeek = () => {
    dispatch({ type: 'RESET_WEEK' });
  };

  return (
    <GameContext.Provider value={{
      state,
      completeTask,
      startTask,
      enableCatchUp,
      resetWeek,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
