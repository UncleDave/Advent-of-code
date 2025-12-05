import { readFileAsString } from "../utils";

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

const inputRegex = /^(?<range>\d+-\d+)|(?<id>\d+)$/gm;

(async function () {
  const input = await readFileAsString("input.txt");
  const parsedInput = input.trim().matchAll(inputRegex);

  const { fresh, available } = parsedInput.reduce(
    ({ fresh, available }, match) => {
      if (match.groups?.range) {
        const [start, end] = match.groups.range.split("-").map(Number);
        fresh.push(new Range(start, end));
      }

      if (match.groups?.id) {
        available.push(Number(match.groups.id));
      }

      return {
        fresh,
        available,
      };
    },
    { fresh: [] as Range[], available: [] as number[] },
  );
  
  const availableFreshIngredients = available.filter(x => fresh.some(y => y.contains(x)));
  
  console.log(availableFreshIngredients.length);
})();
