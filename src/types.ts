export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isFallback?: boolean;
  isCrisis?: boolean;
}

export interface Scenario {
  id: number;
  emoji: string;
  chipText: string;
  situationTitle: string;
  targetCategory: string;
  triggerCondition: string;
  responseDirection: string;
  sampleResponse: string;
  followUpTitle?: string;
  followUpResponse?: string;
}

export interface ComparisonRule {
  forbidden: string;
  forbiddenReason?: string;
  recommended: string;
}
