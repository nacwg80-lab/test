import React, { useState } from 'react';
import { X, User, Calendar, Clock, Sparkles, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { getZodiacByYear, getConstellationByDate } from '../utils/fortuneEngine';
import { playSuccessSparkle } from '../utils/soundEffects';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (newProfile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name || '김행운');
  const [birthDate, setBirthDate] = useState(profile.birthDate || '1996-08-15');
  const [birthTime, setBirthTime] = useState(profile.birthTime || '09:30');
  const [unknownTime, setUnknownTime] = useState(profile.birthTime === 'unknown');
  const [calendarType, setCalendarType] = useState<UserProfile['calendarType']>(
    profile.calendarType || 'solar'
  );
  const [gender, setGender] = useState<UserProfile['gender']>(profile.gender || 'female');

  if (!isOpen) return null;

  const currentYear = parseInt(birthDate.substring(0, 4), 10) || 1996;
  const currentZodiac = getZodiacByYear(currentYear);
  const currentConstellation = getConstellationByDate(birthDate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: name.trim() || '행운의 주인공',
      birthDate,
      birthTime: unknownTime ? 'unknown' : birthTime,
      calendarType,
      gender,
      zodiacSign: currentZodiac.name,
      constellation: currentConstellation.name,
    };
    onSaveProfile(updated);
    playSuccessSparkle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-[#E5E1DA] rounded-[36px] p-6 shadow-2xl text-[#3C3C3B] relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          id="profile-modal-close-btn"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F2ED] text-[#706C61] hover:text-[#3C3C3B] flex items-center justify-center transition-colors border border-[#E5E1DA]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#F5F2ED] border border-[#E5E1DA] flex items-center justify-center text-[#5A5A40]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-[#3A3A38] font-serif-kr">사주·운세 프로필 설정</h2>
            <p className="text-xs text-[#8D917A] font-sans">생년월일을 입력하면 맞춤 운세를 분석합니다.</p>
          </div>
        </div>

        {/* Quick Calculated Zodiac & Constellation Badge */}
        <div className="bg-[#FDFBF7] border border-[#E5E1DA] rounded-2xl p-3.5 mb-5 flex items-center justify-around text-center">
          <div>
            <div className="text-2xl mb-0.5">{currentZodiac.icon}</div>
            <div className="text-xs font-bold text-[#5A5A40] font-sans">{currentZodiac.name}</div>
            <div className="text-[10px] text-[#8C8279]">{currentZodiac.chinese}</div>
          </div>
          <div className="w-px h-8 bg-[#E5E1DA]" />
          <div>
            <div className="text-2xl mb-0.5">{currentConstellation.icon}</div>
            <div className="text-xs font-bold text-[#5A5A40] font-sans">{currentConstellation.name}</div>
            <div className="text-[10px] text-[#8C8279]">{currentConstellation.period}</div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 font-sans">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] mb-1.5">이름 또는 닉네임</label>
            <input
              type="text"
              id="profile-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김민준"
              maxLength={12}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E5E1DA] text-sm text-[#3C3C3B] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] mb-1.5">성별</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="gender-female-btn"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  gender === 'female'
                    ? 'bg-[#5A5A40] text-[#F5F2ED] border-[#5A5A40] shadow-sm'
                    : 'bg-[#FDFBF7] border-[#E5E1DA] text-[#8C8279] hover:bg-[#F5F2ED]'
                }`}
              >
                여성 (陰)
              </button>
              <button
                type="button"
                id="gender-male-btn"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  gender === 'male'
                    ? 'bg-[#5A5A40] text-[#F5F2ED] border-[#5A5A40] shadow-sm'
                    : 'bg-[#FDFBF7] border-[#E5E1DA] text-[#8C8279] hover:bg-[#F5F2ED]'
                }`}
              >
                남성 (陽)
              </button>
            </div>
          </div>

          {/* Calendar Type */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] mb-1.5">양력 / 음력 구분</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'solar', label: '양력' },
                { id: 'lunar', label: '음력 (평달)' },
                { id: 'lunarLeap', label: '음력 (윤달)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  id={`calendar-type-${item.id}`}
                  onClick={() => setCalendarType(item.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    calendarType === item.id
                      ? 'bg-[#5A5A40] text-[#F5F2ED] border-[#5A5A40] shadow-sm'
                      : 'bg-[#FDFBF7] border-[#E5E1DA] text-[#8C8279] hover:bg-[#F5F2ED]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              생년월일
            </label>
            <input
              type="date"
              id="profile-birthdate-input"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E5E1DA] text-sm text-[#3C3C3B] focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          {/* Birth Time */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#5A5A40] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                출생 시간 (사주 시주 계산)
              </label>
              <label className="flex items-center gap-1.5 text-xs text-[#8C8279] cursor-pointer">
                <input
                  type="checkbox"
                  id="profile-unknown-time-checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="rounded border-[#E5E1DA] text-[#5A5A40] focus:ring-[#5A5A40]"
                />
                시간 모름
              </label>
            </div>
            {!unknownTime && (
              <input
                type="time"
                id="profile-birthtime-input"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E5E1DA] text-sm text-[#3C3C3B] focus:outline-none focus:border-[#D4AF37]"
              />
            )}
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="profile-save-btn"
              className="w-full py-3.5 rounded-2xl bg-[#5A5A40] text-[#F5F2ED] font-bold text-sm shadow-sm hover:bg-[#4E4E36] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#D4AF37]" />
              내 사주 프로필 저장하고 운세 보기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
