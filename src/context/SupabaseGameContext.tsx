import React, { createContext, useContext, ReactNode } from 'react'
import { 
  useCurrentSession, 
  useUsers, 
  useTasks, 
  useTaskAssignments, 
  useScores,
  useCreateSession,
  useCompleteTask,
  useStartTask,
  useAddTaskAssignment,
  useRemoveTaskAssignment
} from '@/hooks/useSupabaseData'

interface SupabaseGameContextType {
  // Data
  currentSession: any
  users: any[]
  tasks: any[]
  taskAssignments: any[]
  scores: any[]
  
  // Loading states
  isLoading: boolean
  
  // Mutations
  createSession: () => void
  completeTask: (assignmentId: string, userId: string) => void
  startTask: (assignmentId: string, userId: string) => void
  addTaskAssignment: (taskId: string, date: string, timeSlot: 'morning' | 'afternoon') => void
  removeTaskAssignment: (assignmentId: string) => void
}

const SupabaseGameContext = createContext<SupabaseGameContextType | undefined>(undefined)

export const SupabaseGameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Queries
  const { data: currentSession, isLoading: sessionLoading } = useCurrentSession()
  const { data: users = [], isLoading: usersLoading } = useUsers()
  const { data: tasks = [], isLoading: tasksLoading } = useTasks()
  const { data: taskAssignments = [], isLoading: assignmentsLoading } = useTaskAssignments(currentSession?.id)
  const { data: scores = [], isLoading: scoresLoading } = useScores(currentSession?.id)

  // Mutations
  const createSessionMutation = useCreateSession()
  const completeTaskMutation = useCompleteTask()
  const startTaskMutation = useStartTask()
  const addTaskMutation = useAddTaskAssignment()
  const removeTaskMutation = useRemoveTaskAssignment()

  const isLoading = sessionLoading || usersLoading || tasksLoading || assignmentsLoading || scoresLoading

  const createSession = () => {
    createSessionMutation.mutate()
  }

  const completeTask = (assignmentId: string, userId: string) => {
    completeTaskMutation.mutate({ assignmentId, userId })
  }

  const startTask = (assignmentId: string, userId: string) => {
    startTaskMutation.mutate({ assignmentId, userId })
  }

  const addTaskAssignment = (taskId: string, date: string, timeSlot: 'morning' | 'afternoon') => {
    if (currentSession?.id) {
      addTaskMutation.mutate({ 
        sessionId: currentSession.id, 
        taskId, 
        date, 
        timeSlot 
      })
    }
  }

  const removeTaskAssignment = (assignmentId: string) => {
    removeTaskMutation.mutate(assignmentId)
  }

  return (
    <SupabaseGameContext.Provider value={{
      currentSession,
      users,
      tasks,
      taskAssignments,
      scores,
      isLoading,
      createSession,
      completeTask,
      startTask,
      addTaskAssignment,
      removeTaskAssignment
    }}>
      {children}
    </SupabaseGameContext.Provider>
  )
}

export const useSupabaseGame = () => {
  const context = useContext(SupabaseGameContext)
  if (context === undefined) {
    throw new Error('useSupabaseGame must be used within a SupabaseGameProvider')
  }
  return context
}