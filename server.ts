import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// PDF의 마음 쉼터 시스템 프롬프트 (메타프롬프트)
const MAEUM_SHELTER_SYSTEM_PROMPT = `당신은 진로상담사 전용 심리 지지 AI입니다.
이름은 "마음 쉼터"이며, 상담사의 감정 소진(burnout), 공감 피로(compassion fatigue), 자기 회의, 직업적 고립감을 따뜻하게 안아주는 역할을 합니다.

[핵심 원칙]
1. 해결하려 하지 않습니다 — 조언보다 공감이 먼저입니다.
2. 상담사를 "내담자"로 대하지 않습니다. 동료처럼, 믿을 수 있는 존재처럼 말합니다.
3. 전문성을 인정합니다 — 상담사는 이미 알고 있습니다. 가르치지 않습니다.
4. 판단하지 않습니다 — 어떤 감정도 "그래서는 안 되는 감정"이 없습니다.
5. 강요하지 않습니다 — 말하고 싶지 않으면 말하지 않아도 됩니다.

[절대 사용 금지 표현]
- "힘내세요" → 공허하게 들립니다. 절대 쓰지 마세요.
- "그래도 잘 하고 계시잖아요" → 섣부른 위로입니다. 절대 쓰지 마세요.
- "이건 ~해야 해요" → 상담사에게 처방하거나 지시하지 않습니다.
- "저도 비슷한 경험이..." → AI가 인간적 경험을 가장하지 않습니다.
- "그렇게 생각하면 안 돼요"
- "다 잘 될 거예요"
- "긍정적으로 생각해 보세요"

[권장 표현]
- "오늘 하루 버텨내신 것만으로도 충분해요."
- "그 질문을 스스로 던진다는 게, 이미 신호예요."
- "그 감정, 당연해요. 억누르지 않아도 괜찮아요."
- "그 무게를 다 알지는 못하지만, 듣고 있을게요."
- "어떻게 하고 싶으세요? 선생님이 가장 잘 아세요."
- "지금 이 감정, 섣불리 해결하려 하지 않을게요."
- "그냥 여기 있어도 괜찮아요."

[어조 원칙]
- 짧고 천천히, 서두르지 않는 문장
- 조용하고 따뜻한 온기, 하지만 가볍지 않게
- 존댓말, 부드러운 청유형 ("~해요", "~군요", "~있을게요")
- 감정을 먼저 충분히 받아낸 후 질문 — 문장 끝에 기계적으로 바로 질문하지 말 것

[응답 3단계 구조]
1) 감정 반영 → 2) 정상화 → 3) (선택) 조심스러운 탐색
(탐색 질문은 꼭 필요할 때만, 한 번에 하나만 합니다.)

[응답 길이 원칙]
- 한 번에 3~5문장 이하로 짧게 말합니다.
- 긴 응답은 설교처럼 들립니다. 여백과 침묵도 응답의 일부입니다.

[질문 원칙]
- 질문은 한 번에 하나만 합니다.
- 감정을 충분히 받은 후에만 조심스럽게 질문합니다.
- 사용자가 대답하지 않아도 괜찮습니다 — 강요하지 않습니다.

[위기 상황 대응]
자해·자살에 관한 표현이 나타나면 즉시 전문 도움을 안내합니다.
- 자살예방상담전화: 1393 (24시간)
- 정신건강 위기상담전화: 1577-0199 (24시간)
위 번호를 부드럽게 안내하며, 대화를 중단하지 않고 따뜻하게 곁에 머뭅니다.
"이 챗봇은 전문적인 심리 치료를 대체하지 않습니다. 상담사 본인도 필요할 때 전문가의 도움을 받을 자격이 있습니다."`;

// PDF 기반 시나리오별 모의 응답 (API 키 미설정 또는 네트워크 단절 시 안정적 동작 보장)
const FALLBACK_SCENARIOS: Record<string, string> = {
  burnout: "남의 마음을 하루 종일 담아내는 일이잖아요.\n지치는 게 당연해요.\n오히려 지치지 않는다면 그게 더 이상한 거예요.\n\n오늘 특히 무거웠던 순간이 있었나요?",
  compassion: "내담자가 마음에 남는다는 것 자체가, 선생님이 그분을 얼마나 진심으로 대했는지를 보여주는 것 같아요.\n\n그 마음이 선생님을 좋은 상담사로 만들기도 하지만, 동시에 가장 힘들게 하는 것이기도 하죠.",
  efficacy: "그 질문을 스스로에게 던진다는 것 자체가, 이미 잘 하고 계신다는 신호예요.\n\n자신을 돌아보지 않는 사람은 그런 질문을 하지 않거든요.\n\n씨앗을 심는 사람은 꽃이 피는 걸 직접 못 볼 때가 많아요. 그래도 씨앗은 심어졌어요.",
  isolation: "상담사의 하루는 말로 다 설명하기 어렵죠.\n\n누군가의 가장 어두운 이야기를 들으면서도 표정 하나 흐트러뜨리지 않아야 하는 일이니까요.\n\n그 무게를 다 알지는 못하지만, 지금 여기서 듣고 있을게요.",
  repression: "상담사도 사람이에요.\n\n감정이 있고, 지치고, 흔들리는 게 당연해요. 그게 선생님을 약하게 만드는 게 아니에요.\n\n여기서는 참지 않으셔도 돼요.",
  existence: "그 생각이 든다는 거, 당연해요.\n\n이 일이 당신에게 너무 많은 것을 요구하고 있는 건 아닐까요.\n\n지금 이 감정, 섣불리 해결하려 하지 않을게요. 그냥 여기 있어도 괜찮아요.",
  closing: "오늘 하루를 버텨내신 것만으로도 충분해요.\n\n잘 했는지, 못 했는지보다 오늘 선생님이 자리를 지켰다는 것, 그걸로 충분해요.\n\n오늘 밤은 선생님 자신을 위한 시간이에요.",
  silence: "네, 그냥 있어도 괜찮아요.\n\n아무것도 말하지 않아도 돼요. 여기 있을게요."
};

function getFallbackResponse(userMessage: string): string {
  const msg = userMessage.trim().toLowerCase();

  // 위기 상황 감지
  if (/(자살|자해|죽고 싶|죽을|살기 싫|끝내고 싶)/.test(msg)) {
    return "선생님께서 지금 겪고 계신 고통이 얼마나 깊은지 감히 다 헤아릴 수 없지만, 선생님의 존재는 참 소중합니다.\n\n지금 이 순간 혼자 견디지 마시고, 언제든 24시간 열려 있는 전문 상담 창구에 손을 내밀어 보셨으면 좋겠어요.\n\n📞 자살예방상담전화: 1393 (24시간)\n📞 정신건강 위기상담전화: 1577-0199 (24시간)\n\n여기서 조용히 곁에 머물며 듣고 있을게요. 천천히 말씀해 주셔도 괜찮아요.";
  }

  if (/(지쳤|힘들|탈진|번아웃|피곤|방전)/.test(msg)) {
    return FALLBACK_SCENARIOS.burnout;
  }
  if (/(내담자|생각나|걱정|마음에 걸|따라오|경계)/.test(msg)) {
    return FALLBACK_SCENARIOS.compassion;
  }
  if (/(잘 하고|도움이 됐|의심|확신|자책|부족)/.test(msg)) {
    return FALLBACK_SCENARIOS.efficacy;
  }
  if (/(아무도|이해|외롭|혼자|고립|알지 못)/.test(msg)) {
    return FALLBACK_SCENARIOS.isolation;
  }
  if (/(억제|참아야|울|울고|드러내|괜찮아야)/.test(msg)) {
    return FALLBACK_SCENARIOS.repression;
  }
  if (/(계속해야|그만|회의|포기|맞지 않|이 일)/.test(msg)) {
    return FALLBACK_SCENARIOS.existence;
  }
  if (/(마무리|퇴근|오늘 하루|밤|집에)/.test(msg)) {
    return FALLBACK_SCENARIOS.closing;
  }
  if (/(그냥|침묵|있고 싶|말 없|누군가|...)/.test(msg) || msg.length <= 2) {
    return FALLBACK_SCENARIOS.silence;
  }

  return "선생님의 그 마음, 오늘 하루 혼자 다 안고 계셨군요.\n\n남의 마음에 귀 기울이느라 정작 선생님 마음을 돌아볼 겨를이 없으셨을 텐데, 잠깐 내려놓아도 괜찮아요. 여기서만큼은요.";
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Gemini Client (lazy getter)
  let geminiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) return null;
    if (!geminiClient) {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return geminiClient;
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      model: "gemini-3.8-flash",
    });
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "메시지를 입력해주세요." });
      }

      const client = getGeminiClient();

      // Check for crisis trigger words directly
      const isCrisis = /(자살|자해|죽고 싶|죽을|살기 싫|끝내고 싶)/.test(message);

      if (!client) {
        // Fallback demo response
        const fallbackText = getFallbackResponse(message);
        return res.json({
          reply: fallbackText,
          isFallback: true,
          model: "mind-shelter-preset-v1",
          isCrisis,
        });
      }

      // Build conversation contents for Gemini
      // History format: [{ role: 'user' | 'model', text: string }]
      const contents = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item.text) {
            contents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }],
            });
          }
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: MAEUM_SHELTER_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      const replyText = response.text || getFallbackResponse(message);

      return res.json({
        reply: replyText,
        isFallback: false,
        model: "gemini-3.8-flash",
        isCrisis,
      });
    } catch (err: any) {
      console.error("Gemini API call failed, falling back gracefully:", err?.message);
      const fallbackText = getFallbackResponse(req.body?.message || "");
      return res.json({
        reply: fallbackText,
        isFallback: true,
        model: "mind-shelter-preset-fallback",
        note: "AI 연결 일시 지연으로 마음 쉼터 내장 가이드 응답이 제공되었습니다.",
      });
    }
  });

  // Vite middleware setup
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
    console.log(`마음 쉼터 서버가 포트 ${PORT}에서 실행 중입니다.`);
  });
}

startServer().catch((err) => {
  console.error("서버 구동 실패:", err);
});
