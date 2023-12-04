import { getLinesFromFile, mapReduceSum } from "../utils";

interface PartNumber {
  value: number;
  row: number;
  columns: number[];
}

interface Distance {
  sum: number;
  x: number;
  y: number;
}

function getManhattanDistance(
  a: [number, number],
  b: [number, number],
): Distance {
  const xDistance = Math.abs(a[0] - b[0]);
  const yDistance = Math.abs(a[1] - b[1]);

  return {
    sum: xDistance + yDistance,
    x: xDistance,
    y: yDistance,
  };
}

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const partNumbers: PartNumber[] = [];
  const symbolPositions: Array<[number, number]> = [];

  for (let rowIndex = 0; rowIndex < input.length; rowIndex++) {
    const row = input[rowIndex];
    let currentNumber = "";

    for (let charIndex = 0; charIndex < row.length; charIndex++) {
      const char = row[charIndex];

      if (!isNaN(Number.parseInt(char))) {
        currentNumber += char;
        continue;
      }

      if (char !== ".") symbolPositions.push([rowIndex, charIndex]);

      if (currentNumber.length > 0) {
        const spannedColumns: number[] = [];

        for (let i = charIndex - currentNumber.length; i < charIndex; i++) {
          spannedColumns.push(i);
        }

        partNumbers.push({
          value: Number(currentNumber),
          row: rowIndex,
          columns: spannedColumns,
        });

        currentNumber = "";
      }
    }

    if (currentNumber.length > 0) {
      const spannedColumns: number[] = [];

      for (let i = row.length - currentNumber.length; i < row.length; i++) {
        spannedColumns.push(i);
      }

      partNumbers.push({
        value: Number(currentNumber),
        row: rowIndex,
        columns: spannedColumns,
      });

      currentNumber = "";
    }
  }

  const validPartNumbers = partNumbers.filter((partNumber) =>
    partNumber.columns.some((column) =>
      symbolPositions.some((symbolPosition) => {
        const distance = getManhattanDistance(
          [partNumber.row, column],
          symbolPosition,
        );

        return Math.max(distance.x, distance.y) === 1;
      }),
    ),
  );

  console.log(
    validPartNumbers.reduce(
      mapReduceSum((x) => x.value),
      0,
    ),
  );
})();
