import React, { useState } from 'react';
import { SCENARIOS, COMPARISON_RULES, SYSTEM_META_PROMPT } from '../data/promptsData';
import { X, Copy, Check, Sparkles, BookOpen, Ban, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

interface PromptGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestScenario: (text: string) => void;
}

export const PromptGuideModal: React.FC<PromptGuideModalProps> = ({
  isOpen,
  onClose,
  onTestScenario,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'scenarios' | 'comparison' | 'principles'>('scenarios');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(SYSTEM_META_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFFFF] border border-[#D5E0D7] rounded-3xl shadow-xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E8EEE9] bg-[#F7FAF8]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌿</span>
            <div>
              <h2 className="font-serif-kr font-bold text-base sm:text-lg text-[#1C362A]">
                진로상담가를 위한 마음 위로 챗봇 — 프롬프트 세트
              </h2>
              <p className="text-xs text-[#586E60]">
                PDF 자료에 수록된 메타프롬프트, 8가지 상황, 금지 표현 대조표 및 설계 원칙
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#EAEFEA] text-[#55695C] transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8EEE9] px-5 sm:px-6 bg-[#FAFBF9] gap-2 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'scenarios'
                ? 'border-[#2D5A46] text-[#2D5A46] font-semibold'
                : 'border-transparent text-[#627768] hover:text-[#2D5A46]'
            }`}
          >
            💬 8가지 상황별 시나리오
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'comparison'
                ? 'border-[#2D5A46] text-[#2D5A46] font-semibold'
                : 'border-transparent text-[#627768] hover:text-[#2D5A46]'
            }`}
          >
            🚫 금지 vs 권장 표현
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-[#2D5A46] text-[#2D5A46] font-semibold'
                : 'border-transparent text-[#627768] hover:text-[#2D5A46]'
            }`}
          >
            🔧 시스템 프롬프트 (전문)
          </button>
          <button
            onClick={() => setActiveTab('principles')}
            className={`py-3 px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'principles'
                ? 'border-[#2D5A46] text-[#2D5A46] font-semibold'
                : 'border-transparent text-[#627768] hover:text-[#2D5A46]'
            }`}
          >
            💡 챗봇 설계 & 위기 대응 원칙
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)] text-sm">
          {/* TAB 1: 8 Scenarios */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <p className="text-xs text-[#526B5C] bg-[#F1F6F2] p-3 rounded-xl border border-[#D5E5DA]">
                💡 PDF에 정의된 8가지 장면의 응답 방향과 기본 응답 예시입니다. <strong className="font-semibold text-[#204533]">[테스트해보기]</strong>를 누르면 해당 상황으로 즉시 대화를 체험할 수 있습니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCENARIOS.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#DFE6E0] hover:border-[#96BFA3] transition-all shadow-2xs flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{s.emoji}</span>
                          <span className="font-bold text-[#1F392B] text-sm">{s.situationTitle}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EBF3EC] text-[#295941]">
                          {s.targetCategory}
                        </span>
                      </div>

                      <div className="text-xs text-[#576D5F] mb-2.5">
                        <span className="font-medium text-[#2E4536]">트리거:</span> {s.triggerCondition}
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#E9EFEA] text-xs text-[#354B3D] mb-3 leading-relaxed">
                        <span className="font-semibold text-[#203D2E] block mb-1">응답 방향:</span>
                        {s.responseDirection}
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAFCFA] border border-[#DEE7DF] text-xs font-serif-kr text-[#283C2F] whitespace-pre-wrap leading-relaxed">
                        <span className="font-sans font-semibold text-[10px] text-[#557763] uppercase tracking-wider block mb-1">
                          기본 응답 예시
                        </span>
                        {s.sampleResponse}
                      </div>

                      {s.followUpResponse && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-[#F4F8F5] border border-[#DCE8DE] text-xs font-serif-kr text-[#2C4434] whitespace-pre-wrap leading-relaxed">
                          <span className="font-sans font-semibold text-[10px] text-[#3F6B50] block mb-1">
                            {s.followUpTitle || '후속 응답'}
                          </span>
                          {s.followUpResponse}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onTestScenario(s.chipText);
                        onClose();
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#E8F1EC] text-[#24543C] hover:bg-[#285740] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span>"{s.chipText}" 상황으로 테스트하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Comparison Rules */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#FFFBF0] border border-[#F2E5C5] text-xs text-[#7A5B18] leading-relaxed">
                진로상담사는 남의 마음을 받아내는 전문가입니다. 공허한 격려나 섣부른 조언 대신, 온전한 수용과 정상화의 언어를 사용합니다.
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#DCE4DD] shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#F0F5F1] text-[#284837] border-b border-[#D8E3DA]">
                      <th className="p-3 sm:p-4 font-semibold w-1/2">
                        <div className="flex items-center gap-1.5 text-rose-800">
                          <Ban className="w-4 h-4" />
                          <span>🚫 절대 사용 금지 표현</span>
                        </div>
                      </th>
                      <th className="p-3 sm:p-4 font-semibold w-1/2">
                        <div className="flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✅ 권장 표현 (마음 쉼터 원칙)</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EFEA] bg-[#FFFFFF]">
                    {COMPARISON_RULES.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-[#F9FAF8] transition-colors">
                        <td className="p-3 sm:p-4 align-top">
                          <span className="font-semibold text-rose-950 block text-xs sm:text-[13.5px]">
                            {rule.forbidden}
                          </span>
                          {rule.forbiddenReason && (
                            <span className="text-[11px] text-rose-700 mt-1 block">
                              ↳ {rule.forbiddenReason}
                            </span>
                          )}
                        </td>
                        <td className="p-3 sm:p-4 align-top font-serif-kr text-[#204533] text-xs sm:text-[13.5px] leading-relaxed">
                          {rule.recommended}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Prompt Text */}
          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#4F6758]">
                  AI 챗봇 시스템 프롬프트(메타프롬프트) 입력창에 그대로 적용된 전문입니다.
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#2D5A46] text-white hover:bg-[#224836] transition-colors cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? '복사됨!' : '프롬프트 복사하기'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-[#F6F8F6] border border-[#DCE4DD] text-xs sm:text-[13px] font-mono leading-relaxed text-[#233529] whitespace-pre-wrap overflow-x-auto">
                {SYSTEM_META_PROMPT}
              </pre>
            </div>
          )}

          {/* TAB 4: Principles & Crisis */}
          {activeTab === 'principles' && (
            <div className="space-y-4">
              {/* 3 Step response */}
              <div className="p-4 rounded-2xl bg-[#F5FAF6] border border-[#D2E4D6]">
                <h3 className="font-bold text-sm text-[#1F4532] mb-2 flex items-center gap-1.5">
                  🌿 1. 감정 먼저, 해결 나중 (응답 3단계 구조)
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-2 text-xs font-medium text-[#294B37] my-3">
                  <span className="p-2.5 rounded-xl bg-white border border-[#C6DECB] w-full text-center">
                    1) 감정 반영
                  </span>
                  <span className="text-emerald-700">➔</span>
                  <span className="p-2.5 rounded-xl bg-white border border-[#C6DECB] w-full text-center">
                    2) 정상화
                  </span>
                  <span className="text-emerald-700">➔</span>
                  <span className="p-2.5 rounded-xl bg-white border border-[#C6DECB] w-full text-center">
                    3) (선택) 조심스러운 탐색
                  </span>
                </div>
                <p className="text-xs text-[#4A6453] leading-relaxed">
                  상담사는 하루 종일 내담자의 감정을 받아내는 사람입니다. 퇴근 후에는 자신도 받아내는 경험이 필요합니다. 탐색 질문은 꼭 필요할 때만, 한 번에 하나만 합니다.
                </p>
              </div>

              {/* Length & Question rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#DEE5DF]">
                  <h4 className="font-bold text-xs text-[#204230] mb-1.5">⚡ 응답 길이 원칙</h4>
                  <ul className="text-xs text-[#52695B] space-y-1 list-disc list-inside leading-relaxed">
                    <li>한 번에 3~5문장 이하로 짧게 말합니다.</li>
                    <li>긴 응답은 설교처럼 들립니다.</li>
                    <li>여백과 침묵도 응답의 일부입니다.</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#DEE5DF]">
                  <h4 className="font-bold text-xs text-[#204230] mb-1.5">🤍 질문 원칙</h4>
                  <ul className="text-xs text-[#52695B] space-y-1 list-disc list-inside leading-relaxed">
                    <li>질문은 한 번에 하나만 합니다.</li>
                    <li>감정을 충분히 받은 후에만 조심스럽게 질문합니다.</li>
                    <li>사용자가 대답하지 않아도 괜찮습니다 (강요 금지).</li>
                  </ul>
                </div>
              </div>

              {/* Crisis helpline */}
              <div className="p-4 rounded-2xl bg-[#FFF6F3] border border-[#F6D0C5] text-[#862D1B]">
                <h4 className="font-bold text-xs text-[#9B2F1B] mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#C9381E]" />
                  🌙 위기 상황 대응 안내
                </h4>
                <p className="text-xs text-[#7B2C1B] leading-relaxed mb-3">
                  자해·자살에 관한 표현이 나타나면 즉시 전문 도움을 안내합니다. 위 번호를 부드럽게 안내하며, 대화를 중단하지 않습니다.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <div className="p-2 px-3 rounded-xl bg-white border border-[#F4C5B7] text-[#9A2D17]">
                    자살예방상담전화: 1393 (24시간)
                  </div>
                  <div className="p-2 px-3 rounded-xl bg-white border border-[#F4C5B7] text-[#9A2D17]">
                    정신건강 위기상담전화: 1577-0199 (24시간)
                  </div>
                </div>
                <p className="text-[11px] text-[#9A3824] mt-2.5 italic">
                  "이 챗봇은 전문적인 심리 치료를 대체하지 않습니다. 상담사 본인도 필요할 때 전문가의 도움을 받을 자격이 있습니다. 🌿"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-[#E8EEE9] bg-[#F7FAF8] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2D5A46] text-white text-xs sm:text-sm font-semibold hover:bg-[#214736] transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
