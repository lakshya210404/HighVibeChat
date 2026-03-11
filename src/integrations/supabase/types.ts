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
      confession_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "confession_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "confession_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      confession_comments: {
        Row: {
          confession_id: string
          content: string
          created_at: string
          display_name: string
          id: string
          likes_count: number
          parent_id: string | null
          user_id: string
        }
        Insert: {
          confession_id: string
          content: string
          created_at?: string
          display_name?: string
          id?: string
          likes_count?: number
          parent_id?: string | null
          user_id: string
        }
        Update: {
          confession_id?: string
          content?: string
          created_at?: string
          display_name?: string
          id?: string
          likes_count?: number
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "confession_comments_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "confession_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "confession_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      confession_likes: {
        Row: {
          confession_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          confession_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          confession_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "confession_likes_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
        ]
      }
      confession_votes: {
        Row: {
          confession_id: string
          created_at: string
          id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          confession_id: string
          created_at?: string
          id?: string
          user_id: string
          vote_type: string
        }
        Update: {
          confession_id?: string
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "confession_votes_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
        ]
      }
      confessions: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          downvotes: number
          emoji: string | null
          id: string
          likes_count: number
          title: string | null
          upvotes: number
          user_id: string | null
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          downvotes?: number
          emoji?: string | null
          id?: string
          likes_count?: number
          title?: string | null
          upvotes?: number
          user_id?: string | null
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          downvotes?: number
          emoji?: string | null
          id?: string
          likes_count?: number
          title?: string | null
          upvotes?: number
          user_id?: string | null
        }
        Relationships: []
      }
      friend_requests: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          room_id: string | null
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          room_id?: string | null
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          room_id?: string | null
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      matchmaking_queue: {
        Row: {
          auth_user_id: string | null
          country: string | null
          created_at: string
          gender: string | null
          id: string
          interests: string[] | null
          is_premium: boolean | null
          looking_for: string | null
          user_id: string
          vibe: string | null
        }
        Insert: {
          auth_user_id?: string | null
          country?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean | null
          looking_for?: string | null
          user_id: string
          vibe?: string | null
        }
        Update: {
          auth_user_id?: string | null
          country?: string | null
          created_at?: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean | null
          looking_for?: string | null
          user_id?: string
          vibe?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          room_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          room_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          room_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_access: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          product_id: string
          started_at: string
          stripe_session_id: string | null
          tier: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          product_id: string
          started_at?: string
          stripe_session_id?: string | null
          tier: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          product_id?: string
          started_at?: string
          stripe_session_id?: string | null
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          gender: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          gender?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          gender?: string | null
          id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          status: Database["public"]["Enums"]["room_status"]
          user1_auth_id: string | null
          user1_country: string | null
          user1_id: string
          user2_auth_id: string | null
          user2_country: string | null
          user2_id: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["room_status"]
          user1_auth_id?: string | null
          user1_country?: string | null
          user1_id: string
          user2_auth_id?: string | null
          user2_country?: string | null
          user2_id?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["room_status"]
          user1_auth_id?: string | null
          user1_country?: string | null
          user1_id?: string
          user2_auth_id?: string | null
          user2_country?: string | null
          user2_id?: string | null
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          is_online: boolean
          last_seen: string
          user_id: string
        }
        Insert: {
          is_online?: boolean
          last_seen?: string
          user_id: string
        }
        Update: {
          is_online?: boolean
          last_seen?: string
          user_id?: string
        }
        Relationships: []
      }
      webrtc_signals: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          room_id: string
          sender_id: string
          signal_data: Json
          signal_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          room_id: string
          sender_id: string
          signal_data: Json
          signal_type: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          room_id?: string
          sender_id?: string
          signal_data?: Json
          signal_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "webrtc_signals_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      room_status: "waiting" | "active" | "ended"
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
      room_status: ["waiting", "active", "ended"],
    },
  },
} as const
