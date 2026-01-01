/**
 * Shared utility functions for document scoring and relevance calculation
 */

/**
 * Calculate Jaccard similarity for themes (weighted: L1=0.8, L0=0.2)
 */
export function calculateThemeJaccard(
  queryThemesL1: string[],
  queryThemesL0: string[],
  docThemesL1: string[],
  docThemesL0: string[]
): number {
  const l1Intersection = new Set(queryThemesL1.filter(t => docThemesL1.includes(t)));
  const l1Union = new Set([...queryThemesL1, ...docThemesL1]);
  const l1Jaccard = l1Union.size > 0 ? l1Intersection.size / l1Union.size : 0;

  const l0Intersection = new Set(queryThemesL0.filter(t => docThemesL0.includes(t)));
  const l0Union = new Set([...queryThemesL0, ...docThemesL0]);
  const l0Jaccard = l0Union.size > 0 ? l0Intersection.size / l0Union.size : 0;

  return 0.8 * l1Jaccard + 0.2 * l0Jaccard;
}

/**
 * Calculate Jaccard similarity for keywords or authors
 */
export function calculateSetJaccard(set1: string[], set2: string[]): number {
  if (set1.length === 0 && set2.length === 0) return 0;
  
  const intersection = new Set(set1.filter(item => set2.includes(item)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Calculate overall relevance score combining themes, keywords, and authors
 */
export function calculateRelevanceScore(
  themeScore: number,
  keywordScore: number,
  authorScore: number,
  hasThemes: boolean,
  hasKeywords: boolean,
  hasAuthors: boolean
): number {
  // Weight: themes = 0.6, keywords = 0.25, authors = 0.15
  // Only include scores for criteria that were provided
  let totalWeight = 0;
  let weightedSum = 0;

  if (hasThemes) {
    weightedSum += 0.6 * themeScore;
    totalWeight += 0.6;
  }
  if (hasKeywords) {
    weightedSum += 0.25 * keywordScore;
    totalWeight += 0.25;
  }
  if (hasAuthors) {
    weightedSum += 0.15 * authorScore;
    totalWeight += 0.15;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Get similarity level label based on score
 * HIGH: >= 0.35 (35%)
 * MODERATE: >= 0.20 (20%)
 * LOW: < 0.20 (< 20%)
 */
export function getSimilarityLevel(score: number): 'High' | 'Moderate' | 'Low' {
  if (score >= 0.35) return 'High';
  if (score >= 0.20) return 'Moderate';
  return 'Low';
}

