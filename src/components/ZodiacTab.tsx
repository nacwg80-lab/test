import React, { useState } from 'react';
import { ZODIAC_LIST, CONSTELLATION_LIST } from '../data/fortuneData';
import { ZodiacItem, ConstellationItem, UserProfile } from '../types';
import { Sparkles, Calendar, Heart, Coins, ArrowRight, Shield } from 'lucide-react';
import { playCardFlipSound } from '../utils/soundEffects';

interface ZodiacTabProps {
  profile: UserProfile;
  onOpenProfile: () => void;
}

export const ZodiacTab: React.FC<ZodiacTabProps> = ({ profile, onOpenProfile }) => {
  const [viewMode, setViewMode] = useState<'zodiac' | 'constellation'>('zodiac');
  const [selectedZodiacId, setSelectedZodiacId] = useState<string>(
    ZODIAC_LIST.find((z) => z.name === profile.zodiacSign)?.id || 'rat'
  );
  const [selectedConstellationId, setSelectedConstellationId] = useState<string>(
    CONSTELLATION_LIST.find((c) => c.name === profile.constellation)?.id || 'aries'
  );

  const activeZodiac = ZODIAC_LIST.find((z) => z.id === selectedZodiacId) || ZODIAC_LIST[0];
  const activeConstellation =
    CONSTELLATION_LIST.find((c) => c.id === selectedConstellationId) || CONSTELLATION_LIST[0];

  const getZodiacDailyScore = (id: string) => {
    let hash = 0;
    const key = `${id}_${new Date().toISOString().slice(0, 10)}`;
    for (let i = 0; i < key.length; i++) hash += key.charCodeAt(i);
    return 70 + (hash % 28);
  };

  const currentScore =
    viewMode === 'zodiac'
      ? getZodiacDailyScore(activeZodiac.id)
      : getZodiacDailyScore(activeConstellation.id);

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto px-4 pt-2">
      {/* Mode Switcher Pills */}
      <div className="flex bg-white border border-[#E5E1DA] p-1 rounded-2xl shadow-sm">
        <button
          type="button"
          id="view-zodiac-btn"
          onClick={() => {
            playCardFlipSound();
            setViewMode('zodiac');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-sans font-bold transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'zodiac'
              ? 'bg-[#5A5A40] text-[#F5F2ED] shadow-sm'
              : 'text-[#8C8279] hover:text-[#3A3A38]'
          }`}
        >
          <span>🐾 12간지 띠별 운세</span>
        </button>
        <button
          type="button"
          id="view-constellation-btn"
          onClick={() => {
            playCardFlipSound();
            setViewMode('constellation');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-sans font-bold transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'constellation'
              ? 'bg-[#5A5A40] text-[#F5F2ED] shadow-sm'
              : 'text-[#8C8279] hover:text-[#3A3A38]'
          }`}
        >
          <span>✨ 12별자리 운세</span>
        </button>
      </div>

      {viewMode === 'zodiac' ? (
        <>
          {/* Horizontal Scroll / Grid of 12 Animals */}
          <div className="grid grid-cols-6 gap-2 bg-[#FDFBF7] p-3 rounded-[28px] border border-[#E5E1DA] shadow-sm">
            {ZODIAC_LIST.map((item) => {
              const isSelected = selectedZodiacId === item.id;
              const isUserZodiac = profile.zodiacSign === item.name;

              return (
                <button
                  key={item.id}
                  id={`zodiac-btn-${item.id}`}
                  type="button"
                  onClick={() => {
                    playCardFlipSound();
                    setSelectedZodiacId(item.id);
                  }}
                  className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#D4AF37] text-[#3A3A38] shadow-md ring-1 ring-[#D4AF37]/30 scale-105'
                      : 'bg-white/80 border-[#E5E1DA] text-[#8C8279] hover:border-[#8D917A]'
                  }`}
                >
                  {isUserZodiac && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D4AF37] rounded-full border border-white" />
                  )}
                  <span className="text-xl mb-0.5">{item.icon}</span>
                  <span className="text-[10px] font-sans font-bold tracking-tight">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Zodiac Detail Card */}
          <section
            id="active-zodiac-card"
            className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-sm space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F5F2ED] border border-[#E5E1DA] flex items-center justify-center text-3xl shadow-sm">
                  {activeZodiac.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-[#3A3A38] font-serif-kr">{activeZodiac.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#5A5A40] border border-[#E5E1DA] font-sans font-bold">
                      {activeZodiac.chinese}
                    </span>
                  </div>
                  <p className="text-xs text-[#8D917A] font-sans">오행: {activeZodiac.element} (기운)</p>
                </div>
              </div>

              {/* Score pill */}
              <div className="text-right">
                <span className="text-2xl font-light text-[#D4AF37] font-serif-kr">{currentScore}점</span>
                <span className="text-[10px] text-[#8D917A] font-sans block uppercase tracking-widest">지수</span>
              </div>
            </div>

            {/* Keyword tags */}
            <div className="flex flex-wrap gap-1.5 font-sans">
              {activeZodiac.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FDFBF7] text-[#5A5A40] border border-[#E5E1DA] font-medium"
                >
                  #{kw}
                </span>
              ))}
            </div>

            {/* General Zodiac Today Horoscope */}
            <div className="bg-[#FDFBF7] rounded-[24px] p-4 border border-[#E5E1DA] space-y-1.5">
              <h4 className="text-xs font-bold text-[#5A5A40] font-sans flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                오늘의 {activeZodiac.name} 총운
              </h4>
              <p className="text-xs text-[#3C3C3B] leading-relaxed">
                {currentScore >= 85
                  ? `오늘은 ${activeZodiac.name}에게 대단히 길한 기운이 감도는 날입니다. 그동안 미루어왔던 중요한 결정을 내리거나 새로운 시도를 하면 큰 성과를 거둘 수 있습니다. 자연스러운 흐름에 맡겨보세요.`
                  : `마음의 여유를 갖고 차분하게 임하면 작은 난관도 원만히 풀어집니다. 고집을 부리기보다는 상대방의 입장을 먼저 헤아려주는 배려가 좋은 복을 불러옵니다.`}
              </p>
            </div>

            {/* Birth Year Specific Fortunes (출생연도별 맞춤 한 줄 운세) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#706C61] font-sans flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
                출생 연도별 오늘의 맞춤 운세
              </h4>
              <div className="space-y-1.5">
                {activeZodiac.years.slice(0, 5).map((yr) => {
                  const age = new Date().getFullYear() - yr + 1;
                  const phrases = [
                    '생각지 못한 귀인이 나타나 도움의 손길을 건넵니다.',
                    '작은 지출을 아끼면 큰 재물의 씨앗이 됩니다.',
                    '가족이나 연인과의 따뜻한 대화로 피로가 풀립니다.',
                    '순조로운 진행 속에 새로운 기회가 찾아옵니다.',
                    '과욕을 삼가고 순리대로 행하면 만사가 형통합니다.',
                  ];
                  const phrase = phrases[(yr + currentScore) % phrases.length];

                  return (
                    <div
                      key={yr}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FDFBF7] border border-[#E5E1DA] text-xs shadow-sm"
                    >
                      <span className="font-bold text-[#D4AF37] font-sans flex-shrink-0">
                        {yr}년생 ({age}세)
                      </span>
                      <span className="text-[#3C3C3B] leading-snug">{phrase}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Constellation Grid */}
          <div className="grid grid-cols-6 gap-2 bg-[#FDFBF7] p-3 rounded-[28px] border border-[#E5E1DA] shadow-sm">
            {CONSTELLATION_LIST.map((item) => {
              const isSelected = selectedConstellationId === item.id;
              const isUserConstellation = profile.constellation === item.name;

              return (
                <button
                  key={item.id}
                  id={`constellation-btn-${item.id}`}
                  type="button"
                  onClick={() => {
                    playCardFlipSound();
                    setSelectedConstellationId(item.id);
                  }}
                  className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#D4AF37] text-[#3A3A38] shadow-md ring-1 ring-[#D4AF37]/30 scale-105'
                      : 'bg-white/80 border-[#E5E1DA] text-[#8C8279] hover:border-[#8D917A]'
                  }`}
                >
                  {isUserConstellation && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D4AF37] rounded-full border border-white" />
                  )}
                  <span className="text-xl mb-0.5">{item.icon}</span>
                  <span className="text-[10px] font-sans font-bold tracking-tight truncate w-full text-center">
                    {item.name.replace('자리', '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Constellation Detail Card */}
          <section
            id="active-constellation-card"
            className="bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F5F2ED] border border-[#E5E1DA] flex items-center justify-center text-3xl shadow-sm">
                  {activeConstellation.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-[#3A3A38] font-serif-kr">{activeConstellation.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#5A5A40] border border-[#E5E1DA] font-sans font-bold">
                      원소: {activeConstellation.element}
                    </span>
                  </div>
                  <p className="text-xs text-[#8D917A] font-sans">{activeConstellation.period} · 수호성: {activeConstellation.ruler}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-light text-[#D4AF37] font-serif-kr">{currentScore}점</span>
                <span className="text-[10px] text-[#8D917A] font-sans block uppercase tracking-widest">별자리 지수</span>
              </div>
            </div>

            <p className="text-xs text-[#706C61] bg-[#FDFBF7] p-3 rounded-2xl border border-[#E5E1DA] italic font-serif-kr leading-relaxed">
              "{activeConstellation.description}"
            </p>

            {/* Constellation Daily Forecast */}
            <div className="bg-[#FDFBF7] rounded-[24px] p-4 border border-[#E5E1DA] space-y-1.5">
              <h4 className="text-xs font-bold text-[#5A5A40] font-sans flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                오늘의 {activeConstellation.name} 별자리 운세
              </h4>
              <p className="text-xs text-[#3C3C3B] leading-relaxed">
                {currentScore >= 85
                  ? `수호성 ${activeConstellation.ruler}의 맑은 기운이 당신의 잠재력을 일깨웁니다. 새로운 아이디어나 창의적인 계획이 술술 풀리며, 대인관계에서 신뢰를 얻게 됩니다.`
                  : `내면의 평정심을 유지하며 차분하게 하루의 루틴을 지키는 것이 이롭습니다. 감정에 치우친 즉흥적 판단보다는 충분한 여유를 갖고 행동하세요.`}
              </p>
            </div>

            {/* Love & Wealth Horoscope for Constellation */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E1DA] text-[#3C3C3B] space-y-1 shadow-sm">
                <div className="flex items-center gap-1 font-bold text-[#5A5A40] font-sans text-xs">
                  <Heart className="w-3.5 h-3.5 text-[#8D917A]" />
                  연애 기운
                </div>
                <p className="text-[11px] text-[#706C61] leading-snug">솔직한 마음 표현이 상대의 신뢰를 얻는 열쇠입니다.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E5E1DA] text-[#3C3C3B] space-y-1 shadow-sm">
                <div className="flex items-center gap-1 font-bold text-[#5A5A40] font-sans text-xs">
                  <Coins className="w-3.5 h-3.5 text-[#D4AF37]" />
                  재물 기운
                </div>
                <p className="text-[11px] text-[#706C61] leading-snug">실속 있는 지혜가 찾아오니 조언에 귀를 기울이세요.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
