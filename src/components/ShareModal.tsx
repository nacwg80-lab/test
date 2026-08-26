import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Share2, Compass } from 'lucide-react';
import { DailyFortune, UserProfile } from '../types';
import { playSuccessSparkle } from '../utils/soundEffects';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fortune: DailyFortune;
  profile: UserProfile;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fortune,
  profile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `🌟 [오늘의 운세] ${profile.name || '나'}님의 하루 운세 🌟\n` +
      `📅 일자: ${fortune.date} (${fortune.grade} / 종합점수 ${fortune.overallScore}점)\n` +
      `🔮 헤드라인: "${fortune.headline}"\n\n` +
      `💰 재물운: ${fortune.dimensions.wealth.score}점 (${fortune.dimensions.wealth.summary})\n` +
      `💖 애정운: ${fortune.dimensions.love.score}점 (${fortune.dimensions.love.summary})\n` +
      `💼 직장/학업운: ${fortune.dimensions.career.score}점\n` +
      `🍀 행운의 컬러: ${fortune.lucky.color}\n` +
      `🔢 행운의 숫자: ${fortune.lucky.number}\n` +
      `🧭 행운의 방향: ${fortune.lucky.direction}\n` +
      `🎁 행운의 아이템: ${fortune.lucky.item}\n\n` +
      `✨ "오늘 하루도 복(福)이 가득하기를 기원합니다!" ✨`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    playSuccessSparkle();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-2xl text-[#3C3C3B] relative">
        <button
          type="button"
          id="share-modal-close-btn"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F2ED] text-[#706C61] hover:text-[#3C3C3B] flex items-center justify-center transition-colors border border-[#E5E1DA]"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-medium text-[#3A3A38] font-serif-kr mb-3 flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-[#D4AF37]" />
          오늘의 운세 카드 공유
        </h3>

        {/* Visual Share Card Preview */}
        <div
          id="share-preview-card"
          className="bg-[#FDFBF7] border border-[#E5E1DA] rounded-2xl p-4 mb-4 shadow-sm relative overflow-hidden text-center"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#5A5A40] font-bold font-sans mb-1">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>오늘의 운세 · {fortune.date}</span>
          </div>

          <div className="text-xs text-[#8C8279] font-sans mb-2">
            {profile.name || '방문자'}님의 운세 등급
          </div>

          {/* Big Score Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F2ED] border border-[#D4AF37]/40 mb-3">
            <span className="text-[#5A5A40] font-serif-kr font-bold text-base">{fortune.grade}</span>
            <span className="w-1 h-1 bg-[#D4AF37] rounded-full" />
            <span className="text-[#D4AF37] font-serif-kr font-bold text-base">{fortune.overallScore}점</span>
          </div>

          <p className="text-xs font-serif-kr font-medium text-[#3A3A38] mb-3 leading-relaxed px-2">
            "{fortune.headline}"
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-white rounded-xl p-2.5 border border-[#E5E1DA] text-left mb-2 font-sans">
            <div>
              <span className="text-[#8C8279]">행운의 컬러:</span>{' '}
              <span className="text-[#3A3A38] font-bold">{fortune.lucky.color}</span>
            </div>
            <div>
              <span className="text-[#8C8279]">행운의 숫자:</span>{' '}
              <span className="text-[#3A3A38] font-bold">{fortune.lucky.number}</span>
            </div>
            <div>
              <span className="text-[#8C8279]">행운의 방향:</span>{' '}
              <span className="text-[#3A3A38] font-bold">{fortune.lucky.direction}</span>
            </div>
            <div>
              <span className="text-[#8C8279]">행운 아이템:</span>{' '}
              <span className="text-[#3A3A38] font-bold truncate block">{fortune.lucky.item}</span>
            </div>
          </div>

          <div className="text-[10px] text-[#8D917A] font-sans">
            ✨ 기운찬 하루를 위한 오늘의 운세 앱
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          id="copy-fortune-btn"
          onClick={handleCopy}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all font-sans shadow-sm ${
            copied
              ? 'bg-[#5A7A58] text-white'
              : 'bg-[#5A5A40] text-[#F5F2ED] hover:bg-[#4E4E36]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              운세 텍스트가 복사되었습니다!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#D4AF37]" />
              카카오톡/SNS로 공유하기 (텍스트 복사)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
