import { AbstractGraph, Edge } from './abstract-graph';

export class WeightedEdge<T> extends Edge<T> {
  constructor(from: T, to: T, public readonly weight: number) {
    super(from, to);
  }
}

export type GetEdgeWeight<T> = (node: T, otherNode: T) => number;

export class WeightedGraph<T extends object> extends AbstractGraph<T, WeightedEdge<T>> {
  constructor(nodes: T[], private readonly getEdgeWeight: GetEdgeWeight<T>) {
    super(nodes);
  }

  protected createEdge(node: T, otherNode: T): WeightedEdge<T> {
    return new WeightedEdge<T>(node, otherNode, this.getEdgeWeight(node, otherNode));
  }
}
