
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="font-heading text-xl font-bold">Just A Blog</Link>
            <p className="mt-2 text-sm text-muted-foreground">
              AI, 건강, 재테크 등의 다양한 주제로 가득한 블로그
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <p>© {currentYear} Just A Blog. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
