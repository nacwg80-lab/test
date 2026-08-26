import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Fortune Reading API
app.post("/api/fortune/ai-reading", async (req, res) => {
  try {
    const { name, birthDate, birthTime, gender, calendarType, category, question } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API Key is not configured.",
        message: "기본 내장 운세 데이터로 결과를 표시합니다.",
      });
    }

    const todayStr = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    const prompt = `당신은 30년 경력의 명리학 및 동서양 역학 전문가이자 따뜻하고 영험한 '오늘의 운세 마스터 도사'입니다.
오늘 날짜: ${todayStr}
사용자 정보:
- 이름/닉네임: ${name || "방문자"}
- 생년월일: ${birthDate || "미상"} (${calendarType || "양력"})
- 출생시간: ${birthTime || "모름"}
- 성별: ${gender || "무관"}
- 집중 관심사: ${category || "오늘의 종합운세"}
- 사용자의 고민/질문: ${question || "오늘 하루를 지혜롭게 보내기 위한 조언을 부탁드립니다."}

다음 JSON 구조에 맞춰 한국어로 신뢰감 있고, 깊이 있으면서도 따뜻한 어조로 오늘의 운세 풀이를 작성해주세요. 사주 명리학의 오행(목, 화, 토, 금, 수)과 기운의 흐름, 현실적인 실천 팁을 조화롭게 담아주세요.

반드시 아래 JSON 형식만 반환하세요:
{
  "overallScore": 85, // 0~100 사이의 점수
  "headline": "오늘의 한 줄 요약 헤드라인 (예: 귀인의 도움으로 막힌 길이 열리는 날)",
  "overallSummary": "오늘의 전반적인 기운과 사주/별자리 기반 총평 (3~4문장)",
  "wealth": {
    "score": 90,
    "advice": "금전운과 재물 흐름에 대한 실천 조언"
  },
  "love": {
    "score": 80,
    "advice": "애정운, 대인관계, 인연에 대한 조언"
  },
  "career": {
    "score": 85,
    "advice": "직장, 사업, 학업, 시험운에 대한 조언"
  },
  "health": {
    "score": 75,
    "advice": "건강 및 컨디션 관리 조언"
  },
  "luckyElements": {
    "color": "행운의 색상 (예: 코발트 블루)",
    "colorHex": "#2563EB",
    "number": "행운의 숫자 (예: 7, 24)",
    "direction": "행운의 방향 (예: 남동쪽)",
    "item": "행운의 아이템 (예: 따뜻한 허브티, 가죽 지갑)",
    "time": "가장 길한 시간대 (예: 오후 2시 ~ 4시)",
    "food": "행운의 음식 (예: 맑은 조개탕)"
  },
  "dailyWarning": "오늘 특히 경계하거나 피해야 할 행동/상황",
  "dosaAdvice": "도사의 특별 지혜 처방전 및 격려의 메시지 (따뜻하고 품격 있는 격려)"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("AI Fortune error:", error);
    res.status(500).json({
      error: "AI 운세 생성 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

// AI Tarot Reading API
app.post("/api/fortune/tarot-reading", async (req, res) => {
  try {
    const { cardName, isReversed, question, category } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const prompt = `당신은 직관과 통찰력을 겸비한 전문 타로 마스터입니다.
사용자가 뽑은 카드: "${cardName}" (${isReversed ? "역방향(Reversed)" : "정방향(Upright)"})
관심 주제: ${category || "오늘의 하루 운세"}
사용자의 고민/상황: ${question || "오늘 나에게 필요한 타로의 메시지"}

다음 JSON 형식으로 상세하고 영감을 주는 타로 리딩을 작성해주세요:
{
  "cardKeyword": "핵심 키워드 3가지 (예: 새로운 시작, 잠재력, 순수한 열정)",
  "coreMeaning": "이 카드가 현재 상황에서 의미하는 상징과 메시지 (2~3문장)",
  "todayMessage": "오늘 하루를 위한 구체적인 조언 및 적용법 (3~4문장)",
  "affirmation": "마음에 새길 오늘의 긍정 확언 문구",
  "actionTip": "오늘 꼭 실천해볼 만한 구체적 행동 1가지"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Tarot AI error:", error);
    res.status(500).json({ error: "타로 리딩 중 오류가 발생했습니다." });
  }
});

// AI Dream Interpretation API (꿈해몽)
app.post("/api/fortune/dream", async (req, res) => {
  try {
    const { dreamContent } = req.body;
    if (!dreamContent) {
      return res.status(400).json({ error: "꿈 내용을 입력해주세요." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const prompt = `당신은 동양 전통 해몽서와 현대 심리학적 꿈 분석을 접목한 꿈해몽 대가입니다.
사용자가 꾼 꿈 내용:
"${dreamContent}"

다음 JSON 형식으로 명쾌하고 통찰력 있는 꿈해몽을 제공해주세요:
{
  "dreamTitle": "꿈의 핵심 요약 제목 (예: 맑은 물에서 황금 잉어를 잡는 꿈)",
  "luckyLevel": "대길몽" | "길몽" | "평몽" | "조심몽" | "흉몽",
  "luckyScore": 95, // 0~100
  "traditionalMeaning": "전통 동양 해몽학 관점에서의 상징과 풀이",
  "psychologicalMeaning": "현대 심리학 관점에서의 무의식 및 심리 상태 해석",
  "futureSign": "앞으로 다가올 기운이나 주의할 점",
  "luckyNumbers": [7, 14, 28],
  "actionAdvice": "오늘 실천하거나 주의하면 좋은 행동 조언"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Dream API error:", error);
    res.status(500).json({ error: "꿈해몽 분석 중 오류가 발생했습니다." });
  }
});

// AI Quick Fortune Q&A (운세 도사에게 질문하기)
app.post("/api/fortune/ask-dosa", async (req, res) => {
  try {
    const { question, userProfile } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key not configured" });
    }

    const prompt = `당신은 온화하고 혜안을 가진 전통 운세 도사(Master)입니다.
사용자 정보: ${JSON.stringify(userProfile || {})}
질문: "${question}"

다음 지침을 따라 JSON으로 답변하세요:
1. 예의 바르고 기품 있으며 따뜻한 한국어 존칭(하십시오체/해요체) 사용
2. 운의 흐름과 통찰을 바탕으로 명쾌하면서도 현실적인 답 제공
3. 마음의 안정을 주는 따뜻한 덕담 포함

JSON 형식:
{
  "dosaResponse": "도사님의 통찰 어린 답변 (3~4문장)",
  "keyAdvice": "핵심 실천 조언",
  "auspiciousSign": "길조 징조"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Ask Dosa error:", error);
    res.status(500).json({ error: "도사 상담 중 오류가 발생했습니다." });
  }
});

// Vite middleware & Production static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Today's Fortune App Server running on http://localhost:${PORT}`);
  });
}

setupVite();
