export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      orders: {
        Row: {
          created_at: string | null;
          customer_name: string;
          customer_phone: string;
          id: string;
          items: Json;
          notes: string | null;
          status: string;
          total: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          customer_name: string;
          customer_phone: string;
          id?: string;
          items?: Json;
          notes?: string | null;
          status?: string;
          total?: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          customer_name?: string;
          customer_phone?: string;
          id?: string;
          items?: Json;
          notes?: string | null;
          status?: string;
          total?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          badge: string | null;
          category: string;
          created_at: string | null;
          description: string | null;
          genero: string;
          id: string;
          image_url: string | null;
          name: string;
          price: number;
          stock: number | null;
          updated_at: string | null;
        };
        Insert: {
          badge?: string | null;
          category: string;
          created_at?: string | null;
          description?: string | null;
          genero?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          price: number;
          stock?: number | null;
          updated_at?: string | null;
        };
        Update: {
          badge?: string | null;
          category?: string;
          created_at?: string | null;
          description?: string | null;
          genero?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          price?: number;
          stock?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id: string;
          role?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_crochet_landing_product_image: {
        Args: {
          input_alt_text?: string;
          input_is_cover?: boolean;
          input_product_id: string;
          input_sort_order?: number;
          input_storage_path: string;
        };
        Returns: Json;
      };
      create_crochet_landing_product: {
        Args: {
          product_badge?: string;
          product_description?: string;
          product_is_published?: boolean;
          product_name: string;
          product_slug?: string;
          product_sort_order?: number;
        };
        Returns: Json;
      };
      delete_crochet_landing_product: {
        Args: { product_id: string };
        Returns: undefined;
      };
      delete_crochet_landing_product_image: {
        Args: { input_image_id: string };
        Returns: string;
      };
      get_crochet_landing_admin_products: {
        Args: never;
        Returns: Json;
      };
      get_crochet_landing_gallery: {
        Args: never;
        Returns: {
          badge: string | null;
          cover_alt: string | null;
          cover_path: string | null;
          description: string | null;
          id: string;
          name: string;
          slug: string;
        }[];
      };
      set_crochet_landing_cover_image: {
        Args: { input_image_id: string };
        Returns: Json;
      };
      update_crochet_landing_product: {
        Args: {
          product_badge?: string;
          product_description?: string;
          product_id: string;
          product_is_published?: boolean;
          product_name: string;
          product_slug?: string;
          product_sort_order?: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer Row;
    }
    ? Row
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer Row;
      }
      ? Row
      : never
    : never;
