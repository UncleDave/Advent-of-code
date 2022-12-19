export class Edge<T> {
  constructor(public readonly from: T, public readonly to: T) {
  }
}

export abstract class AbstractGraph<TNode extends object, TEdge extends Edge<TNode> = Edge<TNode>> {
  private readonly _nodes: TNode[];
  private outgoingEdges?: WeakMap<TNode, TEdge[]>;
  private incomingEdges?: WeakMap<TNode, TEdge[]>;

  constructor(nodes: TNode[]) {
    this._nodes = nodes;
  }

  public get nodes(): ReadonlyArray<TNode> {
    return this._nodes;
  }

  public initEdges(): void;
  public initEdges(edges: TEdge[]): void;
  public initEdges(edges?: TEdge[]) {
    // Typescript is sus and won't narrow "edges ??= ..."
    const notUndefinedEdges = edges ?? this._nodes.flatMap(node => this._nodes.filter(otherNode => this.adjacent(node, otherNode)).map(otherNode => this.createEdge(node, otherNode)));

    this.outgoingEdges = new WeakMap(
      this._nodes.map(node => [
        node,
        notUndefinedEdges.filter(edge => edge.from === node),
      ]),
    );

    this.incomingEdges = new WeakMap(
      this._nodes.map(node => [
        node,
        notUndefinedEdges.filter(edge => edge.to === node),
      ]),
    );
  }

  public removeNode(node: TNode) {
    const nodeIndex = this._nodes.indexOf(node);

    if (nodeIndex === -1) return;

    this.edgesTo(node).forEach(edge => {
      const outgoingEdges = this.edgesFrom(edge.from);
      const edgeIndex = outgoingEdges.indexOf(edge);

      if (edgeIndex !== -1)
        outgoingEdges.splice(edgeIndex, 1);
    });

    this.outgoingEdges?.delete(node);
    this.incomingEdges?.delete(node);
    this._nodes.splice(nodeIndex, 1);
  }

  public edge(node: TNode, otherNode: TNode): TEdge | undefined {
    return this.edgesFrom(node).find(x => x.to === otherNode);
  }

  public edgesFrom(node: TNode): TEdge[] {
    return this.outgoingEdges?.get(node) ?? [];
  }

  public edgesTo(node: TNode): TEdge[] {
    return this.incomingEdges?.get(node) ?? [];
  }

  public addEdges(edges: TEdge[]) {
    edges.forEach(edge => this.addEdge(edge));
  }

  public addEdge(edge: TEdge) {
    const fromNodeEdges = this.outgoingEdges?.get(edge.from);

    if (fromNodeEdges)
      fromNodeEdges.push(edge);
    else
      this.outgoingEdges?.set(edge.from, [edge]);

    const toNodeEdges = this.incomingEdges?.get(edge.to);

    if (toNodeEdges)
      toNodeEdges.push(edge);
    else
      this.incomingEdges?.set(edge.to, [edge]);
  }

  public adjacent(node: TNode, otherNode: TNode): boolean {
    return node !== otherNode;
  }

  protected abstract createEdge(node: TNode, otherNode: TNode): TEdge;
}
