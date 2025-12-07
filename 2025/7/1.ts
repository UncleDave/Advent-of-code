import { readFileAsString } from "../utils";

type GridValue = "S" | "." | "^";
type Position = [number, number];

class Grid {
  public beamPositions: Set<Position> = new Set();
  public splitCount: number = 0;

  constructor(private readonly values: GridValue[][]) {
    this.beamPositions.add(this.startPosition);
  }

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

  moveBeams(): boolean {
    const beamPositionsSnapshot = Array.from(this.beamPositions.values());

    if (beamPositionsSnapshot[0][0] === this.values.length - 1) {
      return false;
    }

    beamPositionsSnapshot.forEach((beamPosition) => {
      const [r, c] = beamPosition;
      const [nextR, nextC] = [r + 1, c];

      const valueBelow = this.values[nextR][nextC];

      if (valueBelow === "^") {
        this.splitCount++;

        const leftPosition: Position = [nextR, nextC - 1];
        const rightPosition: Position = [nextR, nextC + 1];

        if (
          !this.beamPositionExists(leftPosition) &&
          !this.beamPositionExists([r, leftPosition[1]])
        ) {
          this.beamPositions.add(leftPosition);
        }

        if (
          !this.beamPositionExists(rightPosition) &&
          !this.beamPositionExists([r, rightPosition[1]])
        ) {
          this.beamPositions.add(rightPosition);
        }
      } else {
        this.beamPositions.add([nextR, nextC]);
      }

      this.beamPositions.delete(beamPosition);
    });

    return true;
  }

  beamPositionExists(position: Position): boolean {
    return Array.from(this.beamPositions.values()).some(
      ([r, c]) => r === position[0] && c === position[1],
    );
  }
}

(async function () {
  const input = await readFileAsString("input.txt");
  const grid = Grid.fromString(input);

  let canMove = true;

  do {
    canMove = grid.moveBeams();
  } while (canMove);

  console.log(grid.splitCount);
})();
