import { GridNode } from './grid-graph';
import { GetEdgeWeight, WeightedGraph } from './weighted-graph';

export class WeightedGridGraph<T extends GridNode = GridNode> extends WeightedGraph<T> {
  constructor(nodes: T[], getEdgeWeight: GetEdgeWeight<T>) {
    super(nodes, getEdgeWeight);
  }

  protected adjacent(node: T, otherNode: T): boolean {
    return node.distance(otherNode) === 1;
  }
}
