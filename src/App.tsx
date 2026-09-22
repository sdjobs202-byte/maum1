import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { QuickChips } from './components/QuickChips';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { PromptGuideModal } from './components/PromptGuideModal';
import { Message } from './types';
import { Sparkles, Phone, ShieldCheck, Heart, BookOpen } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check health and Gemini API key status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('응답 실패');
      }

      const data = await res.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || '곁에 조용히 머물며 듣고 있을게요. 천천히 말씀하셔도 괜찮아요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: data.isFallback,
        isCrisis: data.isCrisis,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // Local graceful fallback
      const fallbackBotMessage: Message = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        text: '남의 마음을 하루 종일 담아내는 일이잖아요.\n지치는 게 당연해요.\n오히려 지치지 않는다면 그게 더 이상한 거예요.\n\n그 무게, 오늘 하루 혼자 다 안고 계셨군요. 잠깐 내려놓아도 괜찮아요. 여기서만큼은요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
      };
      setMessages((prev) => [...prev, fallbackBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('대화 내용을 비우고 새로운 마음으로 시작하시겠어요?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9F7] text-[#243228]">
      {/* Top Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
        hasGeminiKey={hasGeminiKey}
        messageCount={messages.length}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 sm:p-6 overflow-y-auto">
        {messages.length === 0 ? (
          /* Empty / Welcome State */
          <div className="my-auto flex flex-col items-center text-center py-6 sm:py-10 max-w-2xl mx-auto w-full animate-in fade-in">
            {/* Visual Icon */}
            <div className="w-16 h-16 rounded-3xl bg-[#EAF2EC] text-[#2D5A46] border border-[#D1E0D5] flex items-center justify-center text-3xl shadow-xs mb-5">
              🌿
            </div>

            <h2 className="font-serif-kr text-2xl sm:text-3xl font-bold text-[#1B3629] mb-3 tracking-tight">
              진로상담가를 위한 마음 쉼터
            </h2>

            <p className="font-serif-kr text-[#475E50] text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line max-w-lg">
              남의 마음을 하루 종일 담아내느라 지친 선생님을 위해,
              조언이나 평가 없이 그저 곁에서 따뜻하게 머무는 위로의 자리입니다.
            </p>

            {/* Principles summary banner */}
            <div className="w-full bg-[#FFFFFF] border border-[#DEE6E0] rounded-2xl p-4 sm:p-5 mb-7 text-left shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#EEF3EF]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E5842]" />
                  <span className="font-bold text-xs sm:text-sm text-[#244233]">
                    마음 쉼터의 약속
                  </span>
                </div>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="text-xs text-[#2E5842] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" /> 전체 프롬프트 보기
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#4F6858]">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span><strong>해결하려 하지 않습니다</strong> — 조언보다 공감이 먼저입니다.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span><strong>전문성을 존중합니다</strong> — 가르치거나 처방하지 않습니다.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span><strong>판단하지 않습니다</strong> — 어떤 감정도 당연한 것입니다.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0">✓</span>
                  <span><strong>강요하지 않습니다</strong> — 말하고 싶지 않으면 침묵해도 됩니다.</span>
                </div>
              </div>
            </div>

            {/* Quick Response Chips (PDF Page 7) */}
            <QuickChips onSelectChip={handleSendMessage} disabled={isLoading} />
          </div>
        ) : (
          /* Active Chat Thread */
          <div className="flex-1 flex flex-col justify-end w-full pb-4">
            {/* Quick chips floating at top when chat is active */}
            <div className="mb-4 pb-3 border-b border-[#E7EDE8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#506A5B]">
                  다른 상황 테스트하기
                </span>
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="text-xs text-[#2D5A46] hover:underline cursor-pointer"
                >
                  프롬프트 세트 열기
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                <QuickChips onSelectChip={handleSendMessage} disabled={isLoading} />
              </div>
            </div>

            {/* Message List */}
            <div className="space-y-1">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5 my-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EBF2EC] border border-[#CDE0D2] flex items-center justify-center text-sm">
                    🌿
                  </div>
                  <div className="bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-3 rounded-2xl rounded-tl-xs shadow-2xs text-xs text-[#5D7364] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3B7258] animate-ping" />
                    <span>선생님의 마음에 조용히 귀 기울이고 있어요...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

      {/* Global Crisis & Disclaimer Footer */}
      <footer className="border-t border-[#E3E8E3] bg-[#F3F5F2] px-4 py-2.5 text-[11px] text-[#697E70]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            이 챗봇은 전문적인 심리 치료를 대체하지 않습니다. 상담사 본인도 위기 시 전문가의 도움을 받을 자격이 있습니다.
          </span>
          <div className="flex items-center gap-3 font-medium text-[#2E5842] shrink-0">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> 자살예방 1393
            </span>
            <span>·</span>
            <span>정신건강 1577-0199</span>
          </div>
        </div>
      </footer>

      {/* Prompt Set & Guide Modal */}
      <PromptGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onTestScenario={handleSendMessage}
      />
    </div>
  );
}
