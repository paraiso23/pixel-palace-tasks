import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          avatar: string
          color: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          avatar?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          name: string
          energy: number
          icon: string
          category: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          energy?: number
          icon?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          energy?: number
          icon?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          week_number: number
          week_start_date: string
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          week_number?: number
          week_start_date: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          week_number?: number
          week_start_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      task_assignments: {
        Row: {
          id: string
          session_id: string | null
          task_id: string | null
          assigned_date: string
          time_slot: string
          assigned_to_id: string | null
          status: string
          completed_by_id: string | null
          completed_at: string | null
          tokens: number
          is_catchup: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          session_id?: string | null
          task_id?: string | null
          assigned_date: string
          time_slot: string
          assigned_to_id?: string | null
          status?: string
          completed_by_id?: string | null
          completed_at?: string | null
          tokens?: number
          is_catchup?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          task_id?: string | null
          assigned_date?: string
          time_slot?: string
          assigned_to_id?: string | null
          status?: string
          completed_by_id?: string | null
          completed_at?: string | null
          tokens?: number
          is_catchup?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      scores: {
        Row: {
          id: string
          session_id: string | null
          user_id: string | null
          score_date: string
          daily_tokens: number | null
          weekly_tokens: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          session_id?: string | null
          user_id?: string | null
          score_date: string
          daily_tokens?: number | null
          weekly_tokens?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          user_id?: string | null
          score_date?: string
          daily_tokens?: number | null
          weekly_tokens?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}