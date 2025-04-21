
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Supabase Edge Function을 호출하여 이메일 전송
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { name, email, subject, message }
      });

      if (error) {
        throw new Error(error.message);
      }
      
      // 폼 초기화 및 성공 메시지
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast.success("메시지가 성공적으로 전송되었습니다! 곧 답변드리겠습니다.");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      toast.error("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">문의하기</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="text-lg">
              질문이나 제안이 있으시면 언제든지 문의해 주세요. 최대한 빠르게 답변 드리겠습니다.
            </p>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">이메일</h3>
              <p className="text-muted-foreground">kck0920@gmail.com</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">소셜 미디어</h3>
              <div className="flex space-x-4">
                <a href="https://everyone-protagonist.tistory.com/" className="text-muted-foreground hover:text-primary">Tistory</a>
                {/* <a href="#" className="text-muted-foreground hover:text-primary">Instagram</a>
                <a href="#" className="text-muted-foreground hover:text-primary">LinkedIn</a> */}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">제목</Label>
              <Input 
                id="subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">메시지</Label>
              <Textarea 
                id="message" 
                rows={5} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "전송 중..." : "메시지 보내기"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
