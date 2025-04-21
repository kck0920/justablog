import { supabase } from '@/lib/supabase';

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  status: 'active' | 'unsubscribed';
}

export const getSubscribers = async (): Promise<Subscriber[]> => {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('구독자 목록을 가져오는데 실패했습니다.');
  }

  return data || [];
}; 