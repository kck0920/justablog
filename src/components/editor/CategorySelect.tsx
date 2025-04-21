import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const categories = [
  { id: "ai", name: "AI" },
  { id: "health", name: "건강" },
  { id: "finance", name: "재테크" },
  { id: "lifestyle", name: "라이프스타일" },
  { id: "news", name: "뉴스" },
  { id: "knowledge", name: "일반상식" },
  { id: "issues", name: "이슈" }
];

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">카테고리</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="카테고리를 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 