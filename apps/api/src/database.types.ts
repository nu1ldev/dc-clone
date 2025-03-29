export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _channel_messages: {
        Row: {
          channel_id: number
          id: number
          message_id: number
        }
        Insert: {
          channel_id: number
          id?: number
          message_id: number
        }
        Update: {
          channel_id?: number
          id?: number
          message_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "_channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_channel_messages_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      _server_channels: {
        Row: {
          channel_id: number
          id: number
          server_token: string
        }
        Insert: {
          channel_id: number
          id?: number
          server_token?: string
        }
        Update: {
          channel_id?: number
          id?: number
          server_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "_server_channels_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_server_channels_server_token_fkey"
            columns: ["server_token"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["token"]
          },
        ]
      }
      _user_dms: {
        Row: {
          dm_id: number
          id: number
          user_id: number
          user_token: string
        }
        Insert: {
          dm_id: number
          id?: number
          user_id: number
          user_token: string
        }
        Update: {
          dm_id?: number
          id?: number
          user_id?: number
          user_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "_user_dms_dm_id_fkey"
            columns: ["dm_id"]
            isOneToOne: false
            referencedRelation: "dms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_user_dms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_user_dms_user_token_fkey"
            columns: ["user_token"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["token"]
          },
        ]
      }
      _user_friends: {
        Row: {
          a: string
          b: string
          id: number
        }
        Insert: {
          a: string
          b: string
          id?: number
        }
        Update: {
          a?: string
          b?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "_user_friends_a_fkey"
            columns: ["a"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["token"]
          },
          {
            foreignKeyName: "_user_friends_b_fkey"
            columns: ["b"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["token"]
          },
        ]
      }
      _user_servers: {
        Row: {
          id: number
          server_id: number | null
          server_token: string | null
          user_id: number | null
          user_token: string
        }
        Insert: {
          id?: number
          server_id?: number | null
          server_token?: string | null
          user_id?: number | null
          user_token: string
        }
        Update: {
          id?: number
          server_id?: number | null
          server_token?: string | null
          user_id?: number | null
          user_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "_user_servers_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_user_servers_server_token_fkey"
            columns: ["server_token"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["token"]
          },
          {
            foreignKeyName: "_user_servers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_user_servers_user_token_fkey"
            columns: ["user_token"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["token"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string
          id: number
          name: string
          server_id: number | null
          type: Database["public"]["Enums"]["channel_type"]
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          server_id?: number | null
          type?: Database["public"]["Enums"]["channel_type"]
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          server_id?: number | null
          type?: Database["public"]["Enums"]["channel_type"]
        }
        Relationships: [
          {
            foreignKeyName: "channels_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      dms: {
        Row: {
          created_at: string
          id: number
          image_url: string
          message_ids: number[] | null
          pinned_message_ids: number[] | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          message_ids?: number[] | null
          pinned_message_ids?: number[] | null
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          message_ids?: number[] | null
          pinned_message_ids?: number[] | null
        }
        Relationships: []
      }
      friend_requests: {
        Row: {
          id: number
          sender_id: number
          sent_to_id: number
          state: Database["public"]["Enums"]["friend_request_state"]
        }
        Insert: {
          id?: number
          sender_id: number
          sent_to_id: number
          state?: Database["public"]["Enums"]["friend_request_state"]
        }
        Update: {
          id?: number
          sender_id?: number
          sent_to_id?: number
          state?: Database["public"]["Enums"]["friend_request_state"]
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sent_to_id_fkey"
            columns: ["sent_to_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          author_id: number
          channel_id: number | null
          content: string
          dm_id: number | null
          embeds: string[] | null
          id: number
          sent_at: string
        }
        Insert: {
          author_id: number
          channel_id?: number | null
          content: string
          dm_id?: number | null
          embeds?: string[] | null
          id?: number
          sent_at?: string
        }
        Update: {
          author_id?: number
          channel_id?: number | null
          content?: string
          dm_id?: number | null
          embeds?: string[] | null
          id?: number
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_dm_id_fkey"
            columns: ["dm_id"]
            isOneToOne: false
            referencedRelation: "dms"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          banner_url: string | null
          created_at: string
          default_channel_id: number
          id: number
          image_url: string | null
          name: string
          owner_id: number
          rules_channel_id: number | null
          token: string
          user_token: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          default_channel_id: number
          id?: number
          image_url?: string | null
          name: string
          owner_id: number
          rules_channel_id?: number | null
          token?: string
          user_token?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          default_channel_id?: number
          id?: number
          image_url?: string | null
          name?: string
          owner_id?: number
          rules_channel_id?: number | null
          token?: string
          user_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servers_default_channel_id_fkey"
            columns: ["default_channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servers_rules_channel_id_fkey"
            columns: ["rules_channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servers_user_token_fkey"
            columns: ["user_token"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["token"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: number
          image_url: string
          password: string | null
          token: string
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: number
          image_url: string
          password?: string | null
          token?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: number
          image_url?: string
          password?: string | null
          token?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      channel_type: "TEXT" | "ANNOUNCEMENTS" | "RULES"
      friend_request_state: "ACCEPTED" | "DECLINED" | "PENDING"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
