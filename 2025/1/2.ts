import { getLinesFromFile } from "../utils";

class Dial {
  public value = 50;
  public readonly history: number[] = [];

  private static readonly minimum = 0;
  private static readonly maximum = 99;

  rotateLeft(clicks: number) {
    while (clicks > 0) {
      const rotateBy = Math.min(this.value, clicks);
      this.value -= rotateBy;
      clicks -= rotateBy;

      if (rotateBy) this.history.push(this.value);

      if (clicks > 0 && this.value === Dial.minimum) {
        clicks--;
        this.value = Dial.maximum;
      }
    }
  }

  rotateRight(clicks: number) {
    while (clicks > 0) {
      const rotateBy = Math.min(Dial.maximum - this.value, clicks);
      this.value += rotateBy;
      clicks -= rotateBy;

      if (clicks > 0 && this.value === Dial.maximum) {
        clicks--;
        this.value = Dial.minimum;
      }

      this.history.push(this.value);
    }
  }
}

interface Rotation {
  direction: "L" | "R";
  clicks: number;
}

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const rotations = input
    .map((x) => x.trim())
    .map<Rotation>((x) => ({
      direction: x[0] as "L" | "R",
      clicks: Number(x.slice(1)),
    }));

  const dial = new Dial();

  rotations.forEach(({ direction, clicks }) => {
    if (direction === "L") {
      dial.rotateLeft(clicks);
    } else {
      dial.rotateRight(clicks);
    }
  });

  const timesPointingAtZero = dial.history.filter((x) => x === 0).length;

  console.log(timesPointingAtZero);
})();
