export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string
          author_name: string
          content: string
          created_at: string
          expires_at: string | null
          id: string
          priority: string
          title: string
        }
        Insert: {
          author_id: string
          author_name: string
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority?: string
          title: string
        }
        Update: {
          author_id?: string
          author_name?: string
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority?: string
          title?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          address: string | null
          age: number | null
          consultation_type: string | null
          created_at: string
          department: string | null
          doctor_id: string | null
          email: string | null
          fee: number | null
          gender: string | null
          id: string
          mobile: string
          notes: string | null
          patient_name: string
          patient_type: string | null
          status: string
          time_slot: string
          video_call_link: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          consultation_type?: string | null
          created_at?: string
          department?: string | null
          doctor_id?: string | null
          email?: string | null
          fee?: number | null
          gender?: string | null
          id?: string
          mobile: string
          notes?: string | null
          patient_name: string
          patient_type?: string | null
          status?: string
          time_slot: string
          video_call_link?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          consultation_type?: string | null
          created_at?: string
          department?: string | null
          doctor_id?: string | null
          email?: string | null
          fee?: number | null
          gender?: string | null
          id?: string
          mobile?: string
          notes?: string | null
          patient_name?: string
          patient_type?: string | null
          status?: string
          time_slot?: string
          video_call_link?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string
          id: string
          published: boolean
          read_time: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          published?: boolean
          read_time?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          published?: boolean
          read_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          replied_at: string | null
          reply_text: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          replied_at?: string | null
          reply_text?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          replied_at?: string | null
          reply_text?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      doctor_date_overrides: {
        Row: {
          created_at: string
          date: string
          doctor_id: string
          end_time: string | null
          id: string
          note: string | null
          slot_minutes: number | null
          start_time: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          doctor_id: string
          end_time?: string | null
          id?: string
          note?: string | null
          slot_minutes?: number | null
          start_time?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          doctor_id?: string
          end_time?: string | null
          id?: string
          note?: string | null
          slot_minutes?: number | null
          start_time?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctor_profiles: {
        Row: {
          created_at: string
          doctor_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      doctor_weekly_availability: {
        Row: {
          created_at: string
          doctor_id: string
          end_time: string
          id: string
          is_available: boolean
          slot_minutes: number
          start_time: string
          updated_at: string
          weekday: number
        }
        Insert: {
          created_at?: string
          doctor_id: string
          end_time?: string
          id?: string
          is_available?: boolean
          slot_minutes?: number
          start_time?: string
          updated_at?: string
          weekday: number
        }
        Update: {
          created_at?: string
          doctor_id?: string
          end_time?: string
          id?: string
          is_available?: boolean
          slot_minutes?: number
          start_time?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: []
      }
      internal_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_id: string
          sender_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_id: string
          sender_name: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
          sender_name?: string
        }
        Relationships: []
      }
      patient_notifications: {
        Row: {
          appointment_id: string | null
          email: string | null
          id: string
          message: string
          mobile: string | null
          notification_type: string
          patient_name: string
          sent_at: string
          sent_by: string
          sent_via: string
        }
        Insert: {
          appointment_id?: string | null
          email?: string | null
          id?: string
          message: string
          mobile?: string | null
          notification_type?: string
          patient_name: string
          sent_at?: string
          sent_by: string
          sent_via?: string
        }
        Update: {
          appointment_id?: string | null
          email?: string | null
          id?: string
          message?: string
          mobile?: string | null
          notification_type?: string
          patient_name?: string
          sent_at?: string
          sent_by?: string
          sent_via?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      staff_notifications: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_doctor_slug: { Args: never; Returns: string }
      get_booked_slots: {
        Args: { _day: string; _department: string }
        Returns: {
          time_slot: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "doctor" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "doctor", "staff"],
    },
  },
} as const
