import { supabase } from "@/integrations/supabase/client";
import { NewsletterSubscriber } from "./types";

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriber> {
  // 이메일 중복 체크
  const { data: existingSubscriber } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('email', email)
    .single();

  if (existingSubscriber) {
    if (existingSubscriber.status === 'unsubscribed') {
      // 구독 취소했던 사용자라면 다시 활성화
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({ status: 'active' })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
    throw new Error('이미 구독 중인 이메일입니다.');
  }

  // 새로운 구독자 추가
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([
      {
        email,
        status: 'active'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
} 