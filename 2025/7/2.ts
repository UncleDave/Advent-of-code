import { mapReduceSum, readFileAsString } from "../utils";

type GridValue = "S" | "." | "^" | number;
type Position = [number, number];

class Grid {
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

  getTimelineCount(): number {
    const startPosition = this.startPosition;
    this.setValue(startPosition, 1);

    for (let r = 1; r < this.values.length; r++) {
      const row = this.values[r];

      for (let c = 0; c < row.length; c++) {
        const value = row[c];
        const valueAbove = this.values[r - 1][c];

        if (value === "^" && Number.isInteger(valueAbove)) {
          const positionLeft: Position = [r, c - 1];
          const positionRight: Position = [r, c + 1];

          const valueLeft = this.values[r][c - 1];
          const valueRight = this.values[r][c + 1];

          if (Number.isInteger(valueLeft)) {
            this.setValue(
              positionLeft,
              (valueAbove as number) + (valueLeft as number),
            );
          } else {
            this.setValue(positionLeft, valueAbove as number);
          }

          if (Number.isInteger(valueRight)) {
            this.setValue(
              positionRight,
              (valueAbove as number) + (valueRight as number),
            );
          } else {
            this.setValue(positionRight, valueAbove as number);
          }
        } else if (Number.isInteger(valueAbove)) {
          this.setValue([r, c], value === "." ? valueAbove as number : (valueAbove as number) + (value as number));
        }
      }
    }

    for (let i = 0; i < this.values.length; i++) {
      console.log(this.values[i].join(" "));
    }

    return (
      this.values[this.values.length - 1].filter((x) =>
        Number.isInteger(x),
      ) as number[]
    ).reduce(
      mapReduceSum((x) => x),
      0,
    );
  }

  setValue(position: Position, value: GridValue) {
    const [r, c] = position;
    this.values[r][c] = value;
  }
}

(async function () {
  const input = await readFileAsString("input.txt");
  const grid = Grid.fromString(input);
  const timelineCount = grid.getTimelineCount();

  console.log(timelineCount);
})();
