import React, { useState } from 'react';
import { UserProfile } from '../types';
import { calculateSajuElements } from '../utils/fortuneEngine';
import {
  Bot,
  Sparkles,
  Send,
  Wand2,
  Shield,
  HelpCircle,
  CheckCircle2,
  Coins,
  Heart,
  Briefcase,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { playSuccessSparkle, playChimeSound } from '../utils/soundEffects';

interface SajuAiTabProps {
  profile: UserProfile;
  onOpenProfile: () => void;
}

export const SajuAiTab: React.FC<SajuAiTabProps> = ({ profile, onOpenProfile }) => {
  const saju = calculateSajuElements(profile);

  const [selectedCategory, setSelectedCategory] = useState('오늘의 종합운');
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiFortuneResult, setAiFortuneResult] = useState<any>(null);

  // Quick Q&A State
  const [quickQuestion, setQuickQuestion] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'dosa'; message: string; keyAdvice?: string }[]>([
    {
      sender: 'dosa',
      message: `반갑습니다, ${profile.name || '인연'}님. 30년 명리학과 동양 지혜로 오늘 당신의 길을 밝혀드리겠습니다. 오늘 어떤 일이 마음에 걸리시나요?`,
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const categories = [
    { id: '종합운', label: '오늘의 종합운' },
    { id: '재물운', label: '금전·재물운' },
    { id: '애정운', label: '연애·인연운' },
    { id: '직장운', label: '직장·사업운' },
    { id: '학업운', label: '시험·합격운' },
    { id: '건강운', label: '건강·마음안정' },
  ];

  const handleGenerateAiFortune = async () => {
    setLoading(true);
    playChimeSound();
    try {
      const res = await fetch('/api/fortune/ai-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          birthDate: profile.birthDate,
          birthTime: profile.birthTime,
          gender: profile.gender,
          calendarType: profile.calendarType,
          category: selectedCategory,
          question: customQuestion || `${selectedCategory}에 대한 오늘의 상세한 운세와 오행 조언을 부탁드립니다.`,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiFortuneResult(json.data);
        playSuccessSparkle();
      } else {
        setAiFortuneResult({
          overallScore: 88,
          headline: '오행의 순환이 순조로워 뜻을 이루기 좋은 길일(吉日)',
          overallSummary: `${profile.name || '방문자'}님의 사주 기운(${saju.dominant})이 오늘 천간과 화합하여 막힌 일이 풀리고 매끄러운 진행이 예상됩니다. 다만 ${saju.lacking} 기운을 보강하는 생활 습관을 지키세요.`,
          wealth: { score: 90, advice: '안정적인 수익 흐름이 기대되며 계약운이 상승합니다.' },
          love: { score: 85, advice: '상대의 말에 먼저 귀 기울이면 호감과 신뢰가 커집니다.' },
          career: { score: 88, advice: '능력을 발휘할 무대가 열리니 주저 말고 도전하세요.' },
          health: { score: 80, advice: '수분 섭취와 바른 자세를 유지하며 스트레칭을 해주세요.' },
          luckyElements: {
            color: '딥 네이비 & 골드',
            number: '3, 8',
            direction: '남동쪽',
            item: '따뜻한 차 한 잔',
            food: '담백한 비빔밥',
            time: '오후 2시 ~ 4시',
          },
          dailyWarning: '감정적인 충동구매나 성급한 말 실수를 주의하세요.',
          dosaAdvice: '마음을 편안하게 비울 때 비로소 더 맑은 복이 차오르는 법입니다. 오늘 하루 당당하게 걸어가세요.',
        });
      }
    } catch (e) {
      console.error(e);
      setAiFortuneResult({
        overallScore: 85,
        headline: '차분한 내실 다지기가 큰 성공으로 이어지는 하루',
        overallSummary: '기운이 조화롭게 안정되어 있습니다. 서두르지 말고 계획된 일정을 하나씩 완수해 나가세요.',
        wealth: { score: 85, advice: '계획된 지출 외에는 아끼는 것이 길합니다.' },
        love: { score: 80, advice: '따뜻한 안부 전화 한 통이 큰 감동을 줍니다.' },
        career: { score: 88, advice: '꼼꼼한 마무리가 높은 평가를 받습니다.' },
        health: { score: 82, advice: '가벼운 산책으로 머리를 맑게 하세요.' },
        luckyElements: {
          color: '에메랄드 그린',
          number: '7',
          direction: '동쪽',
          item: '휴대용 텀블러',
          food: '신선한 샐러드',
          time: '오전 10시',
        },
        dailyWarning: '무리한 야근이나 과로는 피하세요.',
        dosaAdvice: '당신의 오늘 하루는 이미 충분히 귀하고 빛납니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuickChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim() || chatLoading) return;

    const userText = quickQuestion.trim();
    setQuickQuestion('');
    setChatLog((prev) => [...prev, { sender: 'user', message: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/fortune/ask-dosa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          userProfile: profile,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'dosa',
            message: json.data.dosaResponse,
            keyAdvice: json.data.keyAdvice,
          },
        ]);
        playSuccessSparkle();
      } else {
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'dosa',
            message: `인연님, 질문하신 바를 사주의 이치로 비추어보니, 지금은 무리하게 상황을 바꾸려 하기보다 내면의 확신을 다지고 신중하게 다음 기회를 엿볼 때입니다.`,
            keyAdvice: '조급함을 버리고 순리대로 진행하세요.',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'dosa',
          message: `마음의 번민을 내려놓으세요. 구름이 걷히면 반드시 맑은 해가 비추듯 좋은 결실이 따를 것입니다.`,
          keyAdvice: '오늘 하루 긍정의 마음가짐을 유지하세요.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto px-4 pt-2">
      {/* Intro Box */}
      <div className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F2ED] border border-[#E5E1DA] flex items-center justify-center text-[#5A5A40] shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-medium text-[#3A3A38] font-serif-kr flex items-center gap-1.5">
                AI 운세 도사 (명리학 분석)
              </h2>
              <p className="text-xs text-[#8D917A] font-sans">
                {profile.name || '나'} · {profile.birthDate || '1996-08-15'} ({profile.calendarType === 'solar' ? '양력' : '음력'})
              </p>
            </div>
          </div>

          <button
            type="button"
            id="saju-profile-edit-btn"
            onClick={onOpenProfile}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-[#F5F2ED] border border-[#E5E1DA] text-[#5A5A40] hover:border-[#D4AF37] font-sans font-bold transition-all"
          >
            사주 수정
          </button>
        </div>

        {/* Five Elements Breakdown (오행 균형 차트) */}
        <div className="bg-[#FDFBF7] rounded-[24px] p-4 border border-[#E5E1DA] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A5A40] font-sans">
              내 사주 오행(五行) 에너지 분포
            </span>
            <span className="text-[10px] text-[#D4AF37] font-sans font-bold">
              우세: {saju.dominant.split(' ')[0]}
            </span>
          </div>

          <div className="space-y-2 text-xs font-sans">
            {[
              { name: '목 (木)', label: '나무/성장', score: saju.wood, color: 'bg-[#5A7A58]' },
              { name: '화 (火)', label: '불/열정', score: saju.fire, color: 'bg-[#B85D43]' },
              { name: '토 (土)', label: '흙/안정', score: saju.earth, color: 'bg-[#C5A059]' },
              { name: '금 (金)', label: '쇠/결단', score: saju.metal, color: 'bg-[#8D917A]' },
              { name: '수 (水)', label: '물/지혜', score: saju.water, color: 'bg-[#5B7582]' },
            ].map((el, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-12 font-bold text-[#706C61] text-[11px]">{el.name}</span>
                <div className="flex-1 h-2 bg-[#E5E1DA]/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${el.color} rounded-full transition-all duration-700`}
                    style={{ width: `${el.score}%` }}
                  />
                </div>
                <span className="w-8 text-right font-semibold text-[#8C8279] text-[11px]">{el.score}%</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#5A5A40] bg-[#F5F2ED] p-3 rounded-2xl border border-[#E5E1DA] leading-relaxed">
            💡 <strong>오행 조화 처방:</strong> {saju.advice}
          </p>
        </div>
      </div>

      {/* AI Deep Reading Generator Form */}
      <section
        id="ai-fortune-generator-section"
        className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-[#3A3A38] font-serif-kr">오늘의 AI 맞춤 운세 풀이</h3>
        </div>

        {/* Category Pills */}
        <div className="grid grid-cols-3 gap-1.5 font-sans">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              id={`saju-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.label)}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === cat.label
                  ? 'bg-[#5A5A40] text-[#F5F2ED] border-[#5A5A40] shadow-sm font-bold'
                  : 'bg-[#FDFBF7] border-[#E5E1DA] text-[#8C8279] hover:text-[#3A3A38]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Custom Question input */}
        <div className="space-y-1.5 font-sans">
          <label className="text-[11px] text-[#8C8279] block">
            특별히 궁금한 고민이나 질문 (선택 사항)
          </label>
          <input
            type="text"
            id="saju-custom-question-input"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="예: 오늘 중요한 계약이나 소개팅이 있는데 어떻게 풀릴까요?"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E5E1DA] text-xs text-[#3C3C3B] placeholder-[#8C8279] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <button
          type="button"
          id="generate-ai-fortune-btn"
          onClick={handleGenerateAiFortune}
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-[#5A5A40] text-[#F5F2ED] font-sans font-bold text-xs shadow-sm hover:bg-[#4E4E36] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          {loading ? 'AI 도사님이 사주팔자를 분석 중입니다...' : '도사님께 오늘 심층 운세 풀이받기'}
        </button>
      </section>

      {/* AI Fortune Result Display */}
      {aiFortuneResult && (
        <section
          id="ai-fortune-result-card"
          className="bg-white border-2 border-[#D4AF37]/50 rounded-[36px] p-6 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-3">
            <div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FDFBF7] text-[#5A5A40] border border-[#E5E1DA] font-sans font-bold">
                {selectedCategory}
              </span>
              <h3 className="text-base font-medium text-[#3A3A38] font-serif-kr mt-1.5">
                "{aiFortuneResult.headline}"
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-light text-[#D4AF37] font-serif-kr">
                {aiFortuneResult.overallScore}점
              </span>
              <span className="text-[10px] text-[#8D917A] font-sans block uppercase tracking-widest">길운 지수</span>
            </div>
          </div>

          <div className="bg-[#FDFBF7] rounded-2xl p-4 border border-[#E5E1DA] text-xs text-[#3C3C3B] leading-relaxed">
            <p>{aiFortuneResult.overallSummary}</p>
          </div>

          {/* 4 Pillars Details from AI */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E1DA] shadow-sm space-y-1">
              <div className="flex items-center gap-1 font-bold text-[#5A5A40] font-sans text-xs">
                <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                재물 기운 ({aiFortuneResult.wealth?.score}점)
              </div>
              <p className="text-[11px] text-[#706C61] leading-snug">{aiFortuneResult.wealth?.advice}</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E1DA] shadow-sm space-y-1">
              <div className="flex items-center gap-1 font-bold text-[#5A5A40] font-sans text-xs">
                <Heart className="w-3.5 h-3.5 text-[#8D917A]" />
                애정 기운 ({aiFortuneResult.love?.score}점)
              </div>
              <p className="text-[11px] text-[#706C61] leading-snug">{aiFortuneResult.love?.advice}</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E1DA] shadow-sm space-y-1">
              <div className="flex items-center gap-1 font-bold text-[#5A5A40] font-sans text-xs">
                <Briefcase className="w-3.5 h-3.5 text-[#5A7A58]" />
                직장·학업 ({aiFortuneResult.career?.score}점)
              </div>
              <p className="text-[11px] text-[#706C61] leading-snug">{aiFortuneResult.career?.advice}</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E1DA] shadow-sm space-y-1">
              <div className="flex items-center gap-1 font-bold text-[#5A5A40] font-sans text-xs">
                <Activity className="w-3.5 h-3.5 text-[#5B7582]" />
                건강·심신 ({aiFortuneResult.health?.score}점)
              </div>
              <p className="text-[11px] text-[#706C61] leading-snug">{aiFortuneResult.health?.advice}</p>
            </div>
          </div>

          {/* Dosa Prescription Card */}
          <div className="bg-[#F5F2ED] border border-[#E5E1DA] rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-[#5A5A40] font-sans flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              도사의 특별 지혜 처방전
            </div>
            <p className="text-xs text-[#3A3A38] font-serif-kr italic leading-relaxed">
              "{aiFortuneResult.dosaAdvice}"
            </p>
            {aiFortuneResult.dailyWarning && (
              <p className="text-[11px] text-[#B85D43] pt-1 border-t border-[#E5E1DA]">
                ⚠️ <strong>주의 사항:</strong> {aiFortuneResult.dailyWarning}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 1:1 Live Q&A Consultation Chat with Dosa */}
      <section
        id="dosa-chat-section"
        className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#3A3A38] font-serif-kr flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-[#5A5A40]" />
            도사님과 1:1 실시간 고민 상담
          </h3>
          <span className="text-[10px] text-[#8D917A] font-sans">답변 즉시 생성</span>
        </div>

        {/* Chat History */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 font-sans">
          {chatLog.map((chat, idx) => (
            <div
              key={idx}
              className={`flex flex-col text-xs ${
                chat.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                  chat.sender === 'user'
                    ? 'bg-[#5A5A40] text-[#F5F2ED] font-medium rounded-tr-none'
                    : 'bg-[#FDFBF7] border border-[#E5E1DA] text-[#3C3C3B] rounded-tl-none'
                }`}
              >
                {chat.message}
                {chat.keyAdvice && (
                  <div className="mt-2 pt-2 border-t border-[#E5E1DA] text-[11px] text-[#D4AF37] font-bold">
                    💡 처방: {chat.keyAdvice}
                  </div>
                )}
              </div>
            </div>
          ))}

          {chatLoading && (
            <div className="flex items-center gap-2 text-xs text-[#8D917A] p-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              도사님이 혜안을 모으는 중입니다...
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendQuickChat} className="flex gap-2 pt-1 font-sans">
          <input
            type="text"
            id="dosa-chat-input"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="도사님께 무엇이든 여쭈어보세요..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E5E1DA] text-xs text-[#3C3C3B] placeholder-[#8C8279] focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            id="dosa-chat-send-btn"
            disabled={!quickQuestion.trim() || chatLoading}
            className="px-4 py-2.5 rounded-xl bg-[#5A5A40] text-[#F5F2ED] font-bold text-xs hover:bg-[#4E4E36] disabled:opacity-50 transition-all flex items-center justify-center shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-[#F5F2ED]" />
          </button>
        </form>
      </section>
    </div>
  );
};
