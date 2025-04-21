
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

interface SlugFieldProps {
  slug: string;
  autoGenerate: boolean;
  onChange: (value: string) => void;
  onAutoGenerateChange: (auto: boolean) => void;
  regenerateSlug: () => void;
  title: string;
}

export const SlugField: React.FC<SlugFieldProps> = ({ 
  slug, 
  autoGenerate,
  onChange,
  regenerateSlug,
  title
}) => {
  // URL인지 체크하는 함수
  const isUrl = (str: string) => {
    return str.startsWith('http://') || str.startsWith('https://');
  };

  const isInvalidSlug = isUrl(slug);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // URL 형식이면 경고 표시하되 값은 그대로 전달
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="slug">URL 슬러그</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={regenerateSlug}
          type="button" 
          className="h-8"
          disabled={!title}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          자동 생성
        </Button>
      </div>
      <div className="relative">
        <Input
          id="slug"
          placeholder="url-slug-here"
          value={slug}
          onChange={handleChange}
          className={`font-mono text-sm ${isInvalidSlug ? 'border-red-500 pr-10' : ''}`}
        />
        {isInvalidSlug && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
            <AlertCircle className="h-4 w-4" />
          </div>
        )}
      </div>
      {isInvalidSlug ? (
        <p className="text-xs text-red-500">
          슬러그는 URL 전체가 아닌 URL의 마지막 부분만 입력해야 합니다 (예: my-post-title)
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {autoGenerate 
            ? "제목이 변경되면 슬러그가 자동으로 업데이트됩니다." 
            : "포스트 URL에 사용될 고유 식별자입니다. 영문, 숫자, 하이픈만 사용하세요."}
        </p>
      )}
    </div>
  );
};
