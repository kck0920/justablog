import { Button } from "@/components/ui/button";

type PostErrorProps = {
  error: Error | null;
  onBack: () => void;
};

export const PostError: React.FC<PostErrorProps> = ({ error, onBack }) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            게시물을 불러올 수 없습니다
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
