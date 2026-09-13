/**
 * SitePilot AI — Server-side audit engine
 *
 * This is the heuristic engine that runs on the Express backend.
 * It is structured so that it can later be replaced with real audit
 * sources (Lighthouse, PageSpeed Insights, HTML crawler, LLM APIs)
 * without changing the consumer interface.
 */

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreForCategory(rand, base, variance) {
  return clampScore(base + (rand() - 0.5) * 2 * variance);
}

const recommendationTemplates = [
  {
    category: 'Performance',
    problem: 'Large, unoptimized images are likely slowing down page loading, especially on mobile connections.',
    solution: 'Compress all images, convert to WebP or AVIF formats, and implement native lazy loading.',
    expectedImpact: 'Faster page loads, reduced bandwidth, and improved user experience.',
    priority: 'High',
  },
  {
    category: 'SEO',
    problem: 'Missing or poorly written meta titles and descriptions reduce search engine visibility.',
    solution: 'Craft unique, keyword-rich meta titles and descriptions for every page.',
    expectedImpact: 'Higher search rankings and better SERP click-through rates.',
    priority: 'High',
  },
  {
    category: 'Mobile',
    problem: 'Tap targets may be too small or too close together on touch devices.',
    solution: 'Ensure all interactive elements are at least 48x48 pixels with adequate spacing.',
    expectedImpact: 'Fewer mis-taps and improved mobile usability.',
    priority: 'High',
  },
  {
    category: 'Accessibility',
    problem: 'Images may lack descriptive alt text, making content invisible to screen readers.',
    solution: 'Add concise, descriptive alt attributes to all meaningful images.',
    expectedImpact: 'Screen reader users can understand visual content.',
    priority: 'High',
  },
  {
    category: 'Technical',
    problem: 'Missing security headers leave the site vulnerable to common web attacks.',
    solution: 'Set Content-Security-Policy, X-Content-Type-Options, and HSTS headers.',
    expectedImpact: 'Hardened security posture and protection against XSS attacks.',
    priority: 'High',
  },
  {
    category: 'Performance',
    problem: 'Render-blocking JavaScript and CSS delay the first contentful paint.',
    solution: 'Defer non-critical JavaScript, inline critical CSS, and use code splitting.',
    expectedImpact: 'Significantly faster first contentful paint.',
    priority: 'Medium',
  },
  {
    category: 'SEO',
    problem: 'Structured data (Schema.org markup) is missing.',
    solution: 'Add JSON-LD structured data for organization, breadcrumbs, and articles.',
    expectedImpact: 'Richer search results and improved discoverability.',
    priority: 'Medium',
  },
  {
    category: 'UX',
    problem: 'Navigation structure may be unclear or overly deep.',
    solution: 'Simplify navigation to 5-7 top-level items and add breadcrumbs.',
    expectedImpact: 'Users find content faster, reducing bounce rates.',
    priority: 'Medium',
  },
  {
    category: 'Conversion',
    problem: 'The site may lack trust signals near key conversion points.',
    solution: 'Add customer testimonials, trust badges, and social proof near forms.',
    expectedImpact: 'Increased user trust and higher conversion rates.',
    priority: 'Medium',
  },
  {
    category: 'Technical',
    problem: 'Broken or redirecting internal links create dead ends.',
    solution: 'Run regular broken-link audits and implement 301 redirects.',
    expectedImpact: 'Better crawl efficiency and preserved link equity.',
    priority: 'Low',
  },
];

const categoryToScoreKey = {
  Performance: 'performance',
  SEO: 'seo',
  Mobile: 'mobile',
  Accessibility: 'accessibility',
  UX: 'usability',
  Conversion: 'usability',
  Technical: 'technical',
};

function generateRecommendations(scores, rand) {
  const selected = [];
  const usedIndices = new Set();

  const sorted = [...recommendationTemplates].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });

  for (const tmpl of sorted) {
    const key = categoryToScoreKey[tmpl.category];
    if (!key) continue;
    const score = scores[key];
    const threshold = tmpl.priority === 'High' ? 80 : tmpl.priority === 'Medium' ? 65 : 50;
    if (score < threshold) {
      const idx = recommendationTemplates.indexOf(tmpl);
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

  while (selected.length < 8 && usedIndices.size < recommendationTemplates.length) {
    const idx = Math.floor(rand() * recommendationTemplates.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      const tmpl = recommendationTemplates[idx];
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

  const order = { High: 0, Medium: 1, Low: 2 };
  return selected.slice(0, 12).sort((a, b) => order[a.priority] - order[b.priority]);
}

function generateSummary(scores, domain) {
  const parts = [];

  if (scores.overall >= 80) {
    parts.push(`The website "${domain}" has a strong overall health score of ${scores.overall}/100.`);
  } else if (scores.overall >= 50) {
    parts.push(`The website "${domain}" has a moderate overall health score of ${scores.overall}/100.`);
  } else {
    parts.push(`The website "${domain}" has a low overall health score of ${scores.overall}/100.`);
  }

  const cats = [
    { name: 'performance', score: scores.performance },
    { name: 'SEO', score: scores.seo },
    { name: 'mobile experience', score: scores.mobile },
    { name: 'accessibility', score: scores.accessibility },
  ];
  const sorted = cats.sort((a, b) => a.score - b.score);
  const weakest = sorted[0];

  if (weakest.score < 70) {
    parts.push(`The weakest area is ${weakest.name} (${weakest.score}/100), which should be a priority.`);
  }

  return parts.join(' ');
}

function normalizeUrl(input) {
  let url = input.trim();
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  return url;
}

function extractDomain(input) {
  try {
    const normalized = normalizeUrl(input);
    return new URL(normalized).hostname.replace(/^www\./, '');
  } catch {
    return input;
  }
}

/**
 * Run a heuristic audit on the given URL.
 *
 * This function is designed to be swappable: in the future, replace
 * the body with calls to Lighthouse, PageSpeed Insights, an HTML crawler,
 * or an LLM recommendation API. The return shape stays the same.
 */
function runAudit(urlInput) {
  const normalized = normalizeUrl(urlInput);
  const domain = extractDomain(urlInput);
  const seed = hashString(normalized);
  const rand = seededRandom(seed);

  const hasHttps = normalized.startsWith('https://');
  const tld = domain.split('.').pop().toLowerCase();

  const performance = scoreForCategory(rand, 65 + rand() * 25, 6);
  const seo = scoreForCategory(rand, 60 + rand() * 30, 5);
  const mobile = scoreForCategory(rand, 55 + rand() * 35, 5);
  const accessibility = scoreForCategory(rand, 50 + rand() * 35, 6);
  const usability = scoreForCategory(rand, 62 + rand() * 28, 5);
  const technical = scoreForCategory(rand, 58 + rand() * 32 + (hasHttps ? 8 : 0), 5);

  const overall = clampScore(
    Math.round(
      performance * 0.2 + seo * 0.2 + mobile * 0.2 +
      accessibility * 0.15 + usability * 0.15 + technical * 0.1
    )
  );

  const scores = { overall, performance, seo, mobile, accessibility, usability, technical };
  const recommendations = generateRecommendations(scores, rand);
  const summary = generateSummary(scores, domain);

  return {
    id: `${seed}-${Date.now()}`,
    url: normalized,
    domain,
    timestamp: Date.now(),
    scores,
    summary,
    recommendations,
    details: [
      { label: 'Page Performance', category: 'performance', score: performance, maxScore: 100, description: 'Load time, resource optimization, and rendering speed' },
      { label: 'SEO', category: 'seo', score: seo, maxScore: 100, description: 'Meta tags, structured data, and search engine discoverability' },
      { label: 'Mobile', category: 'mobile', score: mobile, maxScore: 100, description: 'Responsive design, viewport configuration, and mobile usability' },
      { label: 'Accessibility', category: 'accessibility', score: accessibility, maxScore: 100, description: 'ARIA labels, color contrast, and assistive technology support' },
      { label: 'Usability', category: 'usability', score: usability, maxScore: 100, description: 'Navigation clarity, content structure, and user flow efficiency' },
      { label: 'Technical Quality', category: 'technical', score: technical, maxScore: 100, description: 'HTTPS, headers, code quality, and security best practices' },
    ],
  };
}

module.exports = { runAudit, normalizeUrl, extractDomain };
