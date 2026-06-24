import { supabaseAdmin } from '../config/supabase';

const IMPORT_PATTERNS = [
  /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
  /import\s*\(.*?\)\s*from\s*['"]([^'"]+)['"]/g,
  /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  /from\s+['"]([^'"]+)['"]/g,
];

interface DependencyNode {
  filePath: string;
  dependencies: string[];
  authorId: string | null;
}

export interface ContributionScore {
  candidateId: string;
  score: number;
  rank: number;
  dependenciesProvided: number;
  dependenciesUsed: number;
}

const extractImports = (content: string): string[] => {
  const imports: string[] = [];
  for (const pattern of IMPORT_PATTERNS) {
    const re = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = re.exec(content)) !== null) {
      const p = match[1];
      if (p.startsWith('.') || p.startsWith('/')) {
        imports.push(p.replace(/\.(js|ts|jsx|tsx|py)$/, ''));
      }
    }
  }
  return [...new Set(imports)];
};

const buildDependencyGraph = async (teamId: string): Promise<Map<string, DependencyNode>> => {
  const { data: snapshots, error } = await supabaseAdmin
    .from('code_snapshots')
    .select('candidate_id, files')
    .eq('team_id', teamId)
    .order('snapshot_time', { ascending: true });

  if (error) throw new Error(error.message);
  if (!snapshots || snapshots.length === 0) throw new Error('No snapshots found for this team');

  // Latest snapshot per file wins
  const fileMap = new Map<string, { content: string; authorId: string }>();
  for (const snapshot of snapshots) {
    const files = snapshot.files || {};
    for (const [filePath, content] of Object.entries(files)) {
      fileMap.set(filePath, { content: content as string, authorId: snapshot.candidate_id });
    }
  }

  const nodes = new Map<string, DependencyNode>();
  for (const [filePath, { content, authorId }] of fileMap) {
    nodes.set(filePath, { filePath, dependencies: extractImports(content), authorId });
  }
  return nodes;
};

const computePageRank = (nodes: Map<string, DependencyNode>, iterations = 20, d = 0.85): Map<string, number> => {
  const ids = Array.from(nodes.keys());
  const n = ids.length;
  if (n === 0) return new Map();

  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();

  for (const [id, node] of nodes) {
    const resolved = node.dependencies
      .map(dep => ids.find(f => f.endsWith(dep) || dep.endsWith(f.replace(/\.(js|ts|jsx|tsx|py)$/, ''))) ?? null)
      .filter((d): d is string => d !== null && d !== id);
    outgoing.set(id, resolved);
    for (const dep of resolved) {
      if (!incoming.has(dep)) incoming.set(dep, []);
      incoming.get(dep)!.push(id);
    }
  }

  let scores = new Map<string, number>(ids.map(id => [id, 1 / n]));
  for (let i = 0; i < iterations; i++) {
    const next = new Map<string, number>();
    for (const id of ids) {
      let rank = (1 - d) / n;
      for (const nb of incoming.get(id) ?? []) {
        rank += d * (scores.get(nb) || 0) / (outgoing.get(nb)?.length || 1);
      }
      next.set(id, rank);
    }
    scores = next;
  }
  return scores;
};

export const getCandidateInfluenceScores = async (teamId: string): Promise<ContributionScore[]> => {
  const nodes = await buildDependencyGraph(teamId);
  const pageRank = computePageRank(nodes);

  const candidateData = new Map<string, { total: number; count: number }>();
  for (const [filePath, node] of nodes) {
    if (!node.authorId) continue;
    if (!candidateData.has(node.authorId)) candidateData.set(node.authorId, { total: 0, count: 0 });
    const d = candidateData.get(node.authorId)!;
    d.total += pageRank.get(filePath) || 0;
    d.count += 1;
  }

  const results: ContributionScore[] = [];
  for (const [candidateId, data] of candidateData) {
    let dependenciesProvided = 0;
    let dependenciesUsed = 0;
    for (const [filePath, node] of nodes) {
      if (node.authorId === candidateId) {
        for (const [otherPath, otherNode] of nodes) {
          if (otherPath === filePath || otherNode.authorId === candidateId) continue;
          if (otherNode.dependencies.some(d => filePath.endsWith(d) || d.endsWith(filePath.replace(/\.(js|ts|jsx|tsx|py)$/, '')))) {
            dependenciesProvided++;
          }
        }
        for (const dep of node.dependencies) {
          if ([...nodes.keys()].some(f => f !== filePath && (f.endsWith(dep) || dep.endsWith(f.replace(/\.(js|ts|jsx|tsx|py)$/, ''))))) {
            dependenciesUsed++;
          }
        }
      }
    }
    results.push({ candidateId, score: data.count > 0 ? data.total / data.count : 0, rank: 0, dependenciesProvided, dependenciesUsed });
  }

  results.sort((a, b) => b.score - a.score);
  results.forEach((r, i) => (r.rank = i + 1));
  return results;
};

export const storeInfluenceScores = async (teamId: string, scores: ContributionScore[]) => {
  for (const score of scores) {
    const { data: existing } = await supabaseAdmin
      .from('reports').select('report_json').eq('candidate_id', score.candidateId).eq('team_id', teamId).single();

    if (!existing) continue;

    const updated = { ...(existing.report_json || {}), influence_score: { score: score.score, rank: score.rank, dependencies_provided: score.dependenciesProvided, dependencies_used: score.dependenciesUsed } };
    await supabaseAdmin.from('reports').update({ report_json: updated, influence_score: score.score })
      .eq('candidate_id', score.candidateId).eq('team_id', teamId);
  }
};
