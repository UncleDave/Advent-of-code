import { getLinesFromFile } from "../utils";

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const [left, right] = input.reduce(
    (acc, x) => {
      const [left, right] = x.split("   ");

      acc[0].push(Number(left));
      acc[1].push(Number(right));

      return acc;
    },
    [[] as number[], [] as number[]],
  );

  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  const differences = left.map((x, i) => Math.abs(right[i] - x));
  const sumOfDifferences = differences.reduce((acc, x) => acc + x, 0);

  console.log(sumOfDifferences);
})();
