import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Fetch current game session
export const useCurrentSession = () => {
  return useQuery({
    queryKey: ['currentSession'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data
    }
  })
}

// Fetch users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    }
  })
}

// Fetch tasks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('name')

      if (error) throw error
      return data
    }
  })
}

// Fetch task assignments for current session
export const useTaskAssignments = (sessionId?: string) => {
  return useQuery({
    queryKey: ['taskAssignments', sessionId],
    queryFn: async () => {
      if (!sessionId) return []

      const { data, error } = await supabase
        .from('task_assignments')
        .select(`
          *,
          task:tasks(*),
          assigned_to:users!task_assignments_assigned_to_id_fkey(*),
          completed_by:users!task_assignments_completed_by_id_fkey(*)
        `)
        .eq('session_id', sessionId)
        .order('assigned_date')
        .order('time_slot')

      if (error) throw error
      return data
    },
    enabled: !!sessionId
  })
}

// Fetch scores for current session
export const useScores = (sessionId?: string) => {
  return useQuery({
    queryKey: ['scores', sessionId],
    queryFn: async () => {
      if (!sessionId) return []

      const { data, error } = await supabase
        .from('scores')
        .select(`
          *,
          user:users(*)
        `)
        .eq('session_id', sessionId)
        .order('score_date', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!sessionId
  })
}

// Create new game session
export const useCreateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // First, mark any existing active sessions as completed
      await supabase
        .from('game_sessions')
        .update({ status: 'completed' })
        .eq('status', 'active')

      // Create new session
      const startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          week_start_date: startDate.toISOString().split('T')[0],
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSession'] })
      toast.success('Nueva semana iniciada!')
    },
    onError: (error) => {
      toast.error('Error al crear nueva semana: ' + error.message)
    }
  })
}

// Complete task assignment
export const useCompleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ assignmentId, userId }: { assignmentId: string, userId: string }) => {
      const { data, error } = await supabase
        .from('task_assignments')
        .update({
          status: 'completed',
          completed_by_id: userId,
          completed_at: new Date().toISOString()
        })
        .eq('id', assignmentId)
        .select(`
          *,
          task:tasks(*)
        `)
        .single()

      if (error) throw error

      // Update or create score record
      const today = new Date().toISOString().split('T')[0]
      const tokens = data.tokens

      // Get current session
      const { data: session } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('status', 'active')
        .single()

      if (session) {
        // Try to update existing score record
        const { data: existingScore, error: fetchError } = await supabase
          .from('scores')
          .select('*')
          .eq('session_id', session.id)
          .eq('user_id', userId)
          .eq('score_date', today)
          .single()

        if (existingScore) {
          // Update existing score
          await supabase
            .from('scores')
            .update({
              daily_tokens: (existingScore.daily_tokens || 0) + tokens,
              weekly_tokens: (existingScore.weekly_tokens || 0) + tokens
            })
            .eq('id', existingScore.id)
        } else {
          // Create new score record
          await supabase
            .from('scores')
            .insert({
              session_id: session.id,
              user_id: userId,
              score_date: today,
              daily_tokens: tokens,
              weekly_tokens: tokens
            })
        }
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAssignments'] })
      queryClient.invalidateQueries({ queryKey: ['scores'] })
      toast.success('¡Tarea completada! 🎉')
    },
    onError: (error) => {
      toast.error('Error al completar tarea: ' + error.message)
    }
  })
}

// Start task assignment
export const useStartTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ assignmentId, userId }: { assignmentId: string, userId: string }) => {
      const { data, error } = await supabase
        .from('task_assignments')
        .update({
          status: 'in_progress',
          assigned_to_id: userId
        })
        .eq('id', assignmentId)
        .eq('status', 'pending')
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAssignments'] })
      toast.success('Tarea iniciada!')
    },
    onError: (error) => {
      toast.error('Error al iniciar tarea: ' + error.message)
    }
  })
}

// Add new task assignment
export const useAddTaskAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      sessionId, 
      taskId, 
      date, 
      timeSlot 
    }: { 
      sessionId: string
      taskId: string
      date: string
      timeSlot: 'morning' | 'afternoon'
    }) => {
      // Get task details to calculate tokens
      const { data: task } = await supabase
        .from('tasks')
        .select('energy')
        .eq('id', taskId)
        .single()

      const { data, error } = await supabase
        .from('task_assignments')
        .insert({
          session_id: sessionId,
          task_id: taskId,
          assigned_date: date,
          time_slot: timeSlot,
          tokens: task?.energy || 1,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAssignments'] })
      toast.success('Tarea añadida!')
    },
    onError: (error) => {
      toast.error('Error al añadir tarea: ' + error.message)
    }
  })
}

// Remove task assignment
export const useRemoveTaskAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('task_assignments')
        .delete()
        .eq('id', assignmentId)
        .eq('status', 'pending') // Only allow removing pending tasks

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskAssignments'] })
      toast.success('Tarea eliminada!')
    },
    onError: (error) => {
      toast.error('Error al eliminar tarea: ' + error.message)
    }
  })
}