import { readFileAsString } from "../utils";

type GridValue = "S" | "." | "^";
type Position = [number, number];

class Grid {
  public timelineCount = 1;

  constructor(private readonly values: GridValue[][]) {}

  static fromString(input: string): Grid {
    const rows = input
      .split("\n")
      .filter(Boolean)
      .map((line) => Array.from(line.trim()) as GridValue[]);

    return new Grid(rows);
  }

  get startPosition(): Position {
    for (let r = 0; r < this.values.length; r++) {
      for (let c = 0; c < this.values[r].length; c++) {
        if (this.values[r][c] === "S") {
          return [r, c];
        }
      }
    }

    throw new Error("Start position not found");
  }

  moveBeam([r, c]: Position) {
    if (r === this.values.length - 1) {
      return;
    }

    console.log("Row ", r + 1, " Timelines: ", this.timelineCount);

    const [nextR, nextC] = [r + 1, c];
    const valueBelow = this.values[nextR][nextC];

    if (valueBelow === "^") {
      this.timelineCount++;

      const leftPosition: Position = [nextR, nextC - 1];
      const rightPosition: Position = [nextR, nextC + 1];

      this.moveBeam(leftPosition);
      this.moveBeam(rightPosition);
    } else {
      this.moveBeam([nextR, nextC]);
    }
  }
}

(async function () {
  const input = await readFileAsString("input.txt");
  const grid = Grid.fromString(input);

  grid.moveBeam(grid.startPosition);

  console.log(grid.timelineCount);
})();
