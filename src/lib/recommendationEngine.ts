import type { Priority, Recommendation, RecommendationCategory } from './types';

interface RecommendationTemplate {
  category: RecommendationCategory;
  problem: string;
  solution: string;
  expectedImpact: string;
  priority: Priority;
}

const templates: RecommendationTemplate[] = [
  {
    category: 'Performance',
    problem: 'Large, unoptimized images are likely slowing down page loading, especially on mobile connections.',
    solution: 'Compress all images, convert to WebP or AVIF formats, and implement native lazy loading with width and height attributes to prevent layout shift.',
    expectedImpact: 'Faster page loads, reduced bandwidth usage, and improved user experience across all devices.',
    priority: 'High',
  },
  {
    category: 'Performance',
    problem: 'Render-blocking JavaScript and CSS files delay the first contentful paint, keeping users staring at a blank screen.',
    solution: 'Defer non-critical JavaScript, inline critical CSS, and use code splitting to load only what is needed for the initial viewport.',
    expectedImpact: 'Significantly faster first contentful paint and improved perceived load time.',
    priority: 'High',
  },
  {
    category: 'Performance',
    problem: 'Server response times may be elevated, adding latency before the browser can even begin rendering.',
    solution: 'Enable CDN caching, implement server-side caching headers, and consider edge caching for static assets to reduce time to first byte.',
    expectedImpact: 'Lower time-to-first-byte and faster overall page delivery.',
    priority: 'Medium',
  },
  {
    category: 'SEO',
    problem: 'Missing or poorly written meta titles and descriptions reduce search engine visibility and click-through rates.',
    solution: 'Craft unique, keyword-rich meta titles (under 60 characters) and descriptions (under 160 characters) for every page.',
    expectedImpact: 'Higher search rankings, better SERP click-through rates, and more organic traffic.',
    priority: 'High',
  },
  {
    category: 'SEO',
    problem: 'Structured data (Schema.org markup) is missing, making it harder for search engines to understand page content.',
    solution: 'Add JSON-LD structured data for your organization, breadcrumbs, articles, and products to enable rich snippets.',
    expectedImpact: 'Richer search results, enhanced SERP appearance, and improved content discoverability.',
    priority: 'Medium',
  },
  {
    category: 'SEO',
    problem: 'Heading hierarchy may be inconsistent, with skipped levels or multiple H1 tags confusing search engine crawlers.',
    solution: 'Use a single H1 per page and follow a strict H1 > H2 > H3 hierarchy that reflects content structure.',
    expectedImpact: 'Better content understanding by search engines and improved accessibility.',
    priority: 'Low',
  },
  {
    category: 'Mobile',
    problem: 'Tap targets may be too small or too close together, making navigation difficult on touch devices.',
    solution: 'Ensure all interactive elements are at least 48x48 pixels with sufficient spacing between them.',
    expectedImpact: 'Fewer mis-taps, better mobile usability, and improved mobile search rankings.',
    priority: 'High',
  },
  {
    category: 'Mobile',
    problem: 'Content may overflow horizontally on narrow viewports, forcing users to pinch and zoom to read.',
    solution: 'Use fluid typography, responsive grid layouts, and max-width constraints to ensure content fits within the viewport.',
    expectedImpact: 'A seamless mobile reading experience with no horizontal scrolling.',
    priority: 'Medium',
  },
  {
    category: 'Mobile',
    problem: 'Font sizes may be too small for comfortable reading on mobile devices.',
    solution: 'Use a base font size of at least 16px and implement responsive scaling with clamp() or media queries.',
    expectedImpact: 'Improved readability on mobile devices and better user engagement.',
    priority: 'Low',
  },
  {
    category: 'Accessibility',
    problem: 'Images may lack descriptive alt text, making content invisible to screen reader users.',
    solution: 'Add concise, descriptive alt attributes to all meaningful images and use empty alt="" for decorative ones.',
    expectedImpact: 'Screen reader users can understand visual content, improving compliance with WCAG standards.',
    priority: 'High',
  },
  {
    category: 'Accessibility',
    problem: 'Color contrast ratios may fall below WCAG AA standards, making text hard to read for users with visual impairments.',
    solution: 'Ensure text has a contrast ratio of at least 4.5:1 against its background, and 3:1 for large text.',
    expectedImpact: 'Readable content for all users and compliance with accessibility regulations.',
    priority: 'Medium',
  },
  {
    category: 'Accessibility',
    problem: 'Form inputs may be missing associated labels, making them unusable with assistive technology.',
    solution: 'Associate every input with a label element or aria-label attribute and mark required fields clearly.',
    expectedImpact: 'All users can fill forms independently, including those relying on screen readers.',
    priority: 'Medium',
  },
  {
    category: 'UX',
    problem: 'Navigation structure may be unclear or overly deep, making it hard for users to find what they need.',
    solution: 'Simplify navigation to 5-7 top-level items, use descriptive labels, and add breadcrumbs for deeper pages.',
    expectedImpact: 'Users find content faster, reducing bounce rates and increasing engagement.',
    priority: 'Medium',
  },
  {
    category: 'UX',
    problem: 'Call-to-action buttons may lack visual prominence or descriptive text, reducing click-through.',
    solution: 'Use high-contrast colors, clear action verbs, and adequate button sizing for all CTAs.',
    expectedImpact: 'Higher conversion rates and clearer user paths through the site.',
    priority: 'Medium',
  },
  {
    category: 'Conversion',
    problem: 'The site may lack trust signals such as testimonials, reviews, or security badges near key conversion points.',
    solution: 'Add customer testimonials, trust badges, and social proof near checkout and signup forms.',
    expectedImpact: 'Increased user trust and higher conversion rates on key pages.',
    priority: 'Medium',
  },
  {
    category: 'Conversion',
    problem: 'Forms may be too long or ask for unnecessary information, causing user abandonment.',
    solution: 'Reduce forms to essential fields only, enable autofill, and show progress indicators for multi-step forms.',
    expectedImpact: 'Lower form abandonment rates and higher completion rates.',
    priority: 'Low',
  },
  {
    category: 'Technical',
    problem: 'Missing or misconfigured security headers leave the site vulnerable to common web attacks.',
    solution: 'Set Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, and Strict-Transport-Security headers.',
    expectedImpact: 'Hardened security posture and protection against XSS, clickjacking, and MIME sniffing attacks.',
    priority: 'High',
  },
  {
    category: 'Technical',
    problem: 'The site may not be served over HTTPS or may have mixed content, reducing security and trust.',
    solution: 'Enforce HTTPS with redirects, use HSTS, and replace all HTTP resource references with HTTPS.',
    expectedImpact: 'Secure connections for all users and improved search rankings.',
    priority: 'High',
  },
  {
    category: 'Technical',
    problem: 'Broken or redirecting internal links create dead ends that waste crawl budget and frustrate users.',
    solution: 'Run regular broken-link audits, implement 301 redirects for moved pages, and use descriptive anchor text.',
    expectedImpact: 'Better crawl efficiency, improved user experience, and preserved link equity.',
    priority: 'Low',
  },
];

interface Scores {
  performance: number;
  seo: number;
  mobile: number;
  accessibility: number;
  usability: number;
  technical: number;
}

const categoryToScoreKey: Record<RecommendationCategory, keyof Scores | null> = {
  Performance: 'performance',
  SEO: 'seo',
  Mobile: 'mobile',
  Accessibility: 'accessibility',
  UX: 'usability',
  Conversion: 'usability',
  Technical: 'technical',
};

export function generateRecommendations(
  scores: Scores,
  rand: () => number,
): Recommendation[] {
  const selected: Recommendation[] = [];
  const usedIndices = new Set<number>();

  const sortedTemplates = [...templates].sort((a, b) => {
    const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  for (const tmpl of sortedTemplates) {
    const scoreKey = categoryToScoreKey[tmpl.category];
    if (!scoreKey) continue;

    const score = scores[scoreKey];
    const threshold = tmpl.priority === 'High' ? 80 : tmpl.priority === 'Medium' ? 65 : 50;

    if (score < threshold) {
      const idx = templates.indexOf(tmpl);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        selected.push({
          id: `rec-${idx}-${Math.round(rand() * 100000)}`,
          priority: tmpl.priority,
          category: tmpl.category,
          problem: tmpl.problem,
          solution: tmpl.solution,
          expectedImpact: tmpl.expectedImpact,
        });
      }
    }
  }

  while (selected.length < 8) {
    const idx = Math.floor(rand() * templates.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      const tmpl = templates[idx];
      selected.push({
        id: `rec-${idx}-${Math.round(rand() * 100000)}`,
        priority: tmpl.priority,
        category: tmpl.category,
        problem: tmpl.problem,
        solution: tmpl.solution,
        expectedImpact: tmpl.expectedImpact,
      });
    }
    if (usedIndices.size >= templates.length) break;
  }

  const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
  return selected.slice(0, 12).sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
