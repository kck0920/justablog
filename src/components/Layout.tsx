import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ThemeProvider } from "./ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { NewsletterSubscribe } from "./NewsletterSubscribe";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  useEffect(() => {
    // Check if Supabase is connected
    const checkSupabase = async () => {
      try {
        // Simple health check - try to query the database with a timeout
        const { count, error } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .limit(1);
        
        setSupabaseConnected(error ? false : true);
        
        if (error) {
          console.error("Supabase connection error:", error);
        } else {
          console.log("Supabase connection successful, found", count, "posts");
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setSupabaseConnected(false);
      }
    };
    
    checkSupabase();
  }, []);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        {supabaseConnected === false && (
          <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>
              Supabase 연결에 문제가 있습니다. 포스트를 저장하거나 불러올 수 없습니다.
            </span>
          </div>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        {!isAdminPage && (
          <div className="py-16 bg-gray-50 dark:bg-gray-900">
            <NewsletterSubscribe />
          </div>
        )}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
