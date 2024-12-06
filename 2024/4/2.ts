import { getLinesFromFile } from "../utils";

type Position = [number, number];

(async function () {
  const rows = await getLinesFromFile("./input.txt");
  const centrePositions = rows
    .slice(1, -1)
    .reduce<Position[]>((acc, row, rowIndex) => {
      const newAcc = [...acc];

      for (let colIndex = 1; colIndex < row.length - 1; colIndex++) {
        if (row[colIndex] === "A") {
          newAcc.push([rowIndex + 1, colIndex]);
        }
      }

      return newAcc;
    }, []);

  const wordCount = centrePositions.reduce((acc, [rowIndex, colIndex]) => {
    let masCount = 0;

    // Up-left M and down-right S
    if (
      rows[rowIndex - 1]?.[colIndex - 1] === "M" &&
      rows[rowIndex + 1]?.[colIndex + 1] === "S"
    )
      masCount += 1;

    // Up-right M and down-left S
    if (
      rows[rowIndex - 1]?.[colIndex + 1] === "M" &&
      rows[rowIndex + 1]?.[colIndex - 1] === "S"
    )
      masCount += 1;

    // Up-left S and down-right M
    if (
      rows[rowIndex - 1]?.[colIndex - 1] === "S" &&
      rows[rowIndex + 1]?.[colIndex + 1] === "M"
    )
      masCount += 1;

    // Up-right S and down-left M
    if (
      rows[rowIndex - 1]?.[colIndex + 1] === "S" &&
      rows[rowIndex + 1]?.[colIndex - 1] === "M"
    )
      masCount += 1;

    if (masCount === 2) return acc + 1;

    return acc;
  }, 0);

  console.log(wordCount);
})();
