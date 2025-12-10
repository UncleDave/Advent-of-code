import { getLinesFromFile } from "../utils";

function manhattanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function areaOfRectangle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
}

(async function () {
  const input = await getLinesFromFile("input.txt");
  const redTiles = input.map((x) => x.trim().split(",").map(Number));

  const rectangles = redTiles.map(([x, y]) => {
    const furthestRedTile = redTiles
      .map(([otherX, otherY]) => ({
        x: otherX,
        y: otherY,
        distance: manhattanDistance(x, y, otherX, otherY),
      }))
      .reduce((a, b) => (a.distance > b.distance ? a : b));

    return [
      [x, y],
      [furthestRedTile.x, furthestRedTile.y],
    ];
  });

  const largestRectangle = Math.max(
    ...rectangles.map(([[x1, y1], [x2, y2]]) =>
      areaOfRectangle(x1, y1, x2, y2),
    ),
  );
  
  console.log(largestRectangle);
})();
