import { getLinesFromFile, mapReducePower, mapReduceSum } from "../utils";

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

interface Symbol {
  value: string;
  position: [number, number];
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
  const symbols: Symbol[] = [];

  for (let rowIndex = 0; rowIndex < input.length; rowIndex++) {
    const row = input[rowIndex];
    let currentNumber = "";

    for (let charIndex = 0; charIndex < row.length; charIndex++) {
      const char = row[charIndex];

      if (!isNaN(Number.parseInt(char))) {
        currentNumber += char;
        continue;
      }

      if (char !== ".")
        symbols.push({ value: char, position: [rowIndex, charIndex] });

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

  const potentialGears = symbols.filter((x) => x.value === "*");
  const gears = potentialGears.reduce<Array<Symbol & { ratio: number }>>(
    (acc, potentialGear) => {
      const adjacentParts = partNumbers.filter((part) =>
        part.columns.some((column) => {
          const distance = getManhattanDistance(potentialGear.position, [
            part.row,
            column,
          ]);

          return Math.max(distance.x, distance.y) === 1;
        }),
      );

      if (adjacentParts.length === 2) {
        return [
          ...acc,
          {
            ...potentialGear,
            ratio: adjacentParts.reduce(
              mapReducePower((x) => x.value),
              1,
            ),
          },
        ];
      }

      return acc;
    },
    [],
  );

  console.log(
    gears.reduce(
      mapReduceSum((x) => x.ratio),
      0,
    ),
  );
})();
