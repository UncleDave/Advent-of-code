import { Graph } from './graph';

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

  manhattanDistance(otherPosition: GridPosition): number {
    return Math.abs(this.x - otherPosition.x) + Math.abs(this.y - otherPosition.y);
  }

  equals(otherPosition: GridPosition): boolean {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }
}

export class GridNode {
  constructor(public readonly position: GridPosition) {
  }

  distance(otherNode: GridNode): number {
    return this.position.manhattanDistance(otherNode.position);
  }
}

export class GridGraph<T extends GridNode = GridNode> extends Graph<T> {
  protected adjacent(node: T, otherNode: T): boolean {
    return node.distance(otherNode) === 1;
  }
}
