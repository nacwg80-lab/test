import React from 'react';
import { TabType } from '../types';
import { Sparkles, Calendar, Layers, Bot, Moon } from 'lucide-react';
import { playCardFlipSound } from '../utils/soundEffects';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: '오늘 운세', icon: Sparkles },
    { id: 'zodiac' as TabType, label: '띠·별자리', icon: Calendar },
    { id: 'tarot' as TabType, label: '오늘 타로', icon: Layers },
    { id: 'ai-saju' as TabType, label: 'AI 도사', icon: Bot, isHighlight: true },
    { id: 'dream' as TabType, label: '꿈해몽', icon: Moon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FDFCFB]/95 backdrop-blur-xl border-t border-[#E5E1DA] pb-safe shadow-[0_-6px_20px_rgba(90,90,64,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              type="button"
              onClick={() => {
                playCardFlipSound();
                onChangeTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive ? 'text-[#3A3A38] font-bold' : 'text-[#8C8279] hover:text-[#5A5A40] font-normal'
              }`}
            >
              {tab.isHighlight ? (
                <div
                  className={`w-10 h-10 -mt-4 mb-0.5 rounded-full flex items-center justify-center shadow-md transition-transform ${
                    isActive
                      ? 'bg-[#5A5A40] text-[#F5F2ED] scale-105 border border-[#8D917A]'
                      : 'bg-white text-[#5A5A40] border border-[#E5E1DA] hover:scale-105 shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <div className="relative mb-0.5">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-[#5A5A40]' : 'text-[#8C8279]'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4AF37] rounded-full" />
                  )}
                </div>
              )}
              <span className={`text-[10px] tracking-tight font-sans ${tab.isHighlight && isActive ? 'text-[#5A5A40] font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
