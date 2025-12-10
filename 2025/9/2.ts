import { getLinesFromFile } from "../utils";

type Tile = [number, number];

function manhattanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function realAreaOfRectangle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
}

function printTiles(redTiles: Tile[], greenTiles: Tile[]) {
  const allTiles = [...redTiles, ...greenTiles];
  if (allTiles.length === 0) return;

  const padding = 1;
  const minX = Math.min(...allTiles.map(([x]) => x)) - padding;
  const maxX = Math.max(...allTiles.map(([x]) => x)) + padding;
  const minY = Math.min(...allTiles.map(([_, y]) => y)) - padding;
  const maxY = Math.max(...allTiles.map(([_, y]) => y)) + padding;

  for (let y = minY; y <= maxY; y++) {
    let row = "";
    for (let x = minX; x <= maxX; x++) {
      if (redTiles.some(([rx, ry]) => rx === x && ry === y)) {
        row += "X";
      } else if (greenTiles.some(([gx, gy]) => gx === x && gy === y)) {
        row += "O";
      } else {
        row += ".";
      }
    }
    console.log(row);
  }
}

function rasterizeLineTiles(a: Tile, b: Tile): Tile[] {
  const tiles: Tile[] = [];
  let [x0, y0] = a;
  const [x1, y1] = b;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    tiles.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return tiles;
}

function pointInPolygon(p: Tile, vertices: Tile[]): boolean {
  const [px, py] = p;
  let inside = false;

  const n = vertices.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [xi, yi] = vertices[i];
    const [xj, yj] = vertices[j];

    const cross = (xj - xi) * (py - yi) - (yj - yi) * (px - xi);
    if (cross === 0) {
      const minX = Math.min(xi, xj);
      const maxX = Math.max(xi, xj);
      const minY = Math.min(yi, yj);
      const maxY = Math.max(yi, yj);
      if (px >= minX && px <= maxX && py >= minY && py <= maxY) {
        return true;
      }
    }

    const intersect =
      yi > py !== yj > py &&
      px <
        ((xj - xi) * (py - yi)) / (yj - yi === 0 ? Number.EPSILON : yj - yi) +
          xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function getGreenTiles(redTiles: Tile[]): Tile[] {
  if (redTiles.length === 0) return [];

  const vertices: Tile[] =
    redTiles[0][0] === redTiles[redTiles.length - 1][0] &&
    redTiles[0][1] === redTiles[redTiles.length - 1][1]
      ? [...redTiles]
      : [...redTiles, redTiles[0]];

  const redSet = new Set(redTiles.map(([x, y]) => `${x},${y}`));
  const greenSet = new Set<string>();

  for (let i = 0; i < vertices.length - 1; i++) {
    const edgeTiles = rasterizeLineTiles(vertices[i], vertices[i + 1]);
    for (const [x, y] of edgeTiles) {
      const key = `${x},${y}`;
      if (!redSet.has(key)) greenSet.add(key);
    }
  }

  const xs = vertices.map(([x]) => x);
  const ys = vertices.map(([_, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const key = `${x},${y}`;
      if (redSet.has(key)) continue;
      if (pointInPolygon([x, y], vertices)) {
        greenSet.add(key);
      }
    }
  }

  const greenTiles: Tile[] = [];
  for (const key of greenSet) {
    const [sx, sy] = key.split(",").map(Number);
    greenTiles.push([sx, sy]);
  }

  return greenTiles;
}

function compressCoordinates(rawRedTiles: Tile[]) {
  const xs = Array.from(new Set(rawRedTiles.map(([x]) => x))).sort(
    (a, b) => a - b,
  );
  const ys = Array.from(new Set(rawRedTiles.map(([_, y]) => y))).sort(
    (a, b) => a - b,
  );

  const xToIdx = new Map<number, number>();
  xs.forEach((v, i) => xToIdx.set(v, i));
  const yToIdx = new Map<number, number>();
  ys.forEach((v, i) => yToIdx.set(v, i));

  const compressedRed = rawRedTiles.map(
    ([x, y]) => [xToIdx.get(x)!, yToIdx.get(y)!] as Tile,
  );

  return {
    compressedRed,
    xs,
    ys,
  };
}

(async function () {
  const input = await getLinesFromFile(`input.txt`);
  const rawRedTiles: Tile[] = input.map(
    (line) => line.trim().split(",").map(Number) as Tile,
  );

  const { compressedRed, xs, ys } = compressCoordinates(rawRedTiles);
  const greenTiles = getGreenTiles(compressedRed);
  // printTiles(compressedRed, greenTiles);

  const redSet = new Set(compressedRed.map(([x, y]) => `${x},${y}`));
  const greenSet = new Set(greenTiles.map(([x, y]) => `${x},${y}`));

  const rectangles = compressedRed.map(([cx, cy]) => {
    const furthestRedTile = compressedRed
      .map(([ox, oy]) => ({
        x: ox,
        y: oy,
        distance: manhattanDistance(cx, cy, ox, oy),
      }))
      .filter(({ x: fx, y: fy }) => {
        const minX = Math.min(cx, fx);
        const maxX = Math.max(cx, fx);
        const minY = Math.min(cy, fy);
        const maxY = Math.max(cy, fy);

        for (let ty = minY; ty <= maxY; ty++) {
          for (let tx = minX; tx <= maxX; tx++) {
            const key = `${tx},${ty}`;
            if (!redSet.has(key) && !greenSet.has(key)) {
              return false;
            }
          }
        }
        return true;
      })
      .reduce((a, b) => (a.distance > b.distance ? a : b));

    return [
      [cx, cy],
      [furthestRedTile.x, furthestRedTile.y],
    ] as [Tile, Tile];
  });

  const largestRealArea = Math.max(
    ...rectangles.map(([[cx1, cy1], [cx2, cy2]]) => {
      const minCx = Math.min(cx1, cx2);
      const maxCx = Math.max(cx1, cx2);
      const minCy = Math.min(cy1, cy2);
      const maxCy = Math.max(cy1, cy2);

      const realMinX = xs[minCx];
      const realMaxX = xs[maxCx];
      const realMinY = ys[minCy];
      const realMaxY = ys[maxCy];

      return realAreaOfRectangle(realMinX, realMinY, realMaxX, realMaxY);
    }),
  );

  console.log(largestRealArea);
})();
