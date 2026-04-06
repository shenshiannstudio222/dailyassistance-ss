export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  domain: string;
  frameworks: string[];
  situation: string;
  problem: string;
  partialData: string;
  difficulty: Difficulty;
}

export interface Decision {
  problemDefinition: string;
  metric: string;
  rootCauses: string;
  hypotheses: string;
  action: string;
}

export interface CritiqueDimension {
  score: number;
  feedback: string;
}

export interface MasteryImpact {
  domain: string;
  impactDescription: string;
  frameworksUsed: string[];
  skillsDeveloped: string[];
}

export interface Critique {
  structural: CritiqueDimension;
  evidence: CritiqueDimension;
  bias: CritiqueDimension;
  strategic: CritiqueDimension;
  implementation: CritiqueDimension;
  correctnessAnalysis: {
    isCorrect: boolean;
    explanation: string;
    suggestions: string;
  };
  masteryImpact: MasteryImpact;
  topOnePercent: string;
  overallScore: number;
}

export interface UserProgress {
  streak: number;
  lastCompletedDate: string | null;
  totalCasesCompleted: number;
  domainMastery: Record<string, number>;
  history: {
    id: string;
    caseStudy: CaseStudy;
    decision: Decision;
    critique: Critique;
    date: string;
    score: number;
  }[];
}
