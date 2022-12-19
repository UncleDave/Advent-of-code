import { Edge } from './abstract-graph';
import { AbstractGridGraph, GridNode } from './abstract-grid-graph';

export class GridGraph<T extends GridNode = GridNode> extends AbstractGridGraph<T> {
  protected createEdge(node: T, otherNode: T): Edge<T> {
    return new Edge(node, otherNode);
  }
}
