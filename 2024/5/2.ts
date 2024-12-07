import { getLinesFromFile } from "../utils";

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const firstUpdateIndex = input.findIndex((x) => !x.includes("|"));

  const pageOrderingRules = input
    .slice(0, firstUpdateIndex)
    .reduce<Record<number, number[]>>((acc, x) => {
      const [page, dependent] = x.split("|").map(Number);
      const dependents = acc[page] || [];

      return {
        ...acc,
        [page]: [...dependents, dependent],
      };
    }, {});

  const updates = input
    .slice(firstUpdateIndex)
    .map((x) => x.split(",").map(Number));

  const invalidUpdates = updates.filter((update) => {
    const processedPages: number[] = [];

    return update.some((page) => {
      const dependents = pageOrderingRules[page] || [];
      const invalid = processedPages.some((x) => dependents.includes(x));

      processedPages.push(page);

      return invalid;
    });
  });

  const fixedUpdates = invalidUpdates.map((update) =>
    update.reduce<number[]>((newUpdate, page) => {
      const dependents = pageOrderingRules[page] || [];
      const firstIndexOfDependent = newUpdate.findIndex((x) =>
        dependents.includes(x),
      );

      if (firstIndexOfDependent !== -1) {
        newUpdate.splice(firstIndexOfDependent, 0, page);
      } else {
        newUpdate.push(page);
      }

      return newUpdate;
    }, []),
  );

  const middlePageOfEachUpdate = fixedUpdates.map((x) => x[(x.length / 2) | 0]);
  const sumOfMiddlePages = middlePageOfEachUpdate.reduce(
    (acc, x) => acc + x,
    0,
  );

  console.log(sumOfMiddlePages);
})();
