import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// HTML 엔티티 디코딩 함수
const decodeHTMLEntities = (text: string): string => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

// 한글 slug 생성 함수
const generateSlug = (text: string): string => {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .toLowerCase()
    .replace(/[^가-힣a-z0-9\s-]/g, '') // 한글, 영문, 숫자, 공백, 하이픈만 허용
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변경
    .replace(/--+/g, '-') // 중복 하이픈 제거
    .trim() || 'section'; // 빈 문자열인 경우 기본값 사용
};

type PostContentProps = {
  content: string;
  format?: 'markdown' | 'html';
};

export const PostContent: React.FC<PostContentProps> = ({ 
  content,
  format = 'markdown' 
}) => {
  const [renderedContent, setRenderedContent] = useState<string>("");
  
  useEffect(() => {
    const parseContent = async () => {
      if (format === 'markdown') {
        try {
          // marked 설정 - GitHub Flavored Markdown 사용
          const headings = new Map<string, number>();
          
          marked.use({
            gfm: true,
            breaks: true,
            async: true,
            pedantic: false,
            smartLists: true,
            smartypants: true,
            hooks: {
              preprocess(markdown) {
                // HTML 엔티티 디코딩
                return decodeHTMLEntities(markdown);
              },
              postprocess(html) {
                // 헤더에 ID 추가
                return html.replace(
                  /<h([1-6])>(.*?)<\/h\1>/g,
                  (match, level, content) => {
                    const text = content.replace(/<[^>]*>/g, '');
                    let slug = generateSlug(text);
                    
                    // 중복된 slug 처리
                    const count = headings.get(slug) || 0;
                    if (count > 0) {
                      slug = `${slug}-${count}`;
                    }
                    headings.set(slug, count + 1);
                    
                    return `
                      <h${level} id="${slug}">
                        <a href="#${slug}" class="anchor">
                          ${content}
                        </a>
                      </h${level}>
                    `;
                  }
                );
              }
            }
          });
          
          const parsed = await marked.parse(content || '');
          // 마크다운으로 파싱된 HTML을 sanitize하되 더 많은 태그 허용
          const sanitized = DOMPurify.sanitize(parsed, {
            ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'details', 'summary'], 
            ADD_ATTR: ['target', 'rel', 'src', 'href', 'alt', 'class', 'id', 'width', 'height', 'style', 'contenteditable', 'data-ke-size', 'data-ke-type', 'data-ke-style'], 
            FORCE_BODY: false,
            ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 
              'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 
              'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span',
              'details', 'summary'],
            ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'class', 'id', 'width', 'height', 'style', 'contenteditable', 'data-ke-size', 'data-ke-type', 'data-ke-style']
          });
          setRenderedContent(sanitized);
        } catch (err) {
          console.error("마크다운 파싱 오류:", err);
          setRenderedContent(`<p>콘텐츠 파싱 중 오류가 발생했습니다.</p><p>${content}</p>`);
        }
      } else if (format === 'html') {
        // HTML 형식은 직접 sanitize만 수행하되 더 많은 태그 허용
        const sanitized = DOMPurify.sanitize(content || '', {
          ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
          ADD_ATTR: ['target', 'rel', 'src', 'href', 'alt', 'class', 'id', 'width', 'height', 'style', 'contenteditable', 'data-ke-size', 'data-ke-type', 'data-ke-style'],
          FORCE_BODY: false,
          ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span'],
          ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'class', 'id', 'width', 'height', 'style', 'contenteditable', 'data-ke-size', 'data-ke-type', 'data-ke-style']
        });
        setRenderedContent(sanitized);
      } else {
        // 알 수 없는 형식
        setRenderedContent(`<p>지원하지 않는 포맷: ${format}</p><p>${content}</p>`);
      }
    };

    parseContent();
  }, [content, format]);
  
  return (
    <div 
      className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-code:text-blue-500 dark:prose-code:text-blue-400 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic [&_.anchor]:no-underline hover:[&_.anchor]:underline [&_h1]:scroll-mt-20 [&_h2]:scroll-mt-16 [&_h3]:scroll-mt-16 [&_h4]:scroll-mt-16 [&_h5]:scroll-mt-16 [&_h6]:scroll-mt-16 [&_p]:text-gray-900 dark:[&_p]:text-gray-100 [&_li]:text-gray-900 dark:[&_li]:text-gray-100 [&_span]:text-gray-900 dark:[&_span]:text-gray-100 [&_div]:text-gray-900 dark:[&_div]:text-gray-100" 
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};
