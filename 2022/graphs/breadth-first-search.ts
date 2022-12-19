import { AbstractGraph, Edge } from './abstract-graph';

export function shortestPathBetween<TNode extends object, TEdge extends Edge<TNode>>(graph: AbstractGraph<TNode, TEdge>, startNode: TNode, endNode: TNode): TEdge[] {
  const frontier = [startNode];
  const cameFrom = new WeakMap<TNode, TEdge | undefined>().set(startNode, undefined);

  while (frontier.length > 0) {
    const node = frontier.shift()!;

    if (node === endNode) {
      const path: TEdge[] = [];
      let originEdge = cameFrom.get(node);

      while (originEdge) {
        path.push(originEdge);
        originEdge = cameFrom.get(originEdge.from);
      }

      return path;
    }

    graph.edgesFrom(node).filter(edge => !cameFrom.has(edge.to)).forEach(edge => {
      cameFrom.set(edge.to, edge);
      frontier.push(edge.to);
    });
  }

  return [];
}
