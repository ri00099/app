export type ScoreCategory =
  | 'performance'
  | 'seo'
  | 'mobile'
  | 'accessibility'
  | 'usability'
  | 'technical';

export type Priority = 'High' | 'Medium' | 'Low';

export type RecommendationCategory =
  | 'Performance'
  | 'SEO'
  | 'Mobile'
  | 'Accessibility'
  | 'UX'
  | 'Conversion'
  | 'Technical';

export interface CategoryScore {
  category: ScoreCategory;
  label: string;
  score: number;
  maxScore: number;
}

export interface Recommendation {
  id: string;
  priority: Priority;
  category: RecommendationCategory;
  problem: string;
  solution: string;
  expectedImpact: string;
}

export interface AuditResult {
  id: string;
  url: string;
  normalizedUrl: string;
  domain: string;
  timestamp: number;
  scores: {
    overall: number;
    performance: number;
    seo: number;
    mobile: number;
    accessibility: number;
    usability: number;
    technical: number;
  };
  summary: string;
  recommendations: Recommendation[];
  details: {
    label: string;
    category: ScoreCategory;
    score: number;
    maxScore: number;
    description: string;
  }[];
}

export interface AuditHistoryEntry {
  id: string;
  url: string;
  domain: string;
  overallScore: number;
  timestamp: number;
}

export type View = 'dashboard' | 'results' | 'history';
