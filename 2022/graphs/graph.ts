import { AbstractGraph, Edge } from './abstract-graph';

export class Graph<T extends object> extends AbstractGraph<T> {
  protected createEdge(node: T, otherNode: T): Edge<T> {
    return new Edge(node, otherNode);
  }
}
