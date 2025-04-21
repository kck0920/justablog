
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FeaturedToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const FeaturedToggle: React.FC<FeaturedToggleProps> = ({
  checked,
  onCheckedChange
}) => {
  return (
    <div className="flex items-center space-x-2 py-2">
      <Checkbox
        id="featured"
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <Label htmlFor="featured">특집 글로 표시하기</Label>
    </div>
  );
};
