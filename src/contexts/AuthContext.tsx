
import * as React from "react";
import { AuthContextType, AuthUser } from "@/types/auth";
import { DEMO_USER } from "@/constants/auth";

// 환경 변수 사용 (실제 배포 시에는 .env 파일에 저장됨)
// 개발 환경에서는 기본값을 사용
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin1234";

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  
  // 로컬 스토리지에서 인증 상태 복원
  React.useEffect(() => {
    const storedAuth = localStorage.getItem("admin-auth");
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        if (auth.isAuthenticated) {
          setUser(DEMO_USER);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Auth storage parsing error:", e);
        localStorage.removeItem("admin-auth");
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // 간단한 비밀번호 확인 로직
    const isValid = password === ADMIN_PASSWORD;
    
    if (isValid) {
      setUser(DEMO_USER);
      setIsAuthenticated(true);
      
      // 인증 상태 로컬 스토리지에 저장 (세션 유지)
      localStorage.setItem("admin-auth", JSON.stringify({ isAuthenticated: true }));
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("admin-auth");
  };

  const value: AuthContextType = {
    user,
    supabaseUser: null,
    session: null,
    isAuthenticated,
    isInitializing,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
