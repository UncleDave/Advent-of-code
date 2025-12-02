import { mapReduceSum, readFileAsString } from "../utils";

function firstHalfOfNumber(number: number): number {
  const numberAsString = number.toString();
  const firstHalf = numberAsString.slice(0, numberAsString.length / 2);
  return Number(firstHalf);
}

function lastHalfOfNumber(number: number): number {
  const numberAsString = number.toString();
  const lastHalf = numberAsString.slice(numberAsString.length / 2);
  return Number(lastHalf);
}

class Range {
  constructor(
    public readonly start: number,
    public readonly end: number,
  ) {}

  contains(value: number): boolean {
    return value >= this.start && value <= this.end;
  }

  filter(predicate: (value: number) => boolean): number[] {
    const result: number[] = [];

    for (let i = this.start; i <= this.end; i++) {
      if (predicate(i)) {
        result.push(i);
      }
    }

    return result;
  }

  map<T>(mapper: (value: number) => T): T[] {
    const result: T[] = [];

    for (let i = this.start; i <= this.end; i++) {
      result.push(mapper(i));
    }

    return result;
  }
}

(async function () {
  const input = (await readFileAsString("input.txt")).trim();
  const ranges = input.split(",").map((x) => {
    const [start, end] = x.split("-").map(Number);
    return new Range(start, end);
  });

  const sumOfInvalidIds = ranges.reduce((total, range) => {
    const invalidIds = range.filter(
      (x) =>
        x.toString().length % 2 === 0 &&
        firstHalfOfNumber(x) === lastHalfOfNumber(x),
    );

    return (
      total +
      invalidIds.reduce(
        mapReduceSum((x) => x),
        0,
      )
    );
  }, 0);

  console.log(sumOfInvalidIds);
})();
