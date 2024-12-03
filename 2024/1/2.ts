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

  const similarities = left.reduce((acc, x) => {
    const rightOccurrences = right.filter((y) => y === x).length;
    return acc + x * rightOccurrences;
  }, 0);

  console.log(similarities);
})();
