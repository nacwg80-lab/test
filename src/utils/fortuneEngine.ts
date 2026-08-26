import { DailyFortune, UserProfile, ZodiacItem, ConstellationItem } from '../types';
import { ZODIAC_LIST, CONSTELLATION_LIST } from '../data/fortuneData';

// Pseudo-random deterministic hash generator from string
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// PRNG from seed
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Find Zodiac based on birth year
export function getZodiacByYear(year: number): ZodiacItem {
  // 1900 was year of the Rat (자) or 1924, 1984, 1996, etc.
  // 1984 % 12 = 4 (쥐띠 is index 0). Let's calculate: (year - 4) % 12
  const idx = ((year - 4) % 12 + 12) % 12;
  return ZODIAC_LIST[idx] || ZODIAC_LIST[0];
}

// Find Constellation based on MM-DD
export function getConstellationByDate(dateStr: string): ConstellationItem {
  if (!dateStr || dateStr.length < 10) return CONSTELLATION_LIST[0];
  const month = parseInt(dateStr.substring(5, 7), 10);
  const day = parseInt(dateStr.substring(8, 10), 10);

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return CONSTELLATION_LIST[0]; // 양
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return CONSTELLATION_LIST[1]; // 황소
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return CONSTELLATION_LIST[2]; // 쌍둥이
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return CONSTELLATION_LIST[3]; // 게
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return CONSTELLATION_LIST[4]; // 사자
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return CONSTELLATION_LIST[5]; // 처녀
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return CONSTELLATION_LIST[6]; // 천칭
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return CONSTELLATION_LIST[7]; // 전갈
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return CONSTELLATION_LIST[8]; // 사수
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return CONSTELLATION_LIST[9]; // 염소
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return CONSTELLATION_LIST[10]; // 물병
  return CONSTELLATION_LIST[11]; // 물고기
}

const HEADLINES = [
  '귀인의 조력으로 막혔던 길이 시원하게 열리는 날',
  '작은 노력에도 커다란 성취와 보람이 따르는 길운의 날',
  '지혜로운 직관이 빛을 발하여 뜻밖의 이득을 얻는 날',
  '차분한 마음가짐이 불필요한 번민을 잠재우고 복을 부르는 날',
  '새로운 인연이나 반가운 소식이 찾아와 웃음꽃이 피는 날',
  '과감한 도전보다 내실을 다지면 훗날 큰 밑천이 되는 날',
  '뿌린 씨앗이 알찬 열매로 맺히기 시작하는 희망찬 날',
  '마음을 편안히 먹으면 모든 일이 순조롭게 풀려나가는 날',
];

const SUMMARIES = [
  '오늘의 운세는 맑고 평온한 호수와 같습니다. 조급하게 서두르지 않아도 준비된 일들이 자연스럽게 제자리를 찾아갈 것입니다. 주변 사람들에게 따뜻한 한마디를 건네면 생각지 못한 호의가 눈덩이처럼 불어납니다.',
  '동틀 무렵의 상서로운 기운이 당신을 비추고 있습니다. 이전부터 고민해온 문제의 해결책이 섬광처럼 떠오를 것이며, 주위의 신뢰를 한 몸에 받게 됩니다. 겸손함을 유지하면 복이 배가됩니다.',
  '역동적인 기운과 창의적인 영감이 넘쳐나는 하루입니다. 자신의 생각을 적극적으로 표현하고 계획했던 프로젝트를 실행에 옮기기에 최상의 날입니다. 작은 지출보다는 실질적인 가치에 집중하세요.',
  '잔잔한 파도처럼 평온함 속에 실속을 챙기는 하루입니다. 뜻밖의 귀인이 나타나 든든한 조언을 건넬 수 있으니 경청하는 태도가 중요합니다. 건강을 위해 가벼운 스트레칭을 잊지 마세요.',
];

const COLORS = [
  { name: '로얄 사파이어 블루', hex: '#2563EB' },
  { name: '에메랄드 포레스트 그린', hex: '#059669' },
  { name: '골든 엠버 옐로우', hex: '#D97706' },
  { name: '웜 코랄 핑크', hex: '#E11D48' },
  { name: '미스틱 바이올렛 퍼플', hex: '#7C3AED' },
  { name: '펄 크림 화이트', hex: '#F3F4F6' },
];

const DIRECTIONS = ['동쪽 (일출 방향)', '남동쪽 (생기 방향)', '남쪽 (화기 방향)', '서북쪽 (재물 방향)', '북동쪽 (귀인 방향)'];
const ITEMS = ['따뜻한 허브티 / 텀블러', '가죽 지갑 / 명함 지갑', '은은한 시트러스 향수', '깔끔한 손목시계', '메모장과 볼펜', '푸른빛 손수건', '원목 키링'];
const FOODS = ['따뜻한 국물 요리 (갈비탕/우동)', '신선한 그린 샐러드', '고소한 견과류 요거트', '달콤한 과일 디저트', '향긋한 아메리카노'];

export function generateDailyFortune(profile: UserProfile, targetDate?: string): DailyFortune {
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  const seedString = `${profile.name || 'user'}_${profile.birthDate || '1995-01-01'}_${profile.birthTime || '00'}_${dateStr}`;
  const seed = stringToSeed(seedString);
  const rand = seededRandom(seed);

  // Overall Score (60 ~ 98)
  const baseScore = Math.floor(65 + rand() * 33);
  let grade: '대길' | '길' | '평' | '소길' | '주의' = '길';
  if (baseScore >= 92) grade = '대길';
  else if (baseScore >= 82) grade = '길';
  else if (baseScore >= 74) grade = '평';
  else if (baseScore >= 66) grade = '소길';
  else grade = '주의';

  const headline = HEADLINES[Math.floor(rand() * HEADLINES.length)];
  const summary = SUMMARIES[Math.floor(rand() * SUMMARIES.length)];

  // Dimension scores
  const wealthScore = Math.min(100, Math.max(50, Math.floor(baseScore + (rand() * 20 - 10))));
  const loveScore = Math.min(100, Math.max(50, Math.floor(baseScore + (rand() * 20 - 10))));
  const careerScore = Math.min(100, Math.max(50, Math.floor(baseScore + (rand() * 20 - 10))));
  const healthScore = Math.min(100, Math.max(50, Math.floor(baseScore + (rand() * 20 - 10))));

  const selectedColor = COLORS[Math.floor(rand() * COLORS.length)];
  const selectedNumber = Math.floor(rand() * 9) + 1;
  const luckyPairNumber = Math.floor(rand() * 88) + 11;
  const selectedDir = DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)];
  const selectedItem = ITEMS[Math.floor(rand() * ITEMS.length)];
  const selectedFood = FOODS[Math.floor(rand() * FOODS.length)];

  const timeSlots = ['오전 9시 ~ 11시 (사시)', '오후 1시 ~ 3시 (미시)', '오후 5시 ~ 7시 (유시)', '오전 11시 ~ 오후 1시 (오시)'];
  const selectedTime = timeSlots[Math.floor(rand() * timeSlots.length)];

  // Hourly energy trend (6:00 to 22:00)
  const hours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
  const hourlyEnergy = hours.map((hour, idx) => {
    const variance = Math.sin((idx + rand() * 2) * 1.2) * 18;
    const score = Math.min(99, Math.max(45, Math.floor(baseScore + variance)));
    let label = '보통';
    if (score >= 88) label = '최고의 시간';
    else if (score >= 78) label = '활력 상승';
    else if (score < 65) label = '안정 필요';
    return { hour, score, label };
  });

  return {
    date: dateStr,
    overallScore: baseScore,
    grade,
    headline,
    summary,
    quote: '운(運)은 머무르지 않고 움직이는 기운이니, 맑은 마음과 실천으로 길한 복을 끌어당기소서.',
    dimensions: {
      wealth: {
        title: '재물운',
        score: wealthScore,
        iconName: 'Coins',
        summary: wealthScore >= 80 ? '수입의 기회가 생기고 뜻밖의 이득이 기대됩니다.' : '불필요한 충동구매를 줄이고 자산을 단단히 지키세요.',
        goodFor: '알뜰한 저축 및 계약 검토',
        badFor: '과도한 충동지출 및 무리한 투자',
        badge: wealthScore >= 85 ? '황금운' : '안정운',
      },
      love: {
        title: '애정·대인운',
        score: loveScore,
        iconName: 'Heart',
        summary: loveScore >= 80 ? '상대방과의 소통이 부드럽고 호감도가 급상승합니다.' : '말 한마디에 오해가 생기지 않도록 배려하는 언어를 쓰세요.',
        goodFor: '진솔한 대화, 따뜻한 안부 묻기',
        badFor: '감정적인 말다툼 및 고집',
        badge: loveScore >= 85 ? '설렘운' : '화합운',
      },
      career: {
        title: '직장·학업운',
        score: careerScore,
        iconName: 'Briefcase',
        summary: careerScore >= 80 ? '집중력이 뛰어나며 추진 중인 일에서 역량을 인정받습니다.' : '우선순위를 정해 하나씩 차근차근 매듭지으세요.',
        goodFor: '보고서 작성, 시험 공부, 신규 기획',
        badFor: '무리한 다중 작업 및 업무 미루기',
        badge: careerScore >= 85 ? '승승장구' : '성실운',
      },
      health: {
        title: '건강·컨디션',
        score: healthScore,
        iconName: 'Activity',
        summary: healthScore >= 80 ? '활력이 넘치고 상쾌한 컨디션이 유지됩니다.' : '목과 어깨의 긴장을 풀고 충분한 수분을 섭취하세요.',
        goodFor: '가벼운 산책, 충분한 수면, 스트레칭',
        badFor: '야식, 과음, 장시간 스마트폰 응시',
        badge: healthScore >= 85 ? '최상' : '양호',
      },
    },
    lucky: {
      color: selectedColor.name,
      colorHex: selectedColor.hex,
      number: `${selectedNumber}, ${luckyPairNumber}`,
      direction: selectedDir,
      item: selectedItem,
      time: selectedTime,
      food: selectedFood,
    },
    hourlyEnergy,
    warning: '감정적인 결정을 피하고, 중요한 계약이나 결정은 오후 시간대에 차분히 검토하세요.',
    advice: '오늘 하루 나 자신을 위해 10분의 고요한 휴식을 선물해보세요.',
  };
}

// Calculate Saju Five Elements (오행: 목, 화, 토, 금, 수)
export function calculateSajuElements(profile: UserProfile): {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: string;
  lacking: string;
  advice: string;
} {
  const seed = stringToSeed(`${profile.birthDate || '1995-05-15'}_${profile.gender}_saju`);
  const r = seededRandom(seed);

  let wood = Math.floor(15 + r() * 25);
  let fire = Math.floor(15 + r() * 25);
  let earth = Math.floor(15 + r() * 25);
  let metal = Math.floor(15 + r() * 25);
  let water = 100 - (wood + fire + earth + metal);
  if (water < 10) {
    water = 15;
    wood -= 3;
    fire -= 3;
  }

  const elements = [
    { name: '목(木 - 나무/성장)', score: wood, tag: '목' },
    { name: '화(火 - 불/열정)', score: fire, tag: '화' },
    { name: '토(土 - 흙/안정)', score: earth, tag: '토' },
    { name: '금(金 - 쇠/결단)', score: metal, tag: '금' },
    { name: '수(水 - 물/지혜)', score: water, tag: '수' },
  ];

  elements.sort((a, b) => b.score - a.score);
  const dominant = elements[0].name;
  const lacking = elements[elements.length - 1].name;

  let advice = '';
  if (elements[elements.length - 1].tag === '수') {
    advice = '물의 지혜로운 유연성을 보충하기 위해 수분 섭취와 푸른 계열의 색상을 가까이 하세요.';
  } else if (elements[elements.length - 1].tag === '화') {
    advice = '불의 따뜻한 열정을 보충하기 위해 햇볕을 쬐며 밝은 톤의 옷이나 소품을 활용하세요.';
  } else if (elements[elements.length - 1].tag === '목') {
    advice = '나무의 생명력과 성장 기운을 보완하기 위해 녹색 식물을 기르거나 산책을 즐기세요.';
  } else if (elements[elements.length - 1].tag === '금') {
    advice = '쇠의 예리한 결단력을 보완하기 위해 명확한 계획 정리와 금속 액세서리를 활용하세요.';
  } else {
    advice = '흙의 묵직한 안정감을 보완하기 위해 규칙적인 식사와 자연 속 명상을 실천하세요.';
  }

  return {
    wood,
    fire,
    earth,
    metal,
    water,
    dominant,
    lacking,
    advice,
  };
}
