import React from 'react';
import { SCENARIOS } from '../data/promptsData';
import { Sparkles } from 'lucide-react';

interface QuickChipsProps {
  onSelectChip: (text: string) => void;
  disabled?: boolean;
}

export const QuickChips: React.FC<QuickChipsProps> = ({ onSelectChip, disabled }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 mb-2.5 px-1">
        <Sparkles className="w-3.5 h-3.5 text-[#3D7056]" />
        <span className="text-xs font-semibold text-[#4A6152] tracking-wide">
          상담사 빠른 공감 칩 (8가지 상황 테스트)
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            id={`quick-chip-${scenario.id}`}
            onClick={() => onSelectChip(scenario.chipText)}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 sm:p-3 text-left rounded-xl bg-[#FFFFFF] border border-[#DEE5DF] hover:border-[#A4C4AF] hover:bg-[#F4F8F5] text-[#243328] text-xs sm:text-[13px] transition-all shadow-2xs hover:shadow-xs group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-base sm:text-lg shrink-0 group-hover:scale-110 transition-transform">
              {scenario.emoji}
            </span>
            <span className="font-medium line-clamp-1 group-hover:text-[#1E3A2D] text-[#2C3E32]">
              {scenario.chipText}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
