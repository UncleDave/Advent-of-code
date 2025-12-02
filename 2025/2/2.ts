import { mapReduceSum, readFileAsString } from "../utils";

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

  const sumOfInvalidIds = ranges.reduce(
    mapReduceSum((range) =>
      range
        .filter((x) => {
          const stringValue = x.toString();
          const firstDigit = stringValue[0];

          const repeatingSequences = Array.from(stringValue).reduce<string[]>(
            (acc, curr, i, wholeThing) => {
              if (curr === firstDigit && curr !== wholeThing[i - 1]) {
                acc.push(curr);
              } else {
                acc[acc.length - 1] += curr;
              }

              return acc;
            },
            [],
          );

          return (
            Array.from(stringValue).every((c) => c === firstDigit) ||
            (repeatingSequences.length > 1 &&
              repeatingSequences.every((x) => x === repeatingSequences[0]))
          );
        })
        .reduce(
          mapReduceSum((x) => x),
          0,
        ),
    ),
    0,
  );

  console.log(sumOfInvalidIds);
})();
