export class Edge<T> {
  constructor(public readonly from: T, public readonly to: T) {
  }
}

export abstract class AbstractGraph<TNode, TEdge extends Edge<TNode> = Edge<TNode>> {
  public edges: TEdge[] = [];

  protected constructor(public readonly nodes: TNode[]) {
  }

  public initEdges() {
    this.edges = this.nodes.flatMap(node =>
      this.nodes.filter(otherNode => this.adjacent(node, otherNode)).map(otherNode => this.createEdge(node, otherNode)),
    );
  }

  protected abstract createEdge(node: TNode, otherNode: TNode): TEdge;

  protected adjacent(node: TNode, otherNode: TNode): boolean {
    return node !== otherNode;
  }
}
