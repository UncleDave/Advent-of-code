import { DirectedAcyclicWeightedGridGraph } from '../graphs/directed-acyclic-weighted-grid-graph';
import { GridNode, GridPosition } from '../graphs/grid-graph';
import { getLinesFromFile } from '../utils';

class Wall {
  constructor(public readonly start: GridPosition, public readonly end: GridPosition) {
  }

  intersects(otherPosition: GridPosition): boolean {
    return (
      otherPosition.x >= this.start.x &&
      otherPosition.x <= this.end.x &&
      otherPosition.y >= this.start.y &&
      otherPosition.y <= this.end.y
    );
  }
}

(async function () {
  const input = await getLinesFromFile('input.txt');

  const walls = input.flatMap(row =>
    row
      .split(' -> ')
      .map(positionInput =>
        positionInput
          .split(',')
          .map(Number),
      )
      .map(([x, y]) => new GridPosition(x, y))
      .reduce<Wall[]>((walls, currentPosition, i, allPositions) => {
        const nextPosition = allPositions[i + 1];

        if (!nextPosition)
          return walls;

        return [
          ...walls,
          new Wall(GridPosition.min(currentPosition, nextPosition), GridPosition.max(currentPosition, nextPosition)),
        ];
      }, []),
  );

  const wallStartPositions = walls.map(x => x.start);
  const wallEndPositions = walls.map(x => x.end);
  const sandOrigin = new GridPosition(500, 0);

  const minX = GridPosition.minX(...wallStartPositions, sandOrigin);
  const maxX = GridPosition.maxX(...wallEndPositions, sandOrigin);

  const minY = GridPosition.minY(...wallStartPositions, sandOrigin);
  const maxY = GridPosition.maxY(...wallEndPositions, sandOrigin);

  const grid = [...Array(maxY - minY).keys()]
    .map(y => [...Array(maxX - minX).keys()]
      .map(x => new GridPosition(x, y)),
    );

  const graph = new DirectedAcyclicWeightedGridGraph(
    grid.flatMap((row) =>
      row
        .filter(col => !walls.some(wall => wall.intersects(col)))
        .map(col => new GridNode(col)),
    ),
    (node, otherNode) =>
      node.distance(otherNode) === 1
        ? 0
        : otherNode.position.x < node.position.x
          ? 1
          : 2,
    maxY,
  );

  graph.initEdges();

  debugger;
})();
