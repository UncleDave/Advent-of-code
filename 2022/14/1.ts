import { AbstractGraph } from '../graphs/abstract-graph';
import { DirectedAcyclicWeightedGridGraph } from '../graphs/directed-acyclic-weighted-grid-graph';
import { WeightedGridGraph } from '../graphs/weighted-grid-graph';
import { getLinesFromFile, mapMin, SequentialLogger } from '../utils';
import { GridNode, GridPosition } from '../graphs/abstract-grid-graph';

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

function nodeIsAtMaxY(node: GridNode, maxY: number): boolean {
  return node.position.y === maxY;
}

function nodeIsAtMinX(node: GridNode, minX: number): boolean {
  return node.position.x === minX;
}

function nodeHasNoEdges<T extends object>(node: T, graph: AbstractGraph<T>): boolean {
  return graph.edgesFrom(node).length === 0;
}

function howMuchSandCouldASandChuckSandIfASandChuckCouldChuckSand(graph: WeightedGridGraph, sandOrigin: GridPosition, minX: number, maxY: number): GridPosition[] {
  const startNode = graph.node(sandOrigin);
  const sandPositions: GridPosition[] = [];
  let node = startNode;

  while (node && !nodeIsAtMaxY(node, maxY) && !(nodeIsAtMinX(node, minX) && nodeHasNoEdges(node, graph))) {
    if (nodeHasNoEdges(node, graph)) {
      sandPositions.push(node.position);
      graph.removeNode(node);
      node = startNode;
      continue;
    }

    const edges = graph.edgesFrom(node);
    const edge = mapMin(edges, x => x.weight);
    node = edge!.to;
  }

  return sandPositions;
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
          new Wall(GridPosition.min(currentPosition, nextPosition)!, GridPosition.max(currentPosition, nextPosition)!),
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

  const grid = [...Array(maxY - minY + 1).keys()]
    .map(y => [...Array(maxX - minX + 1).keys()]
      .map(x => new GridPosition(x + minX, y + minY)),
    );

  const graph = new DirectedAcyclicWeightedGridGraph(
    grid.flatMap((row) =>
      row
        .filter(col => !walls.some(wall => wall.intersects(col)))
        .map(col => new GridNode(col)),
    ),
    (node, otherNode) =>
      node.distance(otherNode).sum === 1
        ? 0
        : otherNode.position.x < node.position.x
          ? 1
          : 2,
    maxY,
  );

  graph.initEdges();

  const allTheSand = howMuchSandCouldASandChuckSandIfASandChuckCouldChuckSand(graph, sandOrigin, minX, maxY);
  const logger = new SequentialLogger();

  logger.enqueue('+', [sandOrigin.x - minX, sandOrigin.y]);

  walls.forEach(wall => {
    for (let i = wall.start.y; i <= wall.end.y; i++) {
      logger.enqueue('#', [wall.start.x - minX, i]);
    }

    for (let i = wall.start.x; i <= wall.end.x; i++) {
      logger.enqueue('#', [i - minX, wall.start.y]);
    }
  });

  allTheSand.forEach(sand => {
    logger.enqueue('o', [sand.x - minX, sand.y]);
  });

  await logger.write();

  process.stdout.write(`Dropped ${ allTheSand.length } sands`);
})();
