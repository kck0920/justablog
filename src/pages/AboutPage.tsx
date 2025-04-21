
import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">블로그 소개</h1>
        
        <div className="space-y-6 text-lg">
          <p>
            Just A Blog는 다양한 주제에 대한 깊이 있는 인사이트와 유용한 정보를 제공하는 블로그입니다. 
            AI, 건강, 재테크, 라이프스타일, 뉴스, 일반상식, 그리고 다양한 이슈들에 대해 다루고 있습니다.
          </p>
          
          <Separator />
          
          <div>
            <h2 className="text-2xl font-bold mb-4">우리의 목표</h2>
            <p className="mb-4">
              Just A Blog는 단순한 정보 제공을 넘어, 독자들이 일상생활과 중요한 결정에 도움이 될 수 있는 
              인사이트와 지식을 제공하는 것을 목표로 합니다.
            </p>
            <p>
              복잡한 주제들을 쉽고 명확하게 설명하여, 누구나 이해하고 활용할 수 있도록 하고자 합니다.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">다루는 주제</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>AI:</strong> 인공지능 기술의 최신 동향과 일상 생활에 미치는 영향</li>
              <li><strong>건강:</strong> 신체적, 정신적 건강을 유지하기 위한 정보와 팁</li>
              <li><strong>재테크:</strong> 현명한 금융 결정과 자산 관리 방법</li>
              <li><strong>라이프스타일:</strong> 더 나은 삶을 위한 조언과 트렌드</li>
              <li><strong>뉴스:</strong> 중요한 시사 이슈와 그 영향</li>
              <li><strong>일반상식:</strong> 알아두면 유용한 다양한 지식</li>
              <li><strong>이슈:</strong> 사회적으로 중요한 주제들에 대한 분석</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">연락처</h2>
            <p>질문, 피드백, 또는 제안이 있으시다면 언제든지 연락해주세요:</p>
            <p className="mt-2">
              Email: <a href="mailto:contact@justablog.com" className="text-primary underline">kck0920@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
