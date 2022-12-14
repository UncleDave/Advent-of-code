import { getLinesFromFile } from '../utils';
import { GridPosition } from './grid-graph';
import { HeightmapGridGraph, HeightmapGridNode } from './heightmap-grid-graph';

(async function () {
  const input = await getLinesFromFile('input.txt');

  const graph = new HeightmapGridGraph(
    input.flatMap((row, y) =>
      Array
        .from(row)
        .map((letter, x) => {
          const heightLetter = letter === 'S' ? 'a' : letter === 'E' ? 'z' : letter;
          const height = heightLetter.charCodeAt(0) - 97;

          return new HeightmapGridNode(new GridPosition(x, y), height);
        }),
    ),
    1,
    Infinity,
  );
})();
