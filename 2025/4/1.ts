import { readFileAsString } from "../utils";

type GridValue = "@" | ".";
type Position = [number, number];

class Grid {
  constructor(private readonly values: GridValue[][]) {}

  static fromString(input: string): Grid {
    const rows = input
      .split("\n")
      .map((line) => Array.from(line.trim()) as GridValue[]);

    return new Grid(rows);
  }

  get paperRolls(): Position[] {
    const positions: Position[] = [];

    for (let y = 0; y < this.values.length; y++) {
      for (let x = 0; x < this.values[y].length; x++) {
        if (this.values[y][x] === "@") {
          positions.push([x, y]);
        }
      }
    }

    return positions;
  }

  getAdjacentValues([x, y]: Position): GridValue[] {
    const adjacentPositions: Position[] = [
      [x, y - 1], // Up
      [x + 1, y - 1], // Up Right
      [x + 1, y], // Right
      [x + 1, y + 1], // Down Right
      [x, y + 1], // Down
      [x - 1, y + 1], // Down Left
      [x - 1, y], // Left
      [x - 1, y - 1], // Up Left
    ];

    const adjacentValues: GridValue[] = [];

    for (const [adjX, adjY] of adjacentPositions) {
      if (
        adjY >= 0 &&
        adjY < this.values.length &&
        adjX >= 0 &&
        adjX < this.values[adjY].length
      ) {
        adjacentValues.push(this.values[adjY][adjX]);
      }
    }

    return adjacentValues;
  }

  get pickablePaperRolls(): Position[] {
    return this.paperRolls.filter(
      (roll) =>
        this.getAdjacentValues(roll).filter((x) => x === "@").length < 4,
    );
  }
}

(async function () {
  const input = await readFileAsString("input.txt");
  const grid = Grid.fromString(input);

  console.log(grid.pickablePaperRolls.length);
})();
