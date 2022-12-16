import { GetEdgeWeight, WeightedEdge } from './weighted-graph';
import { AbstractGridGraph, GridNode } from './abstract-grid-graph';

export class WeightedGridGraph<T extends GridNode = GridNode> extends AbstractGridGraph<T, WeightedEdge<T>> {
  constructor(nodes: T[], private readonly getEdgeWeight: GetEdgeWeight<T>, diagonalsAreAdjacent = false) {
    super(nodes, diagonalsAreAdjacent);
  }

  protected createEdge(node: T, otherNode: T): WeightedEdge<T> {
    return new WeightedEdge<T>(node, otherNode, this.getEdgeWeight(node, otherNode));
  }
}
