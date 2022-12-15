import { GridNode, GridPosition } from './grid-graph';
import { GetEdgeWeight, WeightedGraph } from './weighted-graph';

export class WeightedGridGraph<T extends GridNode = GridNode> extends WeightedGraph<T> {
  constructor(nodes: T[], getEdgeWeight: GetEdgeWeight<T>, private readonly diagonalsAreAdjacent = false) {
    super(nodes, getEdgeWeight);
  }

  public node(position: GridPosition): T | undefined {
    return this.nodes.find(node => node.position.equals(position));
  }

  protected adjacent(node: T, otherNode: T): boolean {
    const distance = node.distance(otherNode);
    const distanceToCompare = this.diagonalsAreAdjacent ? Math.max(distance.x, distance.y) : distance.sum;

    return distanceToCompare === 1;
  }
}
