import { distinct, mapReduceSum, readFileAsString } from "../utils";

class Range {
  constructor(
    public start: number,
    public end: number,
  ) {}
}

const inputRegex = /^(?<range>\d+-\d+)$/gm;

(async function () {
  const input = await readFileAsString("input.txt");
  const parsedInput = input.trim().matchAll(inputRegex);

  const fresh = parsedInput.reduce((acc, match) => {
    if (match.groups?.range) {
      const [start, end] = match.groups.range.split("-").map(Number);
      acc.push(new Range(start, end));
    }

    return acc;
  }, [] as Range[]);

  fresh.sort((a, b) => a.start - b.start);

  const mergedFresh: Range[] = [];

  for (const range of fresh) {
    const last = mergedFresh[mergedFresh.length - 1];
    if (last && range.start <= last.end + 1) {
      last.end = Math.max(last.end, range.end);
    } else {
      mergedFresh.push(new Range(range.start, range.end));
    }
  }

  const freshIngredientCount = mergedFresh.reduce(
    mapReduceSum((x) => x.end - x.start + 1),
    0,
  );

  console.log(freshIngredientCount);
})();
