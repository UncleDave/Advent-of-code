import { promises as fs } from 'fs';
import { pairwise } from '../utils';
import { GridPosition } from '../graphs/abstract-grid-graph';

class Sensor {
  constructor(public readonly position: GridPosition, private readonly range: number) {
  }

  overlappingTiles(y: number): [number, number] | undefined {
    const yDistance = Math.abs(this.position.y - y);

    if (yDistance > this.range)
      return;

    const xOffset = this.range - yDistance;
    const xStart = this.position.x - xOffset;
    const xEnd = this.position.x + xOffset;

    return [xStart, xEnd];
  }
}

const inputRegex = /[x,y]=(?<position>-*\d+)/g;

(async function () {
  const input = await fs.readFile('input.txt', { encoding: 'utf-8' });
  const positionsInput = Array.from(input.matchAll(inputRegex), x => x.groups!.position);

  const positions = pairwise(
    positionsInput,
    (x, y) => new GridPosition(Number(x), Number(y)),
  );

  const sensors = pairwise(
    positions,
    (sensorPosition, beaconPosition) => new Sensor(sensorPosition, beaconPosition.manhattanDistance(sensorPosition).sum),
  );

  const maxCoordinate = 4000000;
  const overlappingTiles: [number, number][][] = [];

  for (let i = 0; i <= maxCoordinate; i++) {
    overlappingTiles.push(
      sensors
        .map(x => x.overlappingTiles(i))
        .filter((x): x is [number, number] => x !== undefined)
        .reduce<[number, number][]>((coveredRanges, currentRange) => {
          if (coveredRanges.some(range => range[0] <= currentRange[0] && range[1] >= currentRange[1]))
            return coveredRanges;

          const expandedRanges = coveredRanges.filter(range => currentRange[0] < range[0] && currentRange[1] > range[1]);

          if (expandedRanges.length)
            return [
              ...coveredRanges.filter(range => !expandedRanges.includes(range)),
              currentRange,
            ];

          const partiallyExpandedRanges = coveredRanges.filter(range => (currentRange[0] < range[0] && currentRange[1] >= range[0]) || (currentRange[1] > range[1] && currentRange[0] <= range[1]));

          if (partiallyExpandedRanges.length)
            return [
              ...coveredRanges.filter(range => !partiallyExpandedRanges.includes(range)),
              ...partiallyExpandedRanges.map<[number, number]>(range => [Math.min(range[0], currentRange[0]), Math.max(range[1], currentRange[1])]),
            ];

          return [
            ...coveredRanges,
            currentRange,
          ];
        }, [])
        .reduce<[number, number][]>((coveredRanges, currentRange) => {
          if (coveredRanges.some(range => range[0] <= currentRange[0] && range[1] >= currentRange[1]))
            return coveredRanges;

          const expandedRanges = coveredRanges.filter(range => currentRange[0] < range[0] && currentRange[1] > range[1]);

          if (expandedRanges.length)
            return [
              ...coveredRanges.filter(range => !expandedRanges.includes(range)),
              currentRange,
            ];

          const partiallyExpandedRanges = coveredRanges.filter(range => (currentRange[0] < range[0] && currentRange[1] >= range[0]) || (currentRange[1] > range[1] && currentRange[0] <= range[1]));

          if (partiallyExpandedRanges.length)
            return [
              ...coveredRanges.filter(range => !partiallyExpandedRanges.includes(range)),
              ...partiallyExpandedRanges.map<[number, number]>(range => [Math.min(range[0], currentRange[0]), Math.max(range[1], currentRange[1])]),
            ];

          return [
            ...coveredRanges,
            currentRange,
          ];
        }, [])
        .reduce<[number, number][]>((coveredRanges, currentRange) => {
          if (coveredRanges.some(range => range[0] <= currentRange[0] && range[1] >= currentRange[1]))
            return coveredRanges;

          const expandedRanges = coveredRanges.filter(range => currentRange[0] < range[0] && currentRange[1] > range[1]);

          if (expandedRanges.length)
            return [
              ...coveredRanges.filter(range => !expandedRanges.includes(range)),
              currentRange,
            ];

          const partiallyExpandedRanges = coveredRanges.filter(range => (currentRange[0] < range[0] && currentRange[1] >= range[0]) || (currentRange[1] > range[1] && currentRange[0] <= range[1]));

          if (partiallyExpandedRanges.length)
            return [
              ...coveredRanges.filter(range => !partiallyExpandedRanges.includes(range)),
              ...partiallyExpandedRanges.map<[number, number]>(range => [Math.min(range[0], currentRange[0]), Math.max(range[1], currentRange[1])]),
            ];

          return [
            ...coveredRanges,
            currentRange,
          ];
        }, []),
    );
  }

  const overlappingTilesByY = overlappingTiles
    .map((ranges, i) => ranges
      .map(([minX, maxX]) => ({
        minX,
        maxX,
        y: i,
      })),
    );

  // 11,600,823,139,120
  console.log(overlappingTilesByY.filter(x => x.some(({ minX, maxX }) => minX <= 0 && maxX < maxCoordinate))[0]);
})();
