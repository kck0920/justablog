import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthHelpers } from "@/hooks/useAuthHelpers";

const categories = [
  { name: "AI", href: "/category/ai" },
  { name: "건강", href: "/category/health" },
  { name: "재테크", href: "/category/finance" },
  { name: "라이프스타일", href: "/category/lifestyle" },
  { name: "뉴스", href: "/category/news" },
  { name: "일반상식", href: "/category/knowledge" },
  { name: "이슈", href: "/category/issues" },
  { name: "퀴즈", href: "/quiz" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { handleLogout } = useAuthHelpers();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = () => {
    scrollToTop();
    setMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    scrollToTop();
    handleLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight" onClick={scrollToTop}>
            Just A Blog
          </Link>
          
          <nav className="hidden md:flex gap-6 items-center">
            {categories.map((category) => (
              category.name === "퀴즈" ? (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20 border-primary/20 hover:border-primary/30 font-medium transition-all duration-300 hover:scale-105 h-auto py-1 px-4 text-sm group"
                >
                  <Link to={category.href} className="flex items-center gap-1" onClick={scrollToTop}>
                    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse group-hover:animate-none">
                      ✨ {category.name}
                    </span>
                  </Link>
                </Button>
              ) : (
                <Link 
                  key={category.name} 
                  to={category.href}
                  onClick={scrollToTop}
                  className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:w-full after:h-0.5 after:bg-primary after:bottom-0 after:left-0 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 hover:scale-105 transition-transform duration-200"
                >
                  {category.name}
                </Link>
              )
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin" className="hover:scale-105 transition-transform duration-200" onClick={scrollToTop}>
                  관리자
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogoutClick}
                className="flex items-center gap-1 hover:scale-105 transition-transform duration-200"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login" className="flex items-center gap-1 hover:scale-105 transition-transform duration-200" onClick={scrollToTop}>
                <LogIn className="h-4 w-4" />
                로그인
              </Link>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden container-custom">
          <div className="flex flex-col space-y-3 py-4">
            {categories.map((category) => (
              category.name === "퀴즈" ? (
                <Button
                  key={category.name}
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/30 font-medium w-fit transition-all duration-200 hover:translate-x-1"
                >
                  <Link 
                    to={category.href}
                    onClick={handleLinkClick}
                  >
                    {category.name}
                  </Link>
                </Button>
              ) : (
                <Link 
                  key={category.name} 
                  to={category.href}
                  className="text-sm font-medium transition-colors hover:text-primary hover:translate-x-1 transition-transform duration-200"
                  onClick={handleLinkClick}
                >
                  {category.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
