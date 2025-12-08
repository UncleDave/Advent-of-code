import { getLinesFromFile, mapReducePower } from "../utils";

type Position = [number, number, number];

class JunctionBox {
  constructor(public readonly position: Position) {}

  distanceTo(other: JunctionBox): number {
    const dx = this.position[0] - other.position[0];
    const dy = this.position[1] - other.position[1];
    const dz = this.position[2] - other.position[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

interface JunctionBoxPair {
  boxes: [JunctionBox, JunctionBox];
  distance: number;
}

class Circuit {
  constructor(private readonly boxes: JunctionBox[]) {}

  get size(): number {
    return this.boxes.length;
  }

  add(box: JunctionBox) {
    this.boxes.push(box);
  }

  merge(other: Circuit) {
    this.boxes.push(...other.boxes);
  }

  containsBoxAt(position: Position): boolean {
    return this.boxes.some(
      (box) =>
        box.position[0] === position[0] &&
        box.position[1] === position[1] &&
        box.position[2] === position[2],
    );
  }
}

class JunctionBoxes {
  public circuits: Circuit[] = [];
  private readonly boxes: JunctionBox[];

  constructor(private boxPositions: Position[]) {
    this.boxes = boxPositions.map((position) => new JunctionBox(position));
  }

  getClosestBox(box: JunctionBox): { box: JunctionBox; distance: number } {
    return this.boxes
      .filter((otherBox) => otherBox !== box)
      .reduce(
        (closest, current) => {
          const distance = box.distanceTo(current);

          return distance < closest.distance
            ? { box: current, distance }
            : closest;
        },
        { box: null! as JunctionBox, distance: Infinity },
      );
  }

  getClosestBoxes(count: number): JunctionBoxPair[] {
    const pairs: JunctionBoxPair[] = [];

    for (let i = 0; i < this.boxes.length; i++) {
      for (let j = i + 1; j < this.boxes.length; j++) {
        const boxA = this.boxes[i];
        const boxB = this.boxes[j];
        const distance = boxA.distanceTo(boxB);

        pairs.push({ boxes: [boxA, boxB], distance });
      }
    }

    pairs.sort((a, b) => a.distance - b.distance);

    return pairs.slice(0, count);
  }

  createCircuits(count: number): void {
    const closestBoxes = this.getClosestBoxes(count);

    for (const pair of closestBoxes) {
      const [boxA, boxB] = pair.boxes;

      let circuitA = this.circuits.find((circuit) =>
        circuit.containsBoxAt(boxA.position),
      );

      let circuitB = this.circuits.find((circuit) =>
        circuit.containsBoxAt(boxB.position),
      );

      if (circuitA && circuitB && circuitA === circuitB) {
        continue;
      }

      if (circuitA && circuitB) {
        circuitA.merge(circuitB);
        this.circuits = this.circuits.filter((circuit) => circuit !== circuitB);
      } else if (circuitA) {
        circuitA.add(boxB);
      } else if (circuitB) {
        circuitB.add(boxA);
      } else {
        this.circuits.push(new Circuit([boxA, boxB]));
      }
    }
  }
}

(async function () {
  const input = await getLinesFromFile("input.txt");
  const boxPositions: Position[] = input.map((line) => {
    const [x, y, z] = line.trim().split(",").map(Number);
    return [x, y, z];
  });

  const junctionBoxes = new JunctionBoxes(boxPositions);

  junctionBoxes.createCircuits(1000);

  console.log(
    junctionBoxes.circuits
      .toSorted((a, b) => b.size - a.size)
      .slice(0, 3)
      .reduce(
        mapReducePower((x) => x.size),
        1,
      ),
  );
})();
