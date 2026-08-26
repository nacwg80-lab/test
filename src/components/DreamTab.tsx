import React, { useState } from 'react';
import { PRESET_DREAMS } from '../data/fortuneData';
import { DreamInterpretation } from '../types';
import { Moon, Sparkles, Wand2, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { playSuccessSparkle, playChimeSound } from '../utils/soundEffects';

export const DreamTab: React.FC = () => {
  const [dreamInput, setDreamInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleInterpretDream = async (contentToAnalyze?: string) => {
    const text = contentToAnalyze || dreamInput;
    if (!text.trim() || loading) return;

    setLoading(true);
    playChimeSound();

    try {
      const res = await fetch('/api/fortune/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamContent: text }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInterpretation(json.data);
        playSuccessSparkle();
      } else {
        setInterpretation({
          dreamTitle: '상서로운 기운이 깃든 길몽',
          luckyLevel: '대길몽',
          luckyScore: 92,
          traditionalMeaning:
            '동양 해몽학에서 이 꿈은 정체되었던 문제의 실마리가 풀리고 재물과 명예가 크게 일어나는 상서로운 길조로 여깁니다.',
          psychologicalMeaning:
            '내면의 잠재의식이 새로운 도전에 대한 자신감과 성취 욕구를 활발히 분출하고 있음을 암시합니다.',
          futureSign: '조만간 뜻밖의 기쁜 소식이나 귀인의 도움을 받을 징조입니다.',
          luckyNumbers: [7, 14, 28],
          actionAdvice: '오늘 하루 자신감을 갖고 적극적으로 계획한 일을 추진해보세요.',
        });
      }
    } catch (e) {
      console.error(e);
      setInterpretation({
        dreamTitle: '맑은 영감이 깃든 꿈',
        luckyLevel: '길몽',
        luckyScore: 85,
        traditionalMeaning: '막혔던 기운이 트이고 좋은 결실을 맺을 징조입니다.',
        psychologicalMeaning: '마음의 스트레스가 해소되고 새로운 활력이 돋아나는 상태입니다.',
        futureSign: '반가운 인연과의 만남이 기대됩니다.',
        luckyNumbers: [3, 11, 27],
        actionAdvice: '주변 사람들에게 따뜻한 인사를 건네보세요.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset: (typeof PRESET_DREAMS)[0]) => {
    setSelectedPreset(preset.title);
    setDreamInput(preset.title);
    handleInterpretDream(preset.title);
  };

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto px-4 pt-2">
      {/* Intro Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-sans font-bold text-[#8D917A] uppercase tracking-[0.2em] flex items-center justify-center gap-1">
          <Moon className="w-3.5 h-3.5 text-[#5A5A40]" />
          Dream Interpretation
        </span>
        <h2 className="text-xl font-medium text-[#3A3A38] font-serif-kr">오늘 꾼 꿈 해몽 & 길흉 분석</h2>
        <p className="text-xs text-[#706C61]">
          밤사이 꾼 꿈을 입력하면 전통 해몽과 심리 분석을 해드립니다.
        </p>
      </div>

      {/* Dream Input Form */}
      <section
        id="dream-input-section"
        className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-sm space-y-4"
      >
        <div className="space-y-1.5 font-sans">
          <label className="text-xs font-bold text-[#5A5A40] block">
            꿈 내용을 자세히 적어주세요
          </label>
          <textarea
            id="dream-story-textarea"
            rows={3}
            value={dreamInput}
            onChange={(e) => setDreamInput(e.target.value)}
            placeholder="예: 맑은 계곡에서 커다란 황금 물고기를 손으로 잡는 꿈을 꿨어요..."
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E5E1DA] text-xs text-[#3C3C3B] placeholder-[#8C8279] focus:outline-none focus:border-[#D4AF37] resize-none leading-relaxed"
          />
        </div>

        <button
          type="button"
          id="interpret-dream-btn"
          onClick={() => handleInterpretDream()}
          disabled={!dreamInput.trim() || loading}
          className="w-full py-3.5 rounded-2xl bg-[#5A5A40] text-[#F5F2ED] font-sans font-bold text-xs shadow-sm hover:bg-[#4E4E36] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4 text-[#D4AF37]" />
          {loading ? '꿈속 상징과 기운을 풀이하는 중...' : 'AI 꿈해몽 분석하기'}
        </button>
      </section>

      {/* Preset Popular Dreams */}
      <section id="preset-dreams-section" className="space-y-2">
        <h3 className="text-xs font-bold text-[#706C61] font-sans flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
          자주 찾는 대표 길몽/흉몽
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {PRESET_DREAMS.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-dream-${idx}`}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-3.5 rounded-2xl bg-white border border-[#E5E1DA] hover:border-[#D4AF37] text-left transition-all group shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                    preset.level === '대길몽'
                      ? 'bg-[#FDFBF7] text-[#D4AF37] border border-[#D4AF37]/30'
                      : preset.level === '길몽'
                      ? 'bg-[#F5F2ED] text-[#5A5A40] border border-[#E5E1DA]'
                      : 'bg-[#FDFBF7] text-[#B85D43] border border-[#B85D43]/30'
                  }`}
                >
                  {preset.level}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#3A3A38] group-hover:text-[#5A5A40] line-clamp-1 mb-1 font-serif-kr">
                {preset.title}
              </h4>
              <p className="text-[10px] text-[#8C8279] line-clamp-2 leading-snug font-sans">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Dream Interpretation Result Card */}
      {interpretation && (
        <section
          id="dream-result-card"
          className="bg-white border-2 border-[#D4AF37]/50 rounded-[36px] p-6 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-3">
            <div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-sans font-bold ${
                  interpretation.luckyLevel === '대길몽'
                    ? 'bg-[#5A5A40] text-[#F5F2ED]'
                    : interpretation.luckyLevel === '길몽'
                    ? 'bg-[#8D917A] text-white'
                    : 'bg-[#B85D43] text-white'
                }`}
              >
                {interpretation.luckyLevel}
              </span>
              <h3 className="text-base font-medium text-[#3A3A38] font-serif-kr mt-1.5">
                {interpretation.dreamTitle}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-2xl font-light text-[#D4AF37] font-serif-kr">
                {interpretation.luckyScore}점
              </span>
              <span className="text-[10px] text-[#8D917A] font-sans block uppercase tracking-widest">길운 지수</span>
            </div>
          </div>

          {/* Detailed Interpretation */}
          <div className="space-y-2.5 text-xs text-[#3C3C3B] leading-relaxed">
            <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#E5E1DA] space-y-1">
              <span className="text-[#5A5A40] font-bold font-sans flex items-center gap-1 text-[11px]">
                📜 전통 동양 해몽 풀이
              </span>
              <p>{interpretation.traditionalMeaning}</p>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#E5E1DA] space-y-1">
              <span className="text-[#5A5A40] font-bold font-sans flex items-center gap-1 text-[11px]">
                🧠 현대 심리학적 무의식 분석
              </span>
              <p>{interpretation.psychologicalMeaning}</p>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-[#E5E1DA] space-y-1">
              <span className="text-[#5A7A58] font-bold font-sans flex items-center gap-1 text-[11px]">
                🔮 앞으로 다가올 징조
              </span>
              <p>{interpretation.futureSign}</p>
            </div>
          </div>

          {/* Lucky Numbers & Advice */}
          <div className="bg-[#F5F2ED] border border-[#E5E1DA] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A5A40] font-sans">
                ✨ 꿈이 전하는 행운의 숫자
              </span>
              <div className="flex gap-1.5 font-sans">
                {interpretation.luckyNumbers.map((num, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 rounded-full bg-white border border-[#D4AF37] text-[#D4AF37] font-bold text-xs flex items-center justify-center shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#706C61] pt-2 border-t border-[#E5E1DA]">
              💡 <strong>행동 지침:</strong> {interpretation.actionAdvice}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
