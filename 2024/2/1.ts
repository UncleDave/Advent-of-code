import { getLinesFromFile } from "../utils";

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const reports = input.map((x) => x.split(" ").map(Number));

  const levelsAreIncreasing = (levels: number[]) => {
    for (let i = 0; i < levels.length - 1; i++) {
      const level = levels[i];
      const nextLevel = levels[i + 1];

      if (level >= nextLevel) return false;
    }

    return true;
  };

  const levelsAreDecreasing = (levels: number[]) => {
    for (let i = 0; i < levels.length - 1; i++) {
      const level = levels[i];
      const nextLevel = levels[i + 1];

      if (level <= nextLevel) return false;
    }

    return true;
  };

  const getDifference = (level: number, otherLevel: number) =>
    Math.abs(level - otherLevel);

  const safeReports = reports.filter((x) => {
    const levelsAreIncreasingOrDecreasing =
      levelsAreIncreasing(x) || levelsAreDecreasing(x);

    if (!levelsAreIncreasingOrDecreasing) return false;

    for (let i = 0; i < x.length - 1; i++) {
      const level = x[i];
      const nextLevel = x[i + 1];
      const difference = getDifference(level, nextLevel);

      if (difference < 1 || difference > 3) return false;
    }

    return true;
  });

  console.log(safeReports.length);
})();
