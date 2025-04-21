
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  username: string | undefined;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ username, onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Create and manage your blog posts</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">안녕하세요, {username || "관리자"}님</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLogout}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
};
