import type { AuditResult, ScoreCategory } from './types';
import { extractDomain, normalizeUrl } from './urlUtils';
import { generateRecommendations } from './recommendationEngine';
import { generateSummary } from './summaryEngine';

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreForCategory(
  rand: () => number,
  base: number,
  variance: number,
): number {
  const offset = (rand() - 0.5) * 2 * variance;
  return clampScore(base + offset);
}

interface CategoryDetail {
  label: string;
  description: string;
}

const categoryDetails: Record<ScoreCategory, CategoryDetail> = {
  performance: {
    label: 'Page Performance',
    description: 'Load time, resource optimization, and rendering speed',
  },
  seo: {
    label: 'SEO',
    description: 'Meta tags, structured data, and search engine discoverability',
  },
  mobile: {
    label: 'Mobile',
    description: 'Responsive design, viewport configuration, and mobile usability',
  },
  accessibility: {
    label: 'Accessibility',
    description: 'ARIA labels, color contrast, and assistive technology support',
  },
  usability: {
    label: 'Usability',
    description: 'Navigation clarity, content structure, and user flow efficiency',
  },
  technical: {
    label: 'Technical Quality',
    description: 'HTTPS, headers, code quality, and security best practices',
  },
};

export function runAudit(urlInput: string): AuditResult {
  const normalized = normalizeUrl(urlInput);
  const domain = extractDomain(urlInput);
  const seed = hashString(normalized);
  const rand = seededRandom(seed);

  const tld = domain.split('.').pop()?.toLowerCase() || '';
  const pathSegmentCount = (() => {
    try {
      return new URL(normalized).pathname.split('/').filter(Boolean).length;
    } catch {
      return 0;
    }
  })();
  const hasHttps = normalized.startsWith('https://');
  const domainLength = domain.length;

  let performanceBase = 65 + rand() * 25;
  if (pathSegmentCount > 3) performanceBase -= 8;
  if (!hasHttps) performanceBase -= 5;

  let seoBase = 60 + rand() * 30;
  if (domainLength < 10) seoBase += 5;
  if (tld === 'com') seoBase += 3;

  let mobileBase = 55 + rand() * 35;
  if (pathSegmentCount > 4) mobileBase -= 6;

  let accessibilityBase = 50 + rand() * 35;

  let usabilityBase = 62 + rand() * 28;

  let technicalBase = 58 + rand() * 32;
  if (hasHttps) technicalBase += 8;
  if (tld === 'dev' || tld === 'app') technicalBase += 4;

  const performance = scoreForCategory(rand, performanceBase, 6);
  const seo = scoreForCategory(rand, seoBase, 5);
  const mobile = scoreForCategory(rand, mobileBase, 5);
  const accessibility = scoreForCategory(rand, accessibilityBase, 6);
  const usability = scoreForCategory(rand, usabilityBase, 5);
  const technical = scoreForCategory(rand, technicalBase, 5);

  const overall = clampScore(
    Math.round(
      performance * 0.2 +
      seo * 0.2 +
      mobile * 0.2 +
      accessibility * 0.15 +
      usability * 0.15 +
      technical * 0.1,
    ),
  );

  const scores = {
    overall,
    performance,
    seo,
    mobile,
    accessibility,
    usability,
    technical,
  };

  const recommendations = generateRecommendations(scores, rand);
  const summary = generateSummary(scores, domain);

  const details = (Object.keys(categoryDetails) as ScoreCategory[]).map(
    (cat) => ({
      label: categoryDetails[cat].label,
      category: cat,
      score: scores[cat],
      maxScore: 100,
      description: categoryDetails[cat].description,
    }),
  );

  return {
    id: `${seed}-${Date.now()}`,
    url: normalized,
    normalizedUrl: normalized,
    domain,
    timestamp: Date.now(),
    scores,
    summary,
    recommendations,
    details,
  };
}
