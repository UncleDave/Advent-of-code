import { getLinesFromFile, mapReduceSum } from "../utils";

type Operator = "+" | "*";

interface Operation {
  operands: number[];
  operator: Operator;
}

(async function () {
  const input = await getLinesFromFile("input.txt");
  // Spooky invisible character on the start of the first line for some reason
  const fixedInput = [input[0].trimStart(), ...input.slice(1)];
  const lineWidth = Math.max(...fixedInput.map((x) => x.length));
  const columns: string[][] = [];

  for (let i = 0; i < lineWidth; i++) {
    const column: string[] = [];

    for (let j = 0; j < fixedInput.length; j++) {
      column.push(fixedInput[j][i]);
    }

    columns.push(column);
  }

  const operations = columns.reduce(
    (operations, column) => {
      let currentOperation = operations[operations.length - 1];

      if (column.every((x) => x === " ")) {
        return [...operations, { operands: [] as number[] } as Operation];
      }

      if (column.includes("+")) {
        currentOperation.operator = "+";
      }

      if (column.includes("*")) {
        currentOperation.operator = "*";
      }

      const operand = Number(
        column.filter((x) => x !== " " && x !== "+" && x !== "*").join(""),
      );

      currentOperation.operands.push(operand);

      return operations;
    },
    [{ operands: [] as number[] }] as Operation[],
  );

  const results = operations.map((operation) => {
    if (operation.operator === "+") {
      return operation.operands.reduce(
        mapReduceSum((x) => x),
        0,
      );
    }

    if (operation.operator === "*") {
      return operation.operands.reduce((acc, curr) => acc * curr, 1);
    }
  });

  const total = results.reduce(
    mapReduceSum((x) => x!),
    0,
  );

  console.log(total);
})();
