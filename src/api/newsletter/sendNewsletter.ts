import { supabase } from '@/lib/supabase';

export interface NewsletterData {
  subject: string;
  content: string;
  recipientType: 'all' | 'active';
}

export const sendNewsletter = async (data: NewsletterData) => {
  try {
    // 구독자 목록 가져오기
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('email, status')
      .eq('status', data.recipientType === 'all' ? 'active' : 'active');

    if (fetchError) throw new Error('구독자 목록을 가져오는데 실패했습니다.');
    
    if (!subscribers || subscribers.length === 0) {
      throw new Error('발송할 구독자가 없습니다.');
    }

    // Edge Function 호출하여 이메일 발송
    const { error: sendError } = await supabase.functions.invoke('send-newsletter', {
      body: {
        subject: data.subject,
        content: data.content,
        recipients: subscribers.map(sub => sub.email)
      }
    });

    if (sendError) throw sendError;

    // 발송 기록 저장
    const { error: logError } = await supabase
      .from('newsletter_logs')
      .insert({
        subject: data.subject,
        content: data.content,
        recipient_count: subscribers.length,
        recipient_type: data.recipientType
      });

    if (logError) throw new Error('발송 기록 저장에 실패했습니다.');

    return {
      success: true,
      recipientCount: subscribers.length
    };
  } catch (error: any) {
    throw new Error(error.message || '뉴스레터 발송에 실패했습니다.');
  }
}; 