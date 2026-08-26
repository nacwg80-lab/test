import React, { useState, useEffect } from 'react';
import { TabType, UserProfile, DailyFortune } from './types';
import { generateDailyFortune, getZodiacByYear, getConstellationByDate } from './utils/fortuneEngine';
import { MobileHeader } from './components/MobileHeader';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ZodiacTab } from './components/ZodiacTab';
import { TarotTab } from './components/TarotTab';
import { SajuAiTab } from './components/SajuAiTab';
import { DreamTab } from './components/DreamTab';
import { ProfileModal } from './components/ProfileModal';
import { ShareModal } from './components/ShareModal';

const DEFAULT_PROFILE: UserProfile = {
  name: '김민준',
  birthDate: '1996-08-15',
  birthTime: '09:30',
  calendarType: 'solar',
  gender: 'female',
  zodiacSign: '쥐띠',
  constellation: '사자자리',
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_fortune_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    const year = 1996;
    const zodiac = getZodiacByYear(year).name;
    const constellation = getConstellationByDate('1996-08-15').name;
    return { ...DEFAULT_PROFILE, zodiacSign: zodiac, constellation };
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Generate today's fortune for profile
  const [fortune, setFortune] = useState<DailyFortune>(() => generateDailyFortune(profile));

  useEffect(() => {
    setFortune(generateDailyFortune(profile));
  }, [profile]);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_fortune_profile', JSON.stringify(newProfile));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#3C3C3B] font-serif-kr antialiased selection:bg-[#D4AF37]/30 selection:text-[#3A3A38] flex flex-col justify-between">
      {/* Background Ambience / Subtle Natural Tones Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-[#8D917A]/8 rounded-full blur-3xl" />
      </div>

      {/* Main App Container (Mobile centered layout) */}
      <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#F5F2ED] shadow-sm border-x border-[#E5E1DA]">
        {/* Sticky Mobile Header */}
        <MobileHeader
          profile={profile}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
        />

        {/* Tab Content Container */}
        <main className="flex-1 overflow-x-hidden pt-1">
          {activeTab === 'home' && (
            <HomeTab
              fortune={fortune}
              profile={profile}
              onGoToAiSaju={() => setActiveTab('ai-saju')}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {activeTab === 'zodiac' && (
            <ZodiacTab
              profile={profile}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {activeTab === 'tarot' && <TarotTab />}

          {activeTab === 'ai-saju' && (
            <SajuAiTab
              profile={profile}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}

          {activeTab === 'dream' && <DreamTab />}
        </main>

        {/* Sticky Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>

      {/* User Profile Setup Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Share Fortune Card Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        fortune={fortune}
        profile={profile}
      />
    </div>
  );
}
