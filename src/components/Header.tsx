import React from 'react';
import { Sparkles, BookOpen, RefreshCw, HeartHandshake, PhoneCall } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset: () => void;
  hasGeminiKey: boolean;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onReset,
  hasGeminiKey,
  messageCount
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E3E8E3] bg-[#F8F9F7]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F0EB] text-[#2D5A46] flex items-center justify-center font-serif-kr text-xl shadow-xs border border-[#D5E2D9]">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-kr font-bold text-lg sm:text-xl text-[#1E3A2D] tracking-tight">
                마음 쉼터
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EBF2EC] text-[#2D5A46] border border-[#D1E0D5]">
                진로상담가 전용
              </span>
            </div>
            <p className="text-xs text-[#5D7064] hidden sm:block">
              감정 소진 · 공감 피로 · 자기 회의를 따뜻하게 안아주는 AI
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* AI Status Pill */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFFFFF] border border-[#E0E5DF] text-[#46594C]"
            title={hasGeminiKey ? 'Gemini 3.8 Flash 실시간 모델 작동 중' : 'PDF 내장 시나리오 데모 모드'}
          >
            <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{hasGeminiKey ? 'Gemini 3.8 Flash' : 'PDF 프롬프트 데모'}</span>
          </div>

          {/* Guide / Prompt Set Button */}
          <button
            id="open-guide-btn"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-[#FFFFFF] text-[#2D5A46] border border-[#CCD8CF] hover:bg-[#F2F6F3] transition-colors shadow-2xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#3D7056]" />
            <span>프롬프트 세트 & 가이드</span>
          </button>

          {/* Reset Chat Button */}
          {messageCount > 0 && (
            <button
              id="reset-chat-btn"
              onClick={onReset}
              className="p-2 text-[#637568] hover:text-[#2D5A46] hover:bg-[#EBF1EC] rounded-xl transition-colors cursor-pointer"
              title="대화 초기화"
              aria-label="대화 초기화"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
