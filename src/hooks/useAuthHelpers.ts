
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function useAuthHelpers() {
  const { toast } = useToast();
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  // 로그인 핸들러
  const handleLogin = async (username: string, password: string) => {
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "로그인 성공",
          description: "관리자 대시보드로 이동합니다.",
        });
        navigate("/admin");
        return true;
      } else {
        toast({
          title: "로그인 실패",
          description: "비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "오류 발생",
        description: "로그인 중 문제가 발생했습니다.",
        variant: "destructive",
      });
      return false;
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    toast({
      title: "로그아웃 성공",
      description: "로그아웃 되었습니다.",
    });
    navigate("/login");
  };

  return {
    handleLogin,
    handleLogout
  };
}
