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
  private readonly width: number;
  private readonly height: number;

  constructor(private readonly map: Cell[][]) {
    this.width = map[0].length;
    this.height = map.length;
  }

  getCell(position: Position): Cell {
    return this.map[position.y][position.x];
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

  const [mapInput, guard] = input.reduce<[Cell[][], Guard]>(
    (acc, line, lineIndex) => {
      const cells = Array.from(line);
      let guard = acc[1];

      if (!guard) {
        const guardStartPosition = cells.findIndex((cell) => cell === "^");

        if (guardStartPosition !== -1) {
          guard = new Guard(new Position(guardStartPosition, lineIndex), "up");
          cells[guardStartPosition] = ".";
        }
      }

      return [[...acc[0], cells as Cell[]], guard];
    },
    [[], null!],
  );

  const map = new LabMap(mapInput);
  const guardPositionHistory = [guard.position];

  while (guard.move(map)) {
    guardPositionHistory.push(guard.position);
  }

  const uniqueGuardPositionHistory = guardPositionHistory.filter(
    (position, index) =>
      !guardPositionHistory.some(
        (otherPosition, otherIndex) =>
          otherIndex < index && otherPosition.equals(position),
      ),
  );

  console.log(uniqueGuardPositionHistory.length);
})();
