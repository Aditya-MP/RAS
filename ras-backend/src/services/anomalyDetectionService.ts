import logger from '../utils/logger';

export interface KeystrokeFeatures {
  dwellTimes: number[];
  flightTimes: number[];
  pasteEvents: number;
  totalEvents: number;
  focusLossCount?: number;
  focusLossDuration?: number;
  domInjections?: number;
  virtualMachineHash?: boolean;
}

export interface AnomalyResult {
  isAnomaly: boolean;
  anomalyScore: number;
  integrityScore: number;
  confidence: number;
  details: {
    dwellStdDev: number;
    flightStdDev: number;
    flightIqr: number;
    pasteRatio: number;
    burstScore: number;
    focusLossScore: number;
    domInjectionScore: number;
    vmScore: number;
  };
}

const HUMAN_DWELL_MEAN = 80;
const HUMAN_DWELL_STD = 40;
const HUMAN_FLIGHT_MEAN = 200;
const HUMAN_FLIGHT_STD = 100;

export class IsolationForestDetector {
  private trees: Array<{ splitAttr: number; splitVal: number; left: any; right: any; size: number }> = [];
  private trained = false;

  public train(samples: number[][]): void {
    this.trees = [];
    const numTrees = 100;
    const sampleSize = Math.min(256, samples.length);

    for (let t = 0; t < numTrees; t++) {
      const shuffled = [...samples].sort(() => Math.random() - 0.5).slice(0, sampleSize);
      const tree = this.buildTree(shuffled, 0, 8);
      this.trees.push(tree);
    }
    this.trained = true;
  }

  private buildTree(data: number[][], depth: number, maxDepth: number): any {
    if (data.length <= 1 || depth >= maxDepth) {
      return { size: data.length };
    }

    const numAttrs = data[0].length;
    const splitAttr = Math.floor(Math.random() * numAttrs);
    const attrValues = data.map(d => d[splitAttr]);
    const minVal = Math.min(...attrValues);
    const maxVal = Math.max(...attrValues);

    if (minVal === maxVal) {
      return { size: data.length };
    }

    const splitVal = minVal + Math.random() * (maxVal - minVal);
    const leftData = data.filter(d => d[splitAttr] < splitVal);
    const rightData = data.filter(d => d[splitAttr] >= splitVal);

    return {
      splitAttr,
      splitVal,
      left: this.buildTree(leftData, depth + 1, maxDepth),
      right: this.buildTree(rightData, depth + 1, maxDepth),
      size: data.length,
    };
  }

  public predictPathLength(sample: number[]): number {
    if (!this.trained || this.trees.length === 0) return 0;

    let totalPathLength = 0;
    for (const tree of this.trees) {
      totalPathLength += this.traverseTree(tree, sample, 0);
    }
    return totalPathLength / this.trees.length;
  }

  private traverseTree(node: any, sample: number[], depth: number): number {
    if (node.left === undefined && node.right === undefined) {
      return depth + this.cFactor(node.size);
    }
    if (node.splitAttr === undefined) {
      return depth + this.cFactor(node.size);
    }
    if (sample[node.splitAttr] < node.splitVal) {
      return this.traverseTree(node.left, sample, depth + 1);
    }
    return this.traverseTree(node.right, sample, depth + 1);
  }

  private cFactor(n: number): number {
    if (n <= 1) return 0;
    const h = Math.log(n - 1) + 0.5772156649;
    return 2 * h - (2 * (n - 1) / n);
  }
}

function stats(arr: number[]): { mean: number; std: number; median: number; q1: number; q3: number } {
  if (arr.length === 0) return { mean: 0, std: 0, median: 0, q1: 0, q3: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  return { mean, std: Math.sqrt(variance), median, q1, q3 };
}

export function analyzeKeystrokeAnomaly(features: KeystrokeFeatures): AnomalyResult {
  const { 
    dwellTimes, 
    flightTimes, 
    pasteEvents, 
    totalEvents,
    focusLossCount = 0,
    focusLossDuration = 0,
    domInjections = 0,
    virtualMachineHash = false
  } = features;

  const dwellStats = stats(dwellTimes);
  const flightStats = stats(flightTimes);

  // Dwell time anomaly: human average ~80ms, std ~40ms
  const dwellZScore = dwellStats.mean > 0
    ? Math.abs(dwellStats.mean - HUMAN_DWELL_MEAN) / Math.max(HUMAN_DWELL_STD, dwellStats.std)
    : 0;

  // Flight time anomaly: human average ~200ms, std ~100ms
  const flightZScore = flightStats.mean > 0
    ? Math.abs(flightStats.mean - HUMAN_FLIGHT_MEAN) / Math.max(HUMAN_FLIGHT_STD, flightStats.std)
    : 0;

  // Flight time IQR: unusually consistent or erratic
  const flightIqr = flightStats.q3 - flightStats.q1;
  const iqrScore = flightTimes.length > 5
    ? Math.min(Math.abs(flightIqr - 150) / 150, 2)
    : 0;

  // Paste detection
  const pasteRatio = totalEvents > 0 ? pasteEvents / totalEvents : 0;
  const pasteScore = pasteRatio > 0.3 ? 1.0 : pasteRatio > 0.1 ? 0.5 : 0;

  // Burst detection: look for very fast consecutive keystrokes (script injection)
  const burstScore = flightTimes.length > 5
    ? flightTimes.filter(t => t < 20).length / flightTimes.length
    : 0;

  // Web-native focus loss penalty (Visibility API)
  // Graded penalty: 5% per switch + linear scaling up to 5 minutes total hidden time
  const focusLossScore = Math.min(focusLossCount * 0.05 + focusLossDuration / 300000, 1.0);

  // DOM Injection Overlay check (Extension detection)
  const domInjectionScore = domInjections > 0 ? 1.0 : 0.0;

  // VM Detection (Canvas/WebGL hardware drivers)
  const vmScore = virtualMachineHash ? 1.0 : 0.0;

  // Combined baseline anomaly score (0-1) including focus loss as a 25% weight component
  let anomalyScore = Math.min(
    dwellZScore * 0.15 +
    flightZScore * 0.20 +
    iqrScore * 0.10 +
    pasteScore * 0.15 +
    burstScore * 0.15 +
    focusLossScore * 0.25,
    1.0
  );

  // Calculate integrity score (inverse of anomaly)
  let integrityScore = Math.max(1.0 - anomalyScore * 1.2, 0);

  // Apply multipliers for structural security violations
  if (domInjectionScore > 0) {
    integrityScore *= 0.5; // 50% penalty for AI extension DOM overlays
  }
  if (vmScore > 0) {
    integrityScore *= 0.3; // 70% penalty for Virtual Machines (VirtualBox, VMware, etc.)
  }

  // Confidence based on data volume
  const confidence = Math.min(
    (dwellTimes.length > 20 ? 0.3 : 0) +
    (flightTimes.length > 20 ? 0.3 : 0) +
    (totalEvents > 50 ? 0.4 : totalEvents > 20 ? 0.2 : 0),
    1.0
  );

  const isAnomaly = anomalyScore > 0.5 && confidence > 0.5;

  return {
    isAnomaly,
    anomalyScore: Math.round(anomalyScore * 1000) / 1000,
    integrityScore: Math.round(integrityScore * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    details: {
      dwellStdDev: Math.round(dwellStats.std * 100) / 100,
      flightStdDev: Math.round(flightStats.std * 100) / 100,
      flightIqr: Math.round(flightIqr * 100) / 100,
      pasteRatio: Math.round(pasteRatio * 1000) / 1000,
      burstScore: Math.round(burstScore * 1000) / 1000,
      focusLossScore: Math.round(focusLossScore * 1000) / 1000,
      domInjectionScore: Math.round(domInjectionScore * 1000) / 1000,
      vmScore: Math.round(vmScore * 1000) / 1000,
    },
  };
}
