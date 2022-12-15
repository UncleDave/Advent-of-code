export class Edge<T> {
  constructor(public readonly from: T, public readonly to: T) {
  }
}

export abstract class AbstractGraph<TNode extends object, TEdge extends Edge<TNode> = Edge<TNode>> {
  private outgoingEdges?: WeakMap<TNode, TEdge[]>;
  private incomingEdges?: WeakMap<TNode, TEdge[]>;

  protected constructor(protected readonly nodes: TNode[]) {
  }

  public initEdges() {
    const edges = this.nodes.flatMap(node => this.nodes.filter(otherNode => this.adjacent(node, otherNode)).map(otherNode => this.createEdge(node, otherNode)));

    this.outgoingEdges = new WeakMap(
      this.nodes.map(node => [
        node,
        edges.filter(edge => edge.from === node),
      ]),
    );

    this.incomingEdges = new WeakMap(
      this.nodes.map(node => [
        node,
        edges.filter(edge => edge.to === node),
      ]),
    );
  }

  public removeNode(node: TNode) {
    const nodeIndex = this.nodes.indexOf(node);

    if (nodeIndex === -1) return;

    this.edgesTo(node).forEach(edge => {
      const outgoingEdges = this.edgesFrom(edge.from);
      const edgeIndex = outgoingEdges.indexOf(edge);

      if (edgeIndex !== -1)
        outgoingEdges.splice(edgeIndex, 1);
    });

    this.outgoingEdges?.delete(node);
    this.incomingEdges?.delete(node);
    this.nodes.splice(nodeIndex, 1);
  }

  public edgesFrom(node: TNode): TEdge[] {
    return this.outgoingEdges?.get(node) ?? [];
  }

  public edgesTo(node: TNode): TEdge[] {
    return this.incomingEdges?.get(node) ?? [];
  }

  protected abstract createEdge(node: TNode, otherNode: TNode): TEdge;

  protected adjacent(node: TNode, otherNode: TNode): boolean {
    return node !== otherNode;
  }
}
