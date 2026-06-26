import { ChallengeWorkspace, getWorkspaceLibrary } from './challengeStore';
import logger from '../utils/logger';

export class TFIDFVectorizer {
  private idfCache: Map<string, number> = new Map();
  private docCount = 0;

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s#]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOP_WORDS.has(t));
  }

  private buildIdf(documents: string[][]): void {
    this.docCount = documents.length;
    const df = new Map<string, number>();

    for (const tokens of documents) {
      const unique = new Set(tokens);
      for (const token of unique) {
        df.set(token, (df.get(token) || 0) + 1);
      }
    }

    for (const [token, count] of df) {
      this.idfCache.set(token, Math.log((this.docCount + 1) / (count + 1)) + 1);
    }
  }

  public fit(documents: string[]): void {
    const tokenized = documents.map(d => this.tokenize(d));
    this.buildIdf(tokenized);
  }

  public transform(text: string): Map<string, number> {
    const tokens = this.tokenize(text);
    const tf = new Map<string, number>();
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }
    const maxFreq = Math.max(...tf.values(), 1);

    const vector = new Map<string, number>();
    for (const [token, count] of tf) {
      const tfNorm = count / maxFreq;
      const idf = this.idfCache.get(token) || Math.log((this.docCount + 1) / 1) + 1;
      vector.set(token, tfNorm * idf);
    }
    return vector;
  }

  public cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const [key, val] of a) {
      normA += val * val;
      const bVal = b.get(key) || 0;
      dotProduct += val * bVal;
    }
    for (const val of b.values()) {
      normB += val * val;
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dotProduct / denom;
  }
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could',
  'may', 'might', 'shall', 'should', 'to', 'of', 'in', 'for', 'on', 'with',
  'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'this', 'that', 'these', 'those', 'it', 'its',
  'and', 'but', 'or', 'nor', 'not', 'no', 'so', 'yet', 'if', 'then', 'else',
  'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'only', 'own', 'same', 'too', 'very',
  'just', 'also', 'about', 'than', 'once', 'here', 'there', 'which', 'who',
  'whom', 'what', 'build', 'using', 'use', 'based', 'make', 'need'
]);

export interface SearchResult {
  workspace: ChallengeWorkspace;
  score: number;
}

export class ChallengeSearchEngine {
  private vectorizer: TFIDFVectorizer;
  private vectors: Map<string, Map<string, number>> = new Map();
  private ready = false;

  constructor() {
    this.vectorizer = new TFIDFVectorizer();
  }

  public initialize(): void {
    const library = getWorkspaceLibrary();
    const documents = library.map(w => {
      const content = [
        w.title,
        w.description,
        w.track,
        w.seniority,
        ...w.tags,
        ...Object.values(w.files).map(f => f.substring(0, 500))
      ].join(' ');
      return content;
    });

    this.vectorizer.fit(documents);

    for (let i = 0; i < library.length; i++) {
      this.vectors.set(library[i].id, this.vectorizer.transform(documents[i]));
    }

    this.ready = true;
    logger.info(`ChallengeSearchEngine initialized with ${library.length} workspaces`);
  }

  public search(
    query: string,
    track?: string,
    seniority?: string,
    topK: number = 5
  ): SearchResult[] {
    if (!this.ready) {
      this.initialize();
    }

    const queryVector = this.vectorizer.transform(query);
    const library = getWorkspaceLibrary();

    const scored = library
      .filter(w => {
        if (track && w.track !== track.toLowerCase()) return false;
        if (seniority && w.seniority !== seniority.toLowerCase()) return false;
        return true;
      })
      .map(workspace => {
        const docVector = this.vectors.get(workspace.id);
        if (!docVector) return { workspace, score: 0 };

        let score = this.vectorizer.cosineSimilarity(queryVector, docVector);

        // Boost by tag overlap
        const queryTerms = query.toLowerCase().split(/\s+/);
        const tagMatches = workspace.tags.filter(t =>
          queryTerms.some(qt => t.toLowerCase().includes(qt) || qt.includes(t.toLowerCase()))
        ).length;
        score += tagMatches * 0.05;

        // Boost by title match
        if (queryTerms.some(qt => workspace.title.toLowerCase().includes(qt))) {
          score += 0.1;
        }

        return { workspace, score: Math.min(score, 1.0) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }
}

export const challengeSearch = new ChallengeSearchEngine();

export function computeTFIDFSimilarity(textA: string, textB: string): number {
  const vectorizer = new TFIDFVectorizer();
  vectorizer.fit([textA, textB]);
  const vecA = vectorizer.transform(textA);
  const vecB = vectorizer.transform(textB);
  return vectorizer.cosineSimilarity(vecA, vecB);
}
