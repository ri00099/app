import type { ScoreCategory } from './types';

export function scoreColor(score: number): string {
  if (score >= 80) return '#16a34a';
  if (score >= 50) return '#eab308';
  return '#dc2626';
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  return 'Poor';
}

export function scoreBgClass(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function scoreTextClass(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function scoreRingClass(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

export function priorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function categoryLabel(category: ScoreCategory): string {
  const labels: Record<ScoreCategory, string> = {
    performance: 'Performance',
    seo: 'SEO',
    mobile: 'Mobile Experience',
    accessibility: 'Accessibility',
    usability: 'Usability',
    technical: 'Technical Quality',
  };
  return labels[category];
}

export function categoryIcon(category: ScoreCategory): string {
  const icons: Record<ScoreCategory, string> = {
    performance: 'Gauge',
    seo: 'Search',
    mobile: 'Smartphone',
    accessibility: 'Accessibility',
    usability: 'MousePointerClick',
    technical: 'Server',
  };
  return icons[category];
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}
