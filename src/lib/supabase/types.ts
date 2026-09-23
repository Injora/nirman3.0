export type RegistrationStatus = "registered" | "waitlisted" | "cancelled";

export type Registration = {
  id: string;
  user_id: string;
  registration_code: string;
  full_name: string;
  email: string;
  student_id: string;
  phone_number: string;
  branch: string;
  year: string;
  registration_status: RegistrationStatus;
  created_at: string;
  updated_at: string;
};

export type RegistrationInsert = {
  user_id: string;
  full_name: string;
  email: string;
  student_id: string;
  phone_number: string;
  branch: string;
  year: string;
};

export type Database = {
  public: {
    Tables: {
      registrations: {
        Row: Registration;
        Insert: RegistrationInsert;
        Update: Partial<RegistrationInsert>;
        Relationships: [];
      };
      admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};
