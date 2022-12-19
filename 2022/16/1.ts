import { mapReduceSum, permute, readFileAsString } from '../utils';
import { WeightedEdge, WeightedGraph } from '../graphs/weighted-graph';
import { shortestPathBetween } from '../graphs/breadth-first-search';
import { CombinationCandidateSolutionTree, maximise } from '../graphs/branch-and-bound';

class Valve {
  constructor(public readonly name: string, public readonly flowRate: number) {
  }

  potentialPressureRelease(steps: number): number {
    return this.flowRate * steps;
  }

  normalisePotentialPressureRelease(steps: number, stepsToOpen: number) {
    return this.potentialPressureRelease(steps - stepsToOpen) / stepsToOpen;
  }
}

function pathWeight<T>(path: WeightedEdge<T>[]): number {
  return path.reduce(mapReduceSum(edge => edge.weight), 0);
}

const inputRegex = /(?<valve>[A-Z]{2}).+=(?<flow>\d+).+?(?<connected>(?:[A-Z]{2}(?:, )*)+)/g;

(async function () {
  const input = await readFileAsString('input.txt');

  const valvesInput = Array.from(input.matchAll(inputRegex)).map(match => ({
    valve: new Valve(match.groups!.valve, Number(match.groups!.flow)),
    connectedValves: match.groups!.connected.split(', '),
  }));

  const graph = new WeightedGraph(valvesInput.map(x => x.valve));
  const moveCost = 1;

  graph.initEdges(
    valvesInput.flatMap(
      ({ connectedValves, valve }) =>
        connectedValves.map(otherValve => new WeightedEdge(valve, valvesInput.find(x => x.valve.name === otherValve)!.valve, moveCost)),
    ),
  );

  graph.addEdges(graph.nodes.flatMap(node =>
    graph.nodes
      .filter(otherNode => graph.adjacent(node, otherNode) && !graph.edge(node, otherNode))
      .map(otherNode => {
        const bestPath = shortestPathBetween(graph, node, otherNode);
        return new WeightedEdge(node, otherNode, moveCost * bestPath.length);
      }),
  ));

  const maxSteps = 30;
  const openCost = 1;
  const valvesWithFlowRate = graph.nodes.filter(node => node.flowRate);
  const startValve = graph.nodes.find(x => x.name === 'AA')!;

  function mostReleasablePressureForSequence(nodeSequence: Valve[], node = startValve, remainingSteps = maxSteps): number {
    let pressureReleased = 0;

    while (remainingSteps > 0 && nodeSequence.length) {
      const nextNode = nodeSequence.shift()!;
      const path = shortestPathBetween(graph, node, nextNode);
      const totalCost = pathWeight(path) + openCost;

      if (totalCost >= remainingSteps) break;

      node = nextNode;
      remainingSteps -= totalCost;
      pressureReleased += node.potentialPressureRelease(remainingSteps);
    }

    return pressureReleased;
  }

  function orderSequenceByNormalisedPotentialPressureRelease(nodeSequence: Valve[], node = startValve, remainingSteps = maxSteps): Valve[] {
    const orderedNodes: Valve[] = [];

    while (remainingSteps > 0 && nodeSequence.length) {
      nodeSequence.sort((a, b) =>
          b.normalisePotentialPressureRelease(
            remainingSteps,
            pathWeight(shortestPathBetween(graph, node, b)) + openCost,
          ) - a.normalisePotentialPressureRelease(
            remainingSteps,
            pathWeight(shortestPathBetween(graph, node, a)) + openCost,
          ),
      );

      const nextNode = nodeSequence.shift()!;
      const path = shortestPathBetween(graph, node, nextNode);
      const totalCost = pathWeight(path) + openCost;

      if (totalCost >= remainingSteps) continue;

      node = nextNode;
      remainingSteps -= totalCost;
      orderedNodes.push(node);
    }

    return orderedNodes;
  }

  function sequenceStepCost(nodeSequence: Valve[]): number {
    return nodeSequence.reduce((total, valve, i, valves) => {
      const previousValve = valves[i - 1] ?? startValve;
      const path = shortestPathBetween(graph, previousValve, valve);

      return total + pathWeight(path) + openCost;
    }, 0);
  }

  const bestSequence = maximise(
    valvesWithFlowRate.map(valve => new CombinationCandidateSolutionTree(
      valve,
      valvesWithFlowRate.filter(otherValve => valve !== otherValve),
    )),
    orderSequenceByNormalisedPotentialPressureRelease([...valvesWithFlowRate]),
    potentialSolution => mostReleasablePressureForSequence([...potentialSolution]),
    potentialSolution => {
      const fixedSequence = potentialSolution.candidate();
      const fixedSequencePressureReleased = mostReleasablePressureForSequence([...fixedSequence]);
      const fixedSequenceStepCost = sequenceStepCost(fixedSequence);
      const remainingSteps = maxSteps - fixedSequenceStepCost;
      const lastFixedValve = fixedSequence.at(-1)!;

      if (potentialSolution.remainingOptions.length > 5) {
        return potentialSolution.remainingOptions
          .filter(x => pathWeight(shortestPathBetween(graph, lastFixedValve, x)) + openCost < remainingSteps)
          .reduce(
            (total, valve) => total + valve.potentialPressureRelease(remainingSteps) - pathWeight(shortestPathBetween(graph, lastFixedValve, valve)) + openCost,
            fixedSequencePressureReleased,
          );
      }

      return Math.max(
        ...Array
          .from(permute(potentialSolution.remainingOptions))
          .map(permutation => mostReleasablePressureForSequence(permutation, lastFixedValve, remainingSteps)),
      ) + fixedSequencePressureReleased;
    },
  );

  console.log('Best sequence to open:', bestSequence.map(x => x.name).join(' -> '));
  console.log('Pressure released:', mostReleasablePressureForSequence(bestSequence));
})();

// MO
// JB
// BA
// UW
// VS
// IK
// EU
// OA
// NC
// YB
// VI
// KQ
// WU
// IE
// UQ
// KF
// XY
// MJ
// KJ
// VC
// SO
// NW
// SZ
// KU
// QL
// JF
// KD
// ED
// SX
// GD
// ZU
// HN
// DN
// TZ
// RY
// MH
// FF
// NK
// HR
// PG
// PN
// UX
// WZ
// DG
// XM
// UL
// AA
// GA
// PW
// NQ
// SA
// QW
// SK
// YQ
// ZT
// QM
// NT
// JK
// SL
// WI
// EO
// DW
// DX
// RZ
// TY
// ZZ
// MO QM
// MO ED
// JB MH
// JB ZU
// BA XY
// BA FF
// UW EU
// UW SX
// VS MH
// VS QW
// IK KF
// IK SK
// EU DX
// EU UW
// EU RY
// EU NC
// OA SX
// OA FF
// NC ZZ
// NC EU
// YB EO
// YB KF
// VI FF
// VI KF
// KQ TZ
// KQ QL
// WU NT
// WU NW
// IE UQ
// IE ZU
// UQ IE
// UQ VC
// KF YB
// KF RZ
// KF IK
// KF PG
// KF VI
// XY WZ
// XY DG
// XY BA
// XY ZZ
// XY PN
// MJ SX
// MJ PN
// KJ QW
// KJ ZU
// VC UQ
// VC HN
// SO NW
// SO PW
// NW TY
// NW WI
// NW ED
// NW SO
// NW WU
// SZ YQ
// SZ FF
// KU WI
// KU MH
// QL KQ
// QL DW
// QL DX
// JF NK
// JF NT
// KD JK
// KD NQ
// ED NW
// ED MO
// SX JK
// SX MJ
// SX OA
// SX UW
// GD ZT
// GD NT
// ZU KJ
// ZU JB
// ZU DN
// ZU IE
// HN QW
// HN VC
// DN UX
// DN ZU
// TZ KQ
// RY EU
// RY UL
// MH KU
// MH JB
// MH VS
// MH NK
// MH GA
// FF UL
// FF SZ
// FF OA
// FF VI
// FF BA
// NK MH
// NK JF
// HR AA
// HR SA
// PG KF
// PG TY
// PN XY
// PN MJ
// UX DN
// UX NT
// WZ NQ
// WZ XY
// DG SL
// DG XY
// XM AA
// XM GA
// UL FF
// UL RY
// AA PW
// AA ZT
// AA XM
// AA SK
// AA HR
// GA MH
// GA XM
// PW SO
// PW AA
// NQ YQ
// NQ WZ
// NQ KD
// SA HR
// SA QM
// QW KJ
// QW HN
// QW VS
// SK IK
// SK AA
// YQ SZ
// YQ NQ
// ZT GD
// ZT AA
// QM SL
// QM SA
// QM EO
// QM DW
// QM MO
// NT WU
// NT UX
// NT RZ
// NT JF
// NT GD
// JK SX
// JK KD
// SL DG
// SL QM
// WI KU
// WI NW
// EO QM
// EO YB
// DW QM
// DW QL
// DX EU
// DX QL
// RZ NT
// RZ KF
// TY NW
// TY PG
// ZZ XY
// ZZ NC
