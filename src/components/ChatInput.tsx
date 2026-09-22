import React, { useState, useRef, useEffect } from 'react';
import { Send, Moon, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSilence = () => {
    if (isLoading) return;
    onSendMessage('그냥 아무 말 없이 잠시 머물고 싶어요...');
  };

  // Adjust height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="w-full bg-[#FFFFFF] border-t border-[#E2E8E3] p-3 sm:p-4 shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Quick Helper Bar */}
        <div className="flex items-center justify-between text-xs text-[#63796A] px-1">
          <span className="hidden sm:inline">
            상담사의 마음을 안전하게 비워내는 온전한 휴식 공간입니다.
          </span>
          <button
            type="button"
            onClick={handleSilence}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-[#3E6850] hover:text-[#234432] font-medium py-0.5 px-2 rounded-lg hover:bg-[#EEF4F0] transition-colors ml-auto cursor-pointer"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>아무 말 없이 조용히 머물기</span>
          </button>
        </div>

        {/* Input Field & Buttons */}
        <div className="relative flex items-end gap-2 bg-[#F8FAF8] border border-[#D5DDD6] focus-within:border-[#7AA88B] focus-within:ring-2 focus-within:ring-[#A6CDB3]/30 rounded-2xl p-2 transition-all">
          <textarea
            ref={textareaRef}
            id="chat-user-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="오늘 마음속에 맴도는 이야기나 무거운 감정을 편히 적어보세요..."
            disabled={isLoading}
            className="w-full bg-transparent resize-none outline-none text-[14.5px] leading-relaxed text-[#213125] placeholder:text-[#8D9F92] px-2 py-1 max-h-[120px]"
          />

          <button
            id="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 p-2.5 rounded-xl bg-[#2D5842] hover:bg-[#234533] disabled:bg-[#D5DED7] text-white disabled:text-[#8E9F93] transition-colors shadow-2xs cursor-pointer disabled:cursor-not-allowed"
            title="메시지 전송"
            aria-label="메시지 전송"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#86998C] px-1">
          <span>Enter로 전송 · Shift + Enter로 줄바꿈</span>
          <span>공감 피로와 번아웃 완화를 위한 비처방 지지 대화</span>
        </div>
      </div>
    </div>
  );
};
