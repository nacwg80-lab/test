export type TabType = 'home' | 'zodiac' | 'tarot' | 'ai-saju' | 'dream';

export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm or 'unknown'
  calendarType: 'solar' | 'lunar' | 'lunarLeap'; // 양력, 음력, 음력윤달
  gender: 'male' | 'female' | 'other';
  zodiacSign?: string;
  constellation?: string;
}

export interface LuckDimension {
  title: string;
  score: number;
  iconName: string;
  summary: string;
  goodFor: string;
  badFor: string;
  badge: string;
}

export interface LuckyElements {
  color: string;
  colorHex: string;
  number: number | string;
  direction: string;
  item: string;
  time: string;
  food: string;
}

export interface DailyFortune {
  date: string;
  overallScore: number;
  grade: '대길' | '길' | '평' | '소길' | '주의';
  headline: string;
  summary: string;
  quote: string;
  dimensions: {
    wealth: LuckDimension;
    love: LuckDimension;
    career: LuckDimension;
    health: LuckDimension;
  };
  lucky: LuckyElements;
  hourlyEnergy: { hour: string; score: number; label: string }[];
  warning: string;
  advice: string;
}

export interface ZodiacItem {
  id: string;
  name: string; // 쥐띠, 소띠...
  animal: string;
  chinese: string;
  icon: string;
  years: number[];
  element: '목' | '화' | '토' | '금' | '수';
  keywords: string[];
}

export interface ConstellationItem {
  id: string;
  name: string; // 양자리, 황소자리...
  period: string; // 3.21 ~ 4.19
  element: '불' | '흙' | '바람' | '물';
  ruler: string;
  icon: string;
  description: string;
}

export interface TarotCard {
  id: number;
  nameEn: string;
  nameKo: string;
  number: string;
  arcana: 'Major' | 'Minor';
  element: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  todayAdvice: string;
  bgGradient: string;
  symbol: string;
}

export interface DreamInterpretation {
  dreamTitle: string;
  luckyLevel: '대길몽' | '길몽' | '평몽' | '조심몽' | '흉몽';
  luckyScore: number;
  traditionalMeaning: string;
  psychologicalMeaning: string;
  futureSign: string;
  luckyNumbers: number[];
  actionAdvice: string;
}

export interface SavedFortuneItem {
  id: string;
  date: string;
  type: 'daily' | 'tarot' | 'dream' | 'ai';
  title: string;
  summary: string;
  score?: number;
}
