import { GetEdgeWeight } from './weighted-graph';
import { WeightedGridGraph } from './weighted-grid-graph';
import { GridNode } from './abstract-grid-graph';

export class DirectedAcyclicWeightedGridGraph<T extends GridNode = GridNode> extends WeightedGridGraph<T> {
  constructor(nodes: T[], getEdgeWeight: GetEdgeWeight<T>, private readonly endY: number) {
    super(nodes, getEdgeWeight, true);
  }

  protected adjacent(node: T, otherNode: T): boolean {
    return super.adjacent(node, otherNode) && node.position.y - this.endY < otherNode.position.y - this.endY;
  }
}
