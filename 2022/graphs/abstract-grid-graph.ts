import { mapMax, mapMin } from '../utils';
import { AbstractGraph, Edge } from './abstract-graph';

interface Distance {
  sum: number;
  x: number;
  y: number;
}

export class GridPosition {
  constructor(public readonly x: number, public readonly y: number) {
  }

  add(position: GridPosition): GridPosition;
  add(position: [number, number]): GridPosition;
  add(position: [number, number] | GridPosition): GridPosition {
    if (position instanceof Array)
      return this.add(new GridPosition(position[0], position[1]));

    return new GridPosition(this.x + position.x, this.y + position.y);
  }

  manhattanDistance(otherPosition: GridPosition): Distance {
    const xDistance = Math.abs(this.x - otherPosition.x);
    const yDistance = Math.abs(this.y - otherPosition.y);

    return {
      sum: xDistance + yDistance,
      x: xDistance,
      y: yDistance,
    };
  }

  equals(otherPosition: GridPosition): boolean {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }

  private value(): number {
    return this.x + this.y;
  }

  static min(...positions: GridPosition[]): GridPosition | undefined {
    return mapMin(positions, position => position.value());
  }

  static max(...positions: GridPosition[]): GridPosition | undefined {
    return mapMax(positions, position => position.value());
  }

  static minX(...positions: GridPosition[]): number {
    return Math.min(...positions.map(position => position.x));
  }

  static maxX(...positions: GridPosition[]): number {
    return Math.max(...positions.map(position => position.x));
  }

  static minY(...positions: GridPosition[]): number {
    return Math.min(...positions.map(position => position.y));
  }

  static maxY(...positions: GridPosition[]): number {
    return Math.max(...positions.map(position => position.y));
  }
}

export class GridNode {
  constructor(public readonly position: GridPosition) {
  }

  distance(otherNode: GridNode): Distance {
    return this.position.manhattanDistance(otherNode.position);
  }
}

export abstract class AbstractGridGraph<TNode extends GridNode = GridNode, TEdge extends Edge<TNode> = Edge<TNode>> extends AbstractGraph<TNode, TEdge> {
  protected constructor(nodes: TNode[], private readonly diagonalsAreAdjacent = false) {
    super(nodes);
  }

  public node(position: GridPosition): TNode | undefined {
    return this.nodes.find(node => node.position.equals(position));
  }

  protected adjacent(node: TNode, otherNode: TNode): boolean {
    const distance = node.distance(otherNode);
    const distanceToCompare = this.diagonalsAreAdjacent ? Math.max(distance.x, distance.y) : distance.sum;

    return distanceToCompare === 1;
  }
}
