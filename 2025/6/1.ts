import { getLinesFromFile, mapReduceSum } from "../utils";

type Operator = "+" | "*";

interface Operation {
  operands: number[];
  operator: Operator;
}

(async function () {
  const input = await getLinesFromFile("input.txt");
  const operands = input.slice(0, -1);

  const operators = input[input.length - 1]
    .split(" ")
    .filter(Boolean)
    .map((x) => x.trim()) as Operator[];

  const operations: Operation[] = [];

  for (let i = 0; i < operands.length; i++) {
    const operandLine = operands[i];
    const splitOperands = operandLine.split(" ").filter(Boolean).map(Number);

    for (let j = 0; j < splitOperands.length; j++) {
      const operation = operations[j] ?? {
        operands: [],
        operator: operators[j],
      };

      operations[j] = {
        ...operation,
        operands: [...operation.operands, splitOperands[j]],
      };
    }
  }

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
