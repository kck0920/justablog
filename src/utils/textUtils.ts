
// HTML 태그 및 마크다운 문법을 제거하는 함수
export const stripHtmlAndMarkdown = (text: string): string => {
  if (!text) return "";
  
  // HTML 태그 제거
  let plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
  
  // 마크다운 이미지 태그 제거 (![alt](url) 형식)
  plainText = plainText.replace(/!\[(.*?)\]\((.*?)\)/g, "");
  
  // 마크다운 링크 제거 ([text](url) 형식) - 링크 텍스트만 유지
  plainText = plainText.replace(/\[(.*?)\]\((.*?)\)/g, "$1");
  
  // 마크다운 헤더(#) 제거
  plainText = plainText.replace(/^#+\s+/gm, "");
  
  // 마크다운 강조 구문 제거 (**, *, ~~, _, __)
  plainText = plainText.replace(/(\*\*|\_\_)(.*?)\1/g, "$2"); // 볼드체
  plainText = plainText.replace(/(\*|\_)(.*?)\1/g, "$2"); // 이탤릭체
  plainText = plainText.replace(/\~\~(.*?)\~\~/g, "$1"); // 취소선
  
  // 마크다운 코드 블록 제거 (```code```, `code`)
  plainText = plainText.replace(/```([\s\S]*?)```/g, "");
  plainText = plainText.replace(/`([^`]+)`/g, "$1");
  
  // 마크다운 인용문 제거 (> text)
  plainText = plainText.replace(/^\>\s+/gm, "");
  
  // 마크다운 목록 기호 제거 (-, *, +, 1.)
  plainText = plainText.replace(/^[\-\*\+]\s+/gm, "");
  plainText = plainText.replace(/^\d+\.\s+/gm, "");
  
  // 연속된 공백 및 줄바꿈 정리
  plainText = plainText.replace(/\s+/g, " ").trim();
  
  return plainText;
};
