interface Scores {
  overall: number;
  performance: number;
  seo: number;
  mobile: number;
  accessibility: number;
  usability: number;
  technical: number;
}

function scoreTier(score: number): string {
  if (score >= 80) return 'strong';
  if (score >= 50) return 'moderate';
  return 'weak';
}

export function generateSummary(scores: Scores, domain: string): string {
  const categories: Array<{ name: string; score: number }> = [
    { name: 'performance', score: scores.performance },
    { name: 'SEO', score: scores.seo },
    { name: 'mobile experience', score: scores.mobile },
    { name: 'accessibility', score: scores.accessibility },
    { name: 'usability', score: scores.usability },
    { name: 'technical quality', score: scores.technical },
  ];

  const sorted = [...categories].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const secondWeakest = sorted[1];
  const strongest = sorted[sorted.length - 1];

  const parts: string[] = [];

  if (scores.overall >= 80) {
    parts.push(
      `The website "${domain}" has a strong overall health score of ${scores.overall}/100, indicating a well-maintained site with good practices across most areas.`,
    );
  } else if (scores.overall >= 50) {
    parts.push(
      `The website "${domain}" has a moderate overall health score of ${scores.overall}/100, meaning it performs adequately but has clear opportunities for improvement.`,
    );
  } else {
    parts.push(
      `The website "${domain}" has a low overall health score of ${scores.overall}/100, signaling significant issues that should be addressed to provide a better user experience.`,
    );
  }

  if (scoreTier(weakest.score) === 'weak' || scoreTier(weakest.score) === 'moderate') {
    const priority = weakest.score < 50 ? 'highest priority' : 'important area to address';
    parts.push(
      `The weakest area is ${weakest.name} (${weakest.score}/100), which should be the ${priority}.`,
    );
  }

  if (
    secondWeakest &&
    (scoreTier(secondWeakest.score) === 'weak' || scoreTier(secondWeakest.score) === 'moderate') &&
    secondWeakest.name !== strongest.name
  ) {
    parts.push(
      `${capitalize(secondWeakest.name)} also needs attention at ${secondWeakest.score}/100.`,
    );
  }

  if (scoreTier(strongest.score) === 'strong') {
    parts.push(
      `The strongest area is ${strongest.name} at ${strongest.score}/100, which is well-optimized.`,
    );
  }

  const actionable: string[] = [];
  if (scores.performance < 70) {
    actionable.push('reducing image sizes and deferring render-blocking scripts');
  }
  if (scores.mobile < 70) {
    actionable.push('improving mobile navigation and tap target sizing');
  }
  if (scores.seo < 70) {
    actionable.push('optimizing meta tags and adding structured data');
  }
  if (scores.accessibility < 70) {
    actionable.push('adding alt text and improving color contrast');
  }
  if (scores.technical < 70) {
    actionable.push('configuring security headers and ensuring HTTPS');
  }

  if (actionable.length > 0) {
    const actionList = actionable.length === 1
      ? actionable[0]
      : actionable.slice(0, -1).join(', ') + ' and ' + actionable[actionable.length - 1];
    parts.push(`The highest-impact actions are ${actionList}.`);
  }

  return parts.join(' ');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
