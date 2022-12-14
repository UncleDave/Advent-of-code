export class Edge<T> {
  constructor(public readonly from: T, public readonly to: T) {
  }
}

export class Graph<T> {
  public readonly edges: Edge<T>[];

  constructor(public readonly nodes: T[]) {
    this.edges = this.nodes.flatMap(node =>
      this.nodes.filter(otherNode => this.adjacent(node, otherNode)).map(otherNode => new Edge<T>(node, otherNode)),
    );
  }

  protected adjacent(node: T, otherNode: T): boolean {
    return node !== otherNode;
  }
}
