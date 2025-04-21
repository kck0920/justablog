
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // CORS 요청 처리
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactFormData = await req.json();
    
    console.log("이메일 전송 요청:", { name, email, subject, message });
    
    // Resend를 사용하여 이메일 전송
    // 1. 관리자에게 보내는 알림 이메일
    const adminEmailResponse = await resend.emails.send({
      from: "문의 시스템 <onboarding@resend.dev>",
      to: "kck0920@gmail.com", // 관리자 이메일 주소
      subject: `새 문의: ${subject}`,
      html: `
        <h2>새로운 문의가 도착했습니다</h2>
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>제목:</strong> ${subject}</p>
        <p><strong>메시지:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top: 20px;">웹사이트의 문의 시스템을 통해 전송되었습니다.</p>
      `,
    });
    
    // 2. 사용자에게 보내는 확인 이메일
    const userEmailResponse = await resend.emails.send({
      from: "문의 확인 <onboarding@resend.dev>",
      to: email,
      subject: "문의가 접수되었습니다",
      html: `
        <h2>${name}님, 문의해 주셔서 감사합니다!</h2>
        <p>귀하의 문의가 성공적으로 접수되었습니다.</p>
        <p>아래 내용으로 문의를 접수했습니다:</p>
        <hr>
        <p><strong>제목:</strong> ${subject}</p>
        <p><strong>메시지:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p>가능한 빨리 답변 드리도록 하겠습니다.</p>
        <p>감사합니다.</p>
      `,
    });
    
    console.log("관리자 이메일 전송 결과:", adminEmailResponse);
    console.log("사용자 이메일 전송 결과:", userEmailResponse);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "메일이 성공적으로 전송되었습니다."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("이메일 전송 오류:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "메일 전송 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
