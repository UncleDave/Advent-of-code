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

  const reportIsSafe = (report: number[]) => {
    const levelsAreIncreasingOrDecreasing =
      levelsAreIncreasing(report) || levelsAreDecreasing(report);

    if (!levelsAreIncreasingOrDecreasing) return false;

    for (let i = 0; i < report.length - 1; i++) {
      const level = report[i];
      const nextLevel = report[i + 1];
      const difference = getDifference(level, nextLevel);

      if (difference < 1 || difference > 3) return false;
    }

    return true;
  };

  const safeReports = reports.filter(reportIsSafe);
  const unsafeReports = reports.filter((report) => !reportIsSafe(report));

  unsafeReports.forEach((report) => {
    report.some((_, i) => {
      const alteredReport = report.toSpliced(i, 1);

      if (reportIsSafe(alteredReport)) {
        safeReports.push(alteredReport);
        return true;
      }
    });
  });

  console.log(safeReports.length);
})();
