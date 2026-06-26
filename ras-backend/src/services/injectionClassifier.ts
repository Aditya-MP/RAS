import logger from '../utils/logger';

export interface ClassifierResult {
  isInjection: boolean;
  confidence: number;
  injectionType: InjectionType | null;
  suspiciousParts: string[];
  semanticScore: number;
}

export type InjectionType =
  | 'system_override'
  | 'score_manipulation'
  | 'instruction_bypass'
  | 'candidate_boosting'
  | 'rule_override'
  | 'data_extraction';

interface InjectionPattern {
  type: InjectionType;
  patterns: RegExp[];
  weight: number;
  category: string;
}

const PATTERNS: InjectionPattern[] = [
  {
    type: 'system_override',
    weight: 0.9,
    category: 'system',
    patterns: [
      /system\s*instruction/i,
      /system\s*override/i,
      /ignore\s+(all\s+)?previous/i,
      /override\s+(all\s+)?previous/i,
      /forget\s+(all\s+)?previous/i,
      /disregard\s+(all\s+)?previous/i,
    ],
  },
  {
    type: 'score_manipulation',
    weight: 0.85,
    category: 'score',
    patterns: [
      /rate\s+this\s+(candidate|resume|application)/i,
      /score\s+(10|100)\s*\/\s*(10|100)/i,
      /set\s+(the\s+)?(candidate|applicant)\s*(_|\s)?score/i,
      /give\s+(him|her|them)\s+(a\s+)?(perfect|full|maximum)\s+score/i,
      /increase\s+(the\s+)?score/i,
    ],
  },
  {
    type: 'instruction_bypass',
    weight: 0.8,
    category: 'bypass',
    patterns: [
      /bypass\s+(all\s+)?(screens|filters|checks|security)/i,
      /ignore\s+(rules|security|policy)/i,
      /you\s+(must|should|need\s+to)\s+(ignore|bypass|override)/i,
      /this\s+is\s+(an?\s+)?(urgent|important)\s+(request|instruction)/i,
      /do\s+not\s+(follow|obey|adhere\s+to)/i,
    ],
  },
  {
    type: 'candidate_boosting',
    weight: 0.75,
    category: 'boosting',
    patterns: [
      /candidate.*(score|rating).*100/i,
      /mark\s+(this|the)\s+(candidate|applicant)\s+as/i,
      /consider\s+(this|the)\s+(candidate|applicant)\s+(as\s+)?(highly\s+)?(qualified|suitable)/i,
      /rank\s+(this|the)\s+(candidate|applicant)\s+(as\s+)?(top|first|best)/i,
      /select\s+(this|the)\s+(candidate|applicant)\s+for/i,
    ],
  },
  {
    type: 'rule_override',
    weight: 0.8,
    category: 'rule',
    patterns: [
      /ignore.*(rules|guidelines|instructions|policy)/i,
      /override\s+(rules|guidelines|instructions|policy)/i,
      /disregard\s+(rules|guidelines|instructions|policy)/i,
      /new\s+(rules|guidelines|instructions)/i,
      /updated\s+(rules|guidelines|instructions)/i,
    ],
  },
  {
    type: 'data_extraction',
    weight: 0.7,
    category: 'extraction',
    patterns: [
      /extract\s+(all\s+)?(data|information|details)/i,
      /send\s+(this|the)\s+(data|information)\s+(to|via)/i,
      /export\s+(all\s+)?(data|records|candidates)/i,
      /list\s+(all\s+)?(candidates|applicants|users)/i,
      /reveal\s+(all\s+)?(information|data|details)/i,
    ],
  },
];

const SEMANTIC_INDICATORS = [
  { word: 'ignore', weight: 0.3 },
  { word: 'override', weight: 0.35 },
  { word: 'bypass', weight: 0.35 },
  { word: 'forget', weight: 0.25 },
  { word: 'disregard', weight: 0.3 },
  { word: 'score', weight: 0.2 },
  { word: 'rating', weight: 0.2 },
  { word: 'perfect', weight: 0.2 },
  { word: 'maximum', weight: 0.15 },
  { word: 'instruction', weight: 0.2 },
  { word: 'system', weight: 0.2 },
  { word: 'override', weight: 0.35 },
  { word: 'candidate', weight: 0.1 },
  { word: 'applicant', weight: 0.1 },
  { word: 'hire', weight: 0.15 },
  { word: 'select', weight: 0.15 },
  { word: 'boost', weight: 0.25 },
];

export function classifyInjection(text: string): ClassifierResult {
  const suspiciousParts: string[] = [];
  let weightedScore = 0;
  let detectedType: InjectionType | null = null;
  let maxWeight = 0;

  // Pattern-based detection
  for (const group of PATTERNS) {
    for (const pattern of group.patterns) {
      const matches = text.match(new RegExp(pattern.source, 'gi'));
      if (matches) {
        suspiciousParts.push(...matches);
        weightedScore += group.weight * matches.length;
        if (group.weight > maxWeight) {
          maxWeight = group.weight;
          detectedType = group.type;
        }
      }
    }
  }

  // Semantic scoring
  const words = text.toLowerCase().split(/\s+/);
  let semanticScore = 0;
  for (const indicator of SEMANTIC_INDICATORS) {
    const count = words.filter(w => w.includes(indicator.word)).length;
    if (count > 0) {
      semanticScore += indicator.weight * Math.min(count, 3);
    }
  }
  semanticScore = Math.min(semanticScore / 5, 1.0);

  // Combined score
  const normalizedPatternScore = Math.min(weightedScore / 3, 1.0);
  const combinedScore = normalizedPatternScore * 0.6 + semanticScore * 0.4;

  // Confidence based on evidence strength
  const confidence = Math.min(
    (suspiciousParts.length > 0 ? 0.4 : 0) +
    (combinedScore > 0.3 ? 0.3 : 0) +
    (semanticScore > 0.4 ? 0.3 : 0),
    1.0
  );

  const isInjection = combinedScore > 0.3 && confidence > 0.4;

  return {
    isInjection,
    confidence: Math.round(confidence * 1000) / 1000,
    injectionType: detectedType,
    suspiciousParts: [...new Set(suspiciousParts)],
    semanticScore: Math.round(combinedScore * 1000) / 1000,
  };
}
