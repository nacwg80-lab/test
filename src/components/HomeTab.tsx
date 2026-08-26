import React, { useState } from 'react';
import {
  Sparkles,
  Coins,
  Heart,
  Briefcase,
  Activity,
  Compass,
  Clock,
  Utensils,
  Gift,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyFortune, UserProfile } from '../types';
import { FORTUNE_COOKIE_QUOTES } from '../data/fortuneData';
import { playCookieCrackSound, playSuccessSparkle } from '../utils/soundEffects';

interface HomeTabProps {
  fortune: DailyFortune;
  profile: UserProfile;
  onGoToAiSaju: () => void;
  onOpenProfile: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  fortune,
  profile,
  onGoToAiSaju,
  onOpenProfile,
}) => {
  const [cookieCracked, setCookieCracked] = useState(false);
  const [cookieQuote, setCookieQuote] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<'wealth' | 'love' | 'career' | 'health'>('wealth');

  const handleCrackCookie = () => {
    if (cookieCracked) return;
    playCookieCrackSound();

    try {
      confetti({
        particleCount: 45,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#8D917A', '#5A5A40', '#C5A059', '#E5E1DA'],
      });
    } catch (e) {
      console.error(e);
    }

    const randomQuote = FORTUNE_COOKIE_QUOTES[Math.floor(Math.random() * FORTUNE_COOKIE_QUOTES.length)];
    setCookieQuote(randomQuote);
    setCookieCracked(true);
  };

  const handleResetCookie = () => {
    setCookieCracked(false);
    setCookieQuote('');
  };

  // Grade color helper in Natural Tones
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case '대길':
        return 'bg-[#D4AF37] text-white font-bold';
      case '길':
        return 'bg-[#5A5A40] text-[#F5F2ED] font-medium';
      case '평':
        return 'bg-[#8D917A] text-white font-normal';
      case '소길':
        return 'bg-[#8C8279] text-white font-normal';
      default:
        return 'bg-[#706C61] text-white font-normal';
    }
  };

  const activeDim = fortune.dimensions[selectedDimension];

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto px-4 pt-2">
      {/* Top Greeting & Score Hero Card */}
      <section
        id="fortune-score-hero"
        className="relative overflow-hidden rounded-[36px] bg-white border border-[#E5E1DA] p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#8D917A] block mb-0.5">
              Today's Energy
            </span>
            <h2 className="text-xl font-medium tracking-tight text-[#3A3A38] font-serif-kr">
              {profile.name ? `${profile.name}님` : '회원님'}의 하루 운세
            </h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-sans shadow-sm ${getGradeBadge(fortune.grade)}`}
          >
            {fortune.grade} (상서로움)
          </span>
        </div>

        {/* Circular Progress & Score in Natural Gold */}
        <div className="flex items-center gap-5 my-3">
          {/* Radial score ring */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#E5E1DA]/60"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#D4AF37] transition-all duration-1000 ease-out"
                strokeWidth="5"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * fortune.overallScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-light text-[#D4AF37] leading-none font-serif-kr">
                {fortune.overallScore}
              </span>
              <span className="text-[10px] text-[#8D917A] font-sans uppercase tracking-widest mt-0.5">점수</span>
            </div>
          </div>

          {/* Headline & Quote */}
          <div className="flex-1 space-y-1">
            <div className="text-sm font-semibold text-[#5A5A40] leading-snug font-serif-kr italic">
              "{fortune.headline}"
            </div>
            <p className="text-xs text-[#706C61] leading-relaxed line-clamp-3">
              {fortune.summary}
            </p>
          </div>
        </div>

        {/* Mood Status bar */}
        <div className="bg-[#FDFBF7] rounded-full py-2.5 px-4 border border-[#E5E1DA] flex items-center justify-between mt-4">
          <span className="text-[10px] uppercase tracking-widest text-[#8D917A] font-sans font-bold">
            {profile.zodiacSign || '띠 미등록'} · {profile.constellation || '별자리 미등록'}
          </span>
          <button
            type="button"
            id="edit-profile-inline-btn"
            onClick={onOpenProfile}
            className="text-xs text-[#5A5A40] hover:text-[#D4AF37] font-medium flex items-center gap-0.5 transition-colors"
          >
            정보 수정
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4 Pillars of Luck (4대 핵심 운세 탭) */}
      <section id="fortune-dimensions-section" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#706C61] font-sans flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#5A5A40]" />
            4대 운세 상세 분석
          </h3>
          <span className="text-[10px] text-[#8D917A] font-sans">카드를 터치해보세요</span>
        </div>

        {/* 4 Tabs Selector */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'wealth', label: '재물운', icon: Coins },
            { id: 'love', label: '애정운', icon: Heart },
            { id: 'career', label: '직장운', icon: Briefcase },
            { id: 'health', label: '건강운', icon: Activity },
          ].map((tab) => {
            const isSelected = selectedDimension === tab.id;
            const dimData = fortune.dimensions[tab.id as keyof typeof fortune.dimensions];
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                id={`dim-tab-${tab.id}`}
                type="button"
                onClick={() => setSelectedDimension(tab.id as any)}
                className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center shadow-sm ${
                  isSelected
                    ? 'bg-white border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/30 scale-[1.02]'
                    : 'bg-[#FDFCFB] border-[#E5E1DA] hover:bg-white text-[#8C8279]'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#D4AF37]' : 'text-[#8D917A]'}`} />
                <span className={`text-xs font-medium ${isSelected ? 'text-[#3A3A38] font-bold' : 'text-[#706C61]'}`}>
                  {tab.label}
                </span>
                <span className={`text-[11px] font-sans font-bold mt-0.5 ${isSelected ? 'text-[#D4AF37]' : 'text-[#8D917A]'}`}>
                  {dimData.score}점
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Dimension Detail Card */}
        <div className="bg-[#FDFCFB] border border-[#E5E1DA] rounded-[28px] p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#3A3A38] font-serif-kr">{activeDim.title}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F5F2ED] text-[#5A5A40] text-[10px] font-sans font-bold border border-[#E5E1DA]">
                {activeDim.badge}
              </span>
            </div>
            <div className="text-sm font-bold text-[#D4AF37] font-serif-kr">
              ★ {Math.round(activeDim.score / 20)}/5 ({activeDim.score}점)
            </div>
          </div>

          {/* Progress Bar in Natural Gold */}
          <div className="w-full h-1.5 bg-[#E5E1DA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
              style={{ width: `${activeDim.score}%` }}
            />
          </div>

          <p className="text-xs text-[#3C3C3B] leading-relaxed">
            {activeDim.summary}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="bg-white border border-[#E5E1DA] rounded-2xl p-3 text-[#3C3C3B] shadow-sm">
              <span className="text-[10px] uppercase font-sans font-bold block mb-1 text-[#5A5A40]">
                🌱 추천 행동
              </span>
              <p className="text-[#706C61] text-[11px] leading-snug">{activeDim.goodFor}</p>
            </div>
            <div className="bg-white border border-[#E5E1DA] rounded-2xl p-3 text-[#3C3C3B] shadow-sm">
              <span className="text-[10px] uppercase font-sans font-bold block mb-1 text-[#8C8279]">
                🍂 경계 행동
              </span>
              <p className="text-[#706C61] text-[11px] leading-snug">{activeDim.badFor}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lucky Elements Matrix in Deep Forest Olive (#5A5A40) */}
      <section
        id="lucky-matrix-section"
        className="bg-[#5A5A40] text-[#F5F2ED] rounded-[32px] p-6 relative overflow-hidden shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="opacity-70 text-[10px] uppercase tracking-[0.25em] font-sans font-bold block">
            Today's Lucky Elements
          </span>
          <span className="text-[11px] font-sans opacity-80">행운의 기운</span>
        </div>

        <div className="grid grid-cols-3 gap-y-4 gap-x-2">
          {/* Lucky Color */}
          <div className="flex flex-col border-l border-white/20 pl-3">
            <span className="text-[9px] opacity-60 uppercase font-sans font-bold mb-1">Color</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border border-white/40 flex-shrink-0"
                style={{ backgroundColor: fortune.lucky.colorHex }}
              />
              <span className="text-xs font-serif-kr truncate">{fortune.lucky.color}</span>
            </div>
          </div>

          {/* Lucky Number */}
          <div className="flex flex-col border-l border-white/20 pl-3">
            <span className="text-[9px] opacity-60 uppercase font-sans font-bold mb-1">Number</span>
            <span className="text-sm font-serif-kr text-[#D4AF37] font-semibold">{fortune.lucky.number}</span>
          </div>

          {/* Lucky Direction */}
          <div className="flex flex-col border-l border-white/20 pl-3">
            <span className="text-[9px] opacity-60 uppercase font-sans font-bold mb-1">Direction</span>
            <span className="text-xs font-serif-kr">{fortune.lucky.direction}</span>
          </div>

          {/* Lucky Time */}
          <div className="flex flex-col border-l border-white/20 pl-3">
            <span className="text-[9px] opacity-60 uppercase font-sans font-bold mb-1">Golden Time</span>
            <span className="text-xs font-serif-kr">{fortune.lucky.time}</span>
          </div>

          {/* Lucky Food */}
          <div className="flex flex-col border-l border-white/20 pl-3">
            <span className="text-[9px] opacity-60 uppercase font-sans font-bold mb-1">Food</span>
            <span className="text-xs font-serif-kr truncate">{fortune.lucky.food}</span>
          </div>

          {/* Lucky Item */}
          <div className="flex flex-col border-l border-white/20 pl-3">
            <span className="text-[9px] opacity-60 uppercase font-sans font-bold mb-1">Item</span>
            <span className="text-xs font-serif-kr truncate">{fortune.lucky.item}</span>
          </div>
        </div>

        {/* Subtle background ring */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 border border-white/10 rounded-full pointer-events-none" />
      </section>

      {/* Hourly Energy Flow (시간대별 운세 흐름) */}
      <section id="hourly-energy-section" className="bg-white border border-[#E5E1DA] rounded-[28px] p-5 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold text-[#3A3A38] font-sans flex items-center justify-between">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[#706C61]">
            <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
            시간대별 기운 흐름
          </span>
          <span className="text-[10px] text-[#8D917A] font-normal font-sans">오후 1~3시 최고조</span>
        </h3>

        <div className="grid grid-cols-6 gap-1 pt-2">
          {fortune.hourlyEnergy.map((slot, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <span className="text-[10px] font-sans font-bold text-[#D4AF37]">{slot.score}</span>
              <div className="w-full bg-[#F5F2ED] rounded-full h-14 flex items-end justify-center p-0.5">
                <div
                  className="w-full rounded-full bg-[#D4AF37] transition-all duration-700"
                  style={{ height: `${Math.max(20, (slot.score / 100) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-[#8C8279] font-sans font-medium">{slot.hour}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Fortune Cookie Mini Game */}
      <section
        id="fortune-cookie-game"
        className="relative overflow-hidden rounded-[28px] bg-[#FDFBF7] border border-[#E5E1DA] p-5 shadow-sm text-center"
      >
        <div className="text-[10px] font-bold text-[#8D917A] uppercase tracking-widest font-sans mb-1">
          Daily Fortune Cookie
        </div>
        <h4 className="text-sm font-medium text-[#3A3A38] font-serif-kr mb-3">
          {cookieCracked ? '오늘 당신을 위한 황금 격언' : '쿠키를 터치해 오늘의 한 줄 복채를 여세요'}
        </h4>

        {!cookieCracked ? (
          <div className="py-2">
            <button
              type="button"
              id="crack-cookie-btn"
              onClick={handleCrackCookie}
              className="group relative inline-flex flex-col items-center justify-center p-4 rounded-3xl bg-white hover:bg-[#FDFCFB] border border-[#E5E1DA] hover:border-[#D4AF37] shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="text-4xl transform group-hover:rotate-12 transition-transform duration-300">
                🥠
              </span>
              <span className="mt-2 text-xs font-bold text-[#5A5A40] group-hover:text-[#3A3A38] font-sans">
                터치하여 쿠키 열기 ✨
              </span>
            </button>
          </div>
        ) : (
          <div className="py-2 space-y-3 animate-in zoom-in-95 duration-300">
            <div className="bg-white border border-[#E5E1DA] rounded-2xl p-4 text-center shadow-sm relative">
              <span className="text-2xl block mb-1">📜</span>
              <p className="text-xs font-serif-kr italic text-[#3A3A38] leading-relaxed">
                "{cookieQuote}"
              </p>
            </div>
            <button
              type="button"
              id="reset-cookie-btn"
              onClick={handleResetCookie}
              className="text-[11px] text-[#8D917A] hover:text-[#5A5A40] underline font-sans font-medium"
            >
              다시 뽑기
            </button>
          </div>
        )}
      </section>

      {/* AI Fortune Master Banner CTA */}
      <section
        id="ai-saju-cta-banner"
        className="rounded-[28px] bg-[#5A5A40] text-[#F5F2ED] p-4 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:bg-[#4E4E36] transition-all border border-[#8D917A]/40"
        onClick={onGoToAiSaju}
      >
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[9px] uppercase tracking-widest font-sans font-bold">
            <Wand2 className="w-3 h-3 text-[#D4AF37]" />
            AI 사주 도사
          </div>
          <h4 className="text-sm font-semibold font-serif-kr leading-tight">
            오늘 나의 오행 사주와 심층 운세 풀기
          </h4>
          <p className="text-[11px] text-[#E5E1DA] font-sans font-light">
            동양 명리학 지혜와 실시간 1:1 상담
          </p>
        </div>
        <div className="w-9 h-9 rounded-full bg-white text-[#5A5A40] flex items-center justify-center flex-shrink-0 shadow-sm">
          <ChevronRight className="w-5 h-5" />
        </div>
      </section>
    </div>
  );
};
