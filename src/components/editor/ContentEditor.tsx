import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Code, Image, Italic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentEditorProps {
  content: string;
  onChange: (value: string) => void;
  format: 'plain' | 'markdown' | 'html';
  onFormatChange: (format: 'plain' | 'markdown' | 'html') => void;
  onImageUpload: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onChange,
  format,
  onFormatChange,
  onImageUpload
}) => {
  const insertFormatting = (type: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = "";
    
    if (format === 'plain') {
      // 일반 텍스트 포맷에서는 서식을 적용하지 않음
      return;
    }
    
    switch (type) {
      case 'bold':
        newText = format === 'markdown' ? `**${selectedText}**` : `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        newText = format === 'markdown' ? `*${selectedText}*` : `<em>${selectedText}</em>`;
        break;
      case 'code':
        newText = format === 'markdown' ? `\`${selectedText}\`` : `<code>${selectedText}</code>`;
        break;
      default:
        return;
    }
    
    const updatedContent = content.substring(0, start) + newText + content.substring(end);
    onChange(updatedContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + newText.length;
      textarea.selectionEnd = start + newText.length;
    }, 0);
  };

  const getPlaceholder = () => {
    switch (format) {
      case 'plain':
        return "일반 텍스트로 블로그 포스트를 작성하세요...";
      case 'markdown':
        return "마크다운 형식으로 블로그 포스트를 작성하세요...";
      case 'html':
        return "HTML 형식으로 블로그 포스트를 작성하세요...";
      default:
        return "블로그 포스트를 작성하세요...";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="content">내용</Label>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={format} onValueChange={(val: 'plain' | 'markdown' | 'html') => val && onFormatChange(val)}>
            <ToggleGroupItem value="plain" aria-label="일반">일반</ToggleGroupItem>
            <ToggleGroupItem value="markdown" aria-label="마크다운">마크다운</ToggleGroupItem>
            <ToggleGroupItem value="html" aria-label="HTML">HTML</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <div className="flex items-center gap-2 py-2">
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={() => insertFormatting('bold')}
          disabled={format === 'plain'}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={() => insertFormatting('italic')}
          disabled={format === 'plain'}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={() => insertFormatting('code')}
          disabled={format === 'plain'}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" onClick={onImageUpload} className="ml-2">
          <Image className="h-4 w-4 mr-2" />
          이미지 삽입
        </Button>
      </div>
      
      <Textarea
        id="content"
        placeholder={getPlaceholder()}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[400px] h-full w-full text-base leading-relaxed resize-y font-mono whitespace-pre-wrap"
      />
    </div>
  );
};
