
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
        <p className="text-2xl font-semibold text-foreground mb-2">페이지를 찾을 수 없습니다</p>
        <p className="text-muted-foreground mb-8">요청하신 페이지가 존재하지 않거나 삭제되었습니다.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={goBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            이전 페이지
          </Button>
          <Button onClick={goHome} className="flex items-center gap-2">
            <Home size={16} />
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
