import { supabase } from "@/lib/supabase";

interface AdjacentPost {
  id: string;
  title: string;
  slug: string;
}

interface AdjacentPosts {
  previous: AdjacentPost | null;
  next: AdjacentPost | null;
}

export async function getAdjacentPosts(currentSlug: string): Promise<AdjacentPosts> {
  try {
    // 현재 포스트의 생성일자 가져오기
    const { data: currentPost, error: currentError } = await supabase
      .from('posts')
      .select('date')
      .eq('slug', currentSlug)
      .eq('status', 'published')
      .single();

    if (currentError || !currentPost) {
      console.error("Error fetching current post:", currentError);
      return { previous: null, next: null };
    }

    // 이전 글 가져오기 (현재 글보다 이전에 작성된 글 중 가장 최신)
    const { data: previousPost, error: prevError } = await supabase
      .from('posts')
      .select('id, title, slug')
      .eq('status', 'published')
      .lt('date', currentPost.date)
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (prevError && prevError.code !== 'PGRST116') {
      console.error("Error fetching previous post:", prevError);
    }

    // 다음 글 가져오기 (현재 글보다 나중에 작성된 글 중 가장 오래된)
    const { data: nextPost, error: nextError } = await supabase
      .from('posts')
      .select('id, title, slug')
      .eq('status', 'published')
      .gt('date', currentPost.date)
      .lt('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(1)
      .single();

    if (nextError && nextError.code !== 'PGRST116') {
      console.error("Error fetching next post:", nextError);
    }

    return {
      previous: previousPost || null,
      next: nextPost || null
    };
  } catch (error) {
    console.error("Error in getAdjacentPosts:", error);
    return { previous: null, next: null };
  }
} 