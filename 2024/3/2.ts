import { readFileAsString } from "../utils";

(async function () {
  const mulExpression = /mul\((?<multiplier>\d+),(?<multiplicand>\d+)\)/g;
  const input = await readFileAsString("./input.txt");
  const chunks = input.split(/(do(?:n't)?\(\))/);

  const enabledChunks = chunks.reduce((acc, x, i) => {
    if (x === "do()") {
      return acc + chunks[i + 1];
    }

    return acc;
  }, chunks[0]);

  const matches = enabledChunks.matchAll(mulExpression);

  let total = 0;

  for (const match of matches) {
    const multiplier = parseInt(match.groups!.multiplier);
    const multiplicand = parseInt(match.groups!.multiplicand);

    total += multiplier * multiplicand;
  }

  console.log(total);
})();
