
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TitleFieldProps {
  title: string;
  onChange: (value: string) => void;
}

export const TitleField: React.FC<TitleFieldProps> = ({ 
  title, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">제목</Label>
      <Input
        id="title"
        placeholder="포스트 제목을 입력하세요"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        className="text-lg"
      />
    </div>
  );
};
