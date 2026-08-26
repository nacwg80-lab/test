import React from 'react';
import { Volume2, VolumeX, Share2, Compass, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { isSoundEnabled, toggleSound, playChimeSound } from '../utils/soundEffects';

interface MobileHeaderProps {
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenShare: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  profile,
  onOpenProfile,
  onOpenShare,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) {
      playChimeSound();
    }
  };

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="sticky top-0 z-30 bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#E5E1DA] px-4 py-3 text-[#3C3C3B] shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: App Logo & Date */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white border border-[#E5E1DA] shadow-sm flex items-center justify-center">
            <Compass className="w-4 h-4 text-[#5A5A40]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-medium text-base tracking-tight text-[#3A3A38] font-serif-kr">
                오늘의 운세
              </h1>
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#8D917A] font-sans font-bold border border-[#E5E1DA]">
                AI 도사
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#8D917A] font-sans font-semibold">
              {dateFormatted} · 丙午
            </p>
          </div>
        </div>

        {/* Right: Sound toggle, Share & User Profile button */}
        <div className="flex items-center gap-1.5 font-sans">
          <button
            type="button"
            id="sound-toggle-btn"
            onClick={handleToggleSound}
            aria-label={soundOn ? '효과음 끄기' : '효과음 켜기'}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E1DA] flex items-center justify-center text-[#706C61] hover:text-[#3A3A38] hover:border-[#D4AF37] shadow-sm transition-all"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4 text-[#8C8279]" />}
          </button>

          <button
            type="button"
            id="share-open-btn"
            onClick={onOpenShare}
            aria-label="오늘의 운세 공유하기"
            className="w-8 h-8 rounded-full bg-white border border-[#E5E1DA] flex items-center justify-center text-[#706C61] hover:text-[#3A3A38] hover:border-[#D4AF37] shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id="profile-open-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-full bg-white border border-[#E5E1DA] text-[#5A5A40] hover:border-[#D4AF37] shadow-sm transition-all text-xs font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-[#5A5A40] text-[#F5F2ED] flex items-center justify-center text-[10px] font-bold">
              {profile.name ? profile.name.charAt(0) : '나'}
            </div>
            <span className="max-w-[60px] truncate font-serif-kr text-[11px]">{profile.name || '내 사주'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
