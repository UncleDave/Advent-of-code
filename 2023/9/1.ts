import { getLinesFromFile, mapReduceSum } from "../utils";

function difference(values: number[]): number[] {
  const result = [];

  for (let i = 1; i < values.length; i++) {
    result.push(values[i] - values[i - 1]);
  }

  return result;
}

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const histories = input.map((x) => x.split(" ").map(Number));

  console.log(
    histories.reduce(
      mapReduceSum((history) => {
        const diffs: Array<number[]> = [];

        do {
          diffs.push(
            difference(diffs.length === 0 ? history : diffs[diffs.length - 1]),
          );
        } while (diffs[diffs.length - 1].some((x) => x !== 0));

        const historyAndDiffs = [history, ...diffs];

        for (let i = historyAndDiffs.length - 2; i >= 0; i--) {
          const diffToInterpolate = historyAndDiffs[i];
          const diff = historyAndDiffs[i + 1];

          diffToInterpolate.push(
            diffToInterpolate[diffToInterpolate.length - 1] +
              diff[diff.length - 1],
          );
        }

        return history[history.length - 1];
      }),
      0,
    ),
  );
})();
