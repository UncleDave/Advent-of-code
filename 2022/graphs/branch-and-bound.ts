import { BinaryHeap } from './binary-heap';

export class CombinationCandidateSolutionTree<T> implements CandidateSolutionTree<T[], CombinationCandidateSolutionTree<T>> {
  constructor(public readonly current: T, public readonly remainingOptions: T[], public readonly lockedSet: T[] = []) {
  }

  candidate(): T[] {
    return [...this.lockedSet, this.current];
  }

  candidates(): CombinationCandidateSolutionTree<T>[] {
    return this.remainingOptions.map(
      x => new CombinationCandidateSolutionTree(
        x,
        this.remainingOptions.filter(xx => xx !== x),
        this.candidate(),
      ),
    );
  }

  isSingleCandidate(): boolean {
    return this.remainingOptions.length === 0;
  }

  preference(): number {
    return this.lockedSet.length;
  }
}

export interface CandidateSolutionTree<T, ST extends CandidateSolutionTree<T, ST>> {
  candidate(): T;

  candidates(): ST[];

  isSingleCandidate(): boolean;

  preference(): number;
}

interface BoundedCandidateSolutionTree<T, ST extends CandidateSolutionTree<T, ST>> {
  candidateSolutionTree: ST;
  upperBound: number;
}

export function maximise<T, ST extends CandidateSolutionTree<T, ST>>(
  initialCandidates: ST[],
  heuristicSolution: T,
  solutionValue: (solution: T) => number,
  upperBoundValue: (solution: ST) => number,
): T {
  const boundedInitialCandidates = initialCandidates.map<BoundedCandidateSolutionTree<T, ST>>(x => ({
      candidateSolutionTree: x,
      upperBound: upperBoundValue(x),
    }),
  );

  const candidateQueue = new BinaryHeap(
    ((a, b) => {
      const boundDiff = b.upperBound - a.upperBound;
      return boundDiff === 0 ? b.candidateSolutionTree.preference() - a.candidateSolutionTree.preference() : boundDiff;
    }),
    boundedInitialCandidates,
  );

  let lowerBound = solutionValue(heuristicSolution);
  let currentBest = heuristicSolution;

  while (candidateQueue.peek()) {
    const { candidateSolutionTree, upperBound } = candidateQueue.pop()!;

    if (upperBound <= lowerBound) continue;

    if (candidateSolutionTree.isSingleCandidate()) {
      const candidate = candidateSolutionTree.candidate();
      const candidateScore = solutionValue(candidate);

      if (candidateScore > lowerBound) {
        currentBest = candidate;
        lowerBound = candidateScore;
      }
    } else {
      candidateSolutionTree.candidates().forEach(newCandidateSolutionTree => {
        const candidateUpperBound = upperBoundValue(newCandidateSolutionTree);

        if (candidateUpperBound > lowerBound) {
          candidateQueue.push({
            candidateSolutionTree: newCandidateSolutionTree,
            upperBound: candidateUpperBound,
          });
        }
      });
    }
  }

  return currentBest;
}
