import { getLinesFromFile } from "../utils";

class Position {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

type Cell = "." | "#";

class LabMap {
  private readonly map: Cell[][];
  private readonly width: number;
  private readonly height: number;

  constructor(map: Cell[][]) {
    this.map = [...map.map((x) => [...x])];
    this.width = map[0].length;
    this.height = map.length;
  }

  getCell(position: Position): Cell {
    return this.map[position.y][position.x];
  }

  setCell(position: Position, cell: Cell) {
    this.map[position.y][position.x] = cell;
  }

  positionIsInMap(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }
}

type Direction = "up" | "down" | "left" | "right";

class Guard {
  constructor(
    public position: Position,
    public facing: Direction,
  ) {}

  move(map: LabMap): boolean {
    const nextPosition = this.getNextPosition();

    if (!map.positionIsInMap(nextPosition)) {
      return false;
    }

    const nextCell = map.getCell(nextPosition);

    if (nextCell === "#") {
      this.facing = this.getNextDirection();
    } else {
      this.position = nextPosition;
    }

    return true;
  }

  private getNextPosition(): Position {
    switch (this.facing) {
      case "up":
        return new Position(this.position.x, this.position.y - 1);
      case "down":
        return new Position(this.position.x, this.position.y + 1);
      case "left":
        return new Position(this.position.x - 1, this.position.y);
      case "right":
        return new Position(this.position.x + 1, this.position.y);
    }
  }

  private getNextDirection(): Direction {
    switch (this.facing) {
      case "up":
        return "right";
      case "down":
        return "left";
      case "left":
        return "up";
      case "right":
        return "down";
    }
  }
}

(async function () {
  const input = await getLinesFromFile("./input.txt");

  const [mapInput, guardStartPosition] = input.reduce<[Cell[][], Position]>(
    (acc, line, lineIndex) => {
      const cells = Array.from(line);
      let guardStartPosition = acc[1];

      if (!guardStartPosition) {
        const guardStartX = cells.findIndex((cell) => cell === "^");

        if (guardStartX !== -1) {
          guardStartPosition = new Position(guardStartX, lineIndex);
          cells[guardStartX] = ".";
        }
      }

      return [[...acc[0], cells as Cell[]], guardStartPosition];
    },
    [[], null!],
  );

  const originalMap = new LabMap(mapInput);
  const demoGuard = new Guard(guardStartPosition, "up");
  const originalGuardPath: Position[] = [];

  while (demoGuard.move(originalMap)) {
    originalGuardPath.push(demoGuard.position);
  }

  const uniquePositions = originalGuardPath
    .filter((x) => !x.equals(guardStartPosition))
    .filter(
      (position, index) =>
        !originalGuardPath.some(
          (otherPosition, otherIndex) =>
            otherIndex < index && otherPosition.equals(position),
        ),
    );

  const loopCount = uniquePositions.reduce((loopCount, position) => {
    const map = new LabMap(mapInput);
    const guard = new Guard(guardStartPosition, "up");

    const guardPositionHistory = [
      { position: guard.position, facing: guard.facing },
    ];

    if (map.getCell(position) === "#" || guardStartPosition.equals(position)) {
      return loopCount;
    }

    map.setCell(position, "#");

    while (guard.move(map)) {
      guardPositionHistory.push({
        position: guard.position,
        facing: guard.facing,
      });

      if (
        guardPositionHistory
          .slice(0, -1)
          .some(
            ({ position, facing }) =>
              position.equals(guard.position) && facing === guard.facing,
          )
      ) {
        return loopCount + 1;
      }
    }

    return loopCount;
  }, 0);

  console.log(loopCount);
})();
