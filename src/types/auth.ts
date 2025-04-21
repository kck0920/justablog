
import { Session, User } from "@supabase/supabase-js";

export interface AuthUser {
  username: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
