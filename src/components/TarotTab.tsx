import React, { useState } from 'react';
import { TAROT_CARDS } from '../data/fortuneData';
import { TarotCard } from '../types';
import { Sparkles, RefreshCw, Wand2, HelpCircle, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { playCardFlipSound, playSuccessSparkle } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export const TarotTab: React.FC = () => {
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReading, setAiReading] = useState<{
    cardKeyword?: string;
    coreMeaning?: string;
    todayMessage?: string;
    affirmation?: string;
    actionTip?: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('오늘의 하루 총운');

  const handleDrawCard = () => {
    setIsFlipping(true);
    playCardFlipSound();

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
      const card = TAROT_CARDS[randomIndex];
      const reversed = Math.random() > 0.75; // 25% chance reversed

      setDrawnCard(card);
      setIsReversed(reversed);
      setIsFlipping(false);
      setAiReading(null);
      playSuccessSparkle();

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#D4AF37', '#8D917A', '#5A5A40', '#C5A059'],
        });
      } catch (e) {
        console.error(e);
      }
    }, 450);
  };

  const handleAiConsultation = async () => {
    if (!drawnCard) return;
    setAiLoading(true);
    try {
      const response = await fetch('/api/fortune/tarot-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardName: drawnCard.nameKo,
          isReversed,
          question: question || '오늘 나에게 필요한 타로의 깊은 가르침과 조언을 알려주세요.',
          category: selectedCategory,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAiReading(json.data);
        playSuccessSparkle();
      } else {
        setAiReading({
          cardKeyword: drawnCard.keywords.join(', '),
          coreMeaning: isReversed ? drawnCard.reversedMeaning : drawnCard.uprightMeaning,
          todayMessage: drawnCard.todayAdvice,
          affirmation: `나는 오늘 ${drawnCard.nameKo}의 지혜를 품고 평온과 승리를 선택합니다.`,
          actionTip: '오늘 하루 나 자신을 믿고 작은 실천부터 옮겨보세요.',
        });
      }
    } catch (err) {
      console.error(err);
      setAiReading({
        cardKeyword: drawnCard.keywords.join(', '),
        coreMeaning: isReversed ? drawnCard.reversedMeaning : drawnCard.uprightMeaning,
        todayMessage: drawnCard.todayAdvice,
        affirmation: `나는 오늘 ${drawnCard.nameKo}의 긍정적인 파동과 함께합니다.`,
        actionTip: '조급함을 내려놓고 깊은 호흡으로 하루를 시작하세요.',
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto px-4 pt-2">
      {/* Intro Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-sans font-bold text-[#8D917A] uppercase tracking-[0.2em] flex items-center justify-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#5A5A40]" />
          Mystic 22 Arcana
        </span>
        <h2 className="text-xl font-medium text-[#3A3A38] font-serif-kr">오늘의 1장 타로 카드 점</h2>
        <p className="text-xs text-[#706C61]">
          마음을 가라앉히고 오늘의 기운과 조언을 카드로 확인하세요.
        </p>
      </div>

      {!drawnCard ? (
        /* Card Deck Drawing Screen */
        <div className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 text-center shadow-sm space-y-6">
          <div className="relative py-6 flex items-center justify-center">
            {/* Fan of stacked cards */}
            <div className="relative w-40 h-56 flex items-center justify-center">
              <div className="absolute w-36 h-52 rounded-2xl bg-[#5A5A40] border-2 border-[#8D917A] shadow-md -rotate-12 transform -translate-x-4 opacity-75" />
              <div className="absolute w-36 h-52 rounded-2xl bg-[#8D917A] border-2 border-[#E5E1DA] shadow-md rotate-12 transform translate-x-4 opacity-75" />
              <div
                className={`relative w-36 h-52 rounded-2xl bg-[#5A5A40] border-2 border-[#D4AF37] shadow-xl flex flex-col items-center justify-center p-3 cursor-pointer transform hover:scale-105 transition-all ${
                  isFlipping ? 'animate-pulse scale-95' : ''
                }`}
                onClick={handleDrawCard}
              >
                <div className="w-full h-full border border-white/20 rounded-xl flex flex-col items-center justify-center bg-[#4E4E36]">
                  <span className="text-3xl mb-1.5 animate-bounce">🔮</span>
                  <span className="text-xs font-display-natural tracking-widest text-[#F5F2ED] font-bold">TAROT</span>
                  <span className="text-[10px] text-[#E5E1DA] font-sans">터치하여 뽑기</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              id="draw-tarot-card-btn"
              onClick={handleDrawCard}
              disabled={isFlipping}
              className="w-full py-3.5 rounded-2xl bg-[#5A5A40] text-[#F5F2ED] font-sans font-bold text-xs shadow-sm hover:bg-[#4E4E36] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              {isFlipping ? '카드를 섞는 중...' : '오늘의 타로 카드 1장 뽑기'}
            </button>
            <p className="text-[11px] text-[#8C8279] font-sans">
              오늘 하루 가장 마음에 와닿는 영감과 해답을 드립니다.
            </p>
          </div>
        </div>
      ) : (
        /* Card Revealed Screen */
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          {/* Revealed Card Visual */}
          <div
            id="tarot-card-result"
            className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-sm relative overflow-hidden"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              {/* Card Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDFBF7] text-[#5A5A40] border border-[#E5E1DA] text-[11px] font-sans font-bold">
                <span>{drawnCard.number}</span>
                <span>·</span>
                <span>{drawnCard.arcana} Arcana</span>
                <span>·</span>
                <span>{isReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}</span>
              </div>

              {/* 3D Visual Card Box */}
              <div
                className={`w-40 h-60 rounded-2xl bg-gradient-to-br ${drawnCard.bgGradient} p-1 shadow-md border-2 border-[#D4AF37] relative transform transition-transform ${
                  isReversed ? 'rotate-180' : ''
                }`}
              >
                <div className="w-full h-full bg-[#FDFCFB] rounded-xl flex flex-col items-center justify-between p-3 border border-[#E5E1DA]">
                  <span className="text-xs font-bold text-[#D4AF37] font-serif-kr">{drawnCard.number}</span>
                  <div className="text-5xl my-auto">{drawnCard.symbol}</div>
                  <span className="text-[10px] font-bold text-[#3A3A38] uppercase tracking-wider font-sans">
                    {drawnCard.nameEn}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-[#3A3A38] font-serif-kr">{drawnCard.nameKo}</h3>
                <p className="text-xs text-[#8D917A] font-sans">원소/기운: {drawnCard.element}</p>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {drawnCard.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-[#FDFBF7] text-[#5A5A40] border border-[#E5E1DA] font-medium font-sans"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              {/* Meaning box */}
              <div className="w-full bg-[#FDFBF7] rounded-[24px] p-4 border border-[#E5E1DA] text-left space-y-2">
                <div className="text-xs font-bold text-[#5A5A40] font-sans flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {isReversed ? '역방향 상징 풀이' : '정방향 상징 풀이'}
                </div>
                <p className="text-xs text-[#3C3C3B] leading-relaxed">
                  {isReversed ? drawnCard.reversedMeaning : drawnCard.uprightMeaning}
                </p>

                <div className="pt-2 border-t border-[#E5E1DA]">
                  <div className="text-[11px] font-bold text-[#706C61] font-sans mb-0.5">
                    💡 오늘의 추천 실천 행동
                  </div>
                  <p className="text-xs text-[#706C61] leading-relaxed">
                    {drawnCard.todayAdvice}
                  </p>
                </div>
              </div>
            </div>

            {/* Redraw button */}
            <div className="mt-4 pt-3 border-t border-[#E5E1DA] flex justify-end">
              <button
                type="button"
                id="redraw-tarot-btn"
                onClick={handleDrawCard}
                className="text-xs text-[#8D917A] hover:text-[#5A5A40] flex items-center gap-1 font-sans font-medium transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                다른 카드 다시 뽑기
              </button>
            </div>
          </div>

          {/* AI Tarot Master Deep Reading Section */}
          <div className="bg-[#FDFCFB] border border-[#E5E1DA] rounded-[32px] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E1DA] text-[#5A5A40] flex items-center justify-center shadow-sm">
                <Wand2 className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3A3A38] font-serif-kr">AI 타로 마스터 심층 상담</h4>
                <p className="text-[11px] text-[#8C8279] font-sans">
                  이 카드와 나의 상황을 연결해 더 깊은 해답을 받아보세요.
                </p>
              </div>
            </div>

            {/* Category selection */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar font-sans">
              {['오늘의 종합운', '연애·인연', '이직·직장', '금전·투자', '인간관계'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  id={`tarot-cat-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-xl border whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#5A5A40] border-[#5A5A40] text-[#F5F2ED] font-bold'
                      : 'bg-white border-[#E5E1DA] text-[#8C8279]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Custom Question input */}
            <div className="space-y-1.5 font-sans">
              <input
                type="text"
                id="tarot-question-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="궁금한 상황이나 질문 (예: 오늘 미팅 결과는 어떨까요?)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E1DA] text-xs text-[#3C3C3B] placeholder-[#8C8279] focus:outline-none focus:border-[#D4AF37]"
              />

              <button
                type="button"
                id="ai-tarot-consult-btn"
                onClick={handleAiConsultation}
                disabled={aiLoading}
                className="w-full py-2.5 rounded-xl bg-[#5A5A40] text-[#F5F2ED] font-bold text-xs shadow-sm hover:bg-[#4E4E36] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                {aiLoading ? 'AI 마스터가 카드를 해석 중입니다...' : 'AI 타로 마스터 심층 풀이 받기'}
              </button>
            </div>

            {/* AI Reading Results */}
            {aiReading && (
              <div className="mt-3 bg-white border border-[#E5E1DA] rounded-2xl p-4 space-y-2.5 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A5A40] font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#8D917A]" />
                  AI 타로 마스터의 혜안
                </div>

                <div className="text-xs text-[#3C3C3B] leading-relaxed space-y-2">
                  <p className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E5E1DA]">
                    <strong className="text-[#5A5A40] font-sans block mb-0.5">상황 해석:</strong>
                    {aiReading.coreMeaning}
                  </p>

                  <p className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E5E1DA]">
                    <strong className="text-[#D4AF37] font-sans block mb-0.5">오늘의 조언:</strong>
                    {aiReading.todayMessage}
                  </p>

                  {aiReading.affirmation && (
                    <div className="text-center p-2.5 rounded-xl bg-[#F5F2ED] border border-[#E5E1DA] text-[#5A5A40] font-medium text-xs font-serif-kr italic">
                      ✨ "{aiReading.affirmation}" ✨
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
