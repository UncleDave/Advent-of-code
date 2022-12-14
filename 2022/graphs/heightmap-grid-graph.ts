import { GridGraph, GridNode, GridPosition } from './grid-graph';

export class HeightmapGridNode extends GridNode {
  constructor(position: GridPosition, public readonly height: number) {
    super(position);
  }
}

export class HeightmapGridGraph<T extends HeightmapGridNode = HeightmapGridNode> extends GridGraph<T> {
  constructor(nodes: T[], private readonly maxElevationIncrease: number, private readonly maxElevationDecrease: number) {
    super(nodes);
  }

  protected adjacent(node: T, otherNode: T): boolean {
    const heightDifference = otherNode.height - node.height;

    return super.adjacent(node, otherNode) && (
      heightDifference === 0 || Math.abs(heightDifference) <= (heightDifference < 0 ? this.maxElevationDecrease : this.maxElevationIncrease)
    );
  }
}
