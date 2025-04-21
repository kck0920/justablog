
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface PreviewButtonProps {
  onClick: () => void;
}

export const PreviewButton: React.FC<PreviewButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-end">
      <Button variant="outline" onClick={onClick} type="button">
        <Eye className="mr-2 h-4 w-4" />
        미리보기
      </Button>
    </div>
  );
};
