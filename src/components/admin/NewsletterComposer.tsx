import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { sendNewsletter, NewsletterData } from '@/api/newsletter/sendNewsletter';
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const NewsletterComposer = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState<'all' | 'active'>('active');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      const result = await sendNewsletter({
        subject,
        content,
        recipientType
      });

      toast({
        title: "발송 완료",
        description: `${result.recipientCount}명의 구독자에게 뉴스레터가 발송되었습니다.`,
      });

      // 폼 초기화
      setSubject("");
      setContent("");
    } catch (error: any) {
      toast({
        title: "발송 실패",
        description: error.message || "뉴스레터 발송 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>뉴스레터 작성</CardTitle>
        <CardDescription>구독자들에게 보낼 뉴스레터를 작성하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">제목</Label>
            <Input
              id="subject"
              placeholder="뉴스레터 제목을 입력하세요"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="뉴스레터 내용을 입력하세요 (마크다운 형식 지원)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSending}
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label>발송 대상</Label>
            <RadioGroup
              value={recipientType}
              onValueChange={(value: 'all' | 'active') => setRecipientType(value)}
              className="flex gap-4"
              disabled={isSending}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active">활성 구독자만</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">모든 구독자</Label>
              </div>
            </RadioGroup>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>발송 전 확인사항</AlertTitle>
            <AlertDescription>
              발송된 뉴스레터는 취소할 수 없으며, 모든 구독자에게 즉시 전송됩니다.
            </AlertDescription>
          </Alert>

          <Button type="submit" disabled={isSending} className="w-full">
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                발송 중...
              </>
            ) : (
              "뉴스레터 발송하기"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 