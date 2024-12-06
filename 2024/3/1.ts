import { readFileAsString } from "../utils";

(async function () {
  const mulExpression = /mul\((?<multiplier>\d+),(?<multiplicand>\d+)\)/g;
  const input = await readFileAsString("./input.txt");
  const matches = input.matchAll(mulExpression);

  let total = 0;

  for (const match of matches) {
    const multiplier = parseInt(match.groups!.multiplier);
    const multiplicand = parseInt(match.groups!.multiplicand);

    total += multiplier * multiplicand;
  }

  console.log(total);
})();
