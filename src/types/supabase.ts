export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          status: 'active' | 'unsubscribed'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          status?: 'active' | 'unsubscribed'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          status?: 'active' | 'unsubscribed'
          created_at?: string
        }
        Relationships: []
      }
      // ... 기존 테이블들의 타입 정의는 유지
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


