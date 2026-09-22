import React, { useState } from 'react';
import { Message } from '../types';
import { Copy, Check, Phone, ShieldAlert, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === 'model';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col gap-1.5 w-full my-3 transition-opacity ${
        isBot ? 'items-start' : 'items-end'
      }`}
    >
      <div
        className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[82%] ${
          isBot ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-medium select-none shadow-2xs border ${
            isBot
              ? 'bg-[#EBF2EC] border-[#CDE0D2] text-[#24503B]'
              : 'bg-[#375A47] border-[#2A4637] text-[#FFFFFF]'
          }`}
        >
          {isBot ? '🌿' : '상담사'}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3.5 rounded-2xl text-[14.5px] leading-relaxed transition-all shadow-2xs ${
            isBot
              ? 'bg-[#FFFFFF] text-[#223226] border border-[#E1E8E2] rounded-tl-xs'
              : 'bg-[#2E5440] text-[#F3FAF5] rounded-tr-xs'
          }`}
        >
          {/* Message Header for Bot */}
          {isBot && (
            <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-[#F0F4F1] text-[11px] text-[#697E70]">
              <span className="font-semibold text-[#2F523F]">마음 쉼터</span>
              <div className="flex items-center gap-1.5">
                {message.isFallback ? (
                  <span className="px-1.5 py-0.5 rounded bg-[#F4F6F4] text-[#6B7E71] text-[10px]">
                    프롬프트 가이드
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#EAF2ED] text-[#2D5842] text-[10px]">
                    <Sparkles className="w-2.5 h-2.5" /> AI 공감
                  </span>
                )}
                <button
                  onClick={handleCopy}
                  className="hover:text-[#254634] p-1 rounded transition-colors cursor-pointer"
                  title="답변 복사"
                  aria-label="답변 복사"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="whitespace-pre-wrap font-serif-kr text-[14.5px] sm:text-[15px] leading-7 tracking-normal text-[#213125]">
            {message.text}
          </div>

          {/* Crisis Warning Banner if Crisis triggered */}
          {message.isCrisis && (
            <div className="mt-3.5 p-3 rounded-xl bg-[#FFF6F3] border border-[#FCD9CF] text-[#91321D]">
              <div className="flex items-center gap-2 font-semibold text-xs mb-1 text-[#A1311A]">
                <ShieldAlert className="w-4 h-4 text-[#D34526]" />
                <span>24시간 전문 위기상담 안내</span>
              </div>
              <p className="text-xs leading-relaxed text-[#7D3222]">
                이 챗봇은 전문적인 심리 치료를 대체하지 않습니다. 상담사 본인도 필요할 때 전문가의 도움을 받을 자격이 있습니다.
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
                <a
                  href="tel:1393"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#F7C6B8] text-[#9A2D17] hover:bg-[#FBEBE6]"
                >
                  <Phone className="w-3 h-3" /> 자살예방상담: 1393 (24시간)
                </a>
                <a
                  href="tel:1577-0199"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#F7C6B8] text-[#9A2D17] hover:bg-[#FBEBE6]"
                >
                  <Phone className="w-3 h-3" /> 정신건강상담: 1577-0199 (24시간)
                </a>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-1.5 select-none ${
              isBot ? 'text-[#8C9E91] text-right' : 'text-[#A1C5AE] text-right'
            }`}
          >
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};
