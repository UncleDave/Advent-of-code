import { getLinesFromFile, permuteWithRepetition } from "../utils";

(async function () {
  const input = await getLinesFromFile("./input.txt");

  const equations = input.map((x) => {
    const [target, values] = x.split(":");

    return {
      target: Number(target),
      values: values.trim().split(" ").map(Number),
    };
  });

  const operators = ["+", "*", "||"];

  const validEquations = equations.filter((equation) => {
    const operatorCount = equation.values.length - 1;
    const operatorPermutations = permuteWithRepetition(
      operators,
      operatorCount,
    );

    return operatorPermutations.some((operatorPermutation) => {
      const result = operatorPermutation.reduce((acc, operator, i) => {
        const value = equation.values[i];
        const nextValue = equation.values[i + 1];

        if (operator === "+") {
          return (acc || value) + nextValue;
        } else if (operator === "*") {
          return (acc || value) * nextValue;
        } else {
          return Number((acc || value).toString() + nextValue.toString());
        }
      }, 0);

      return result === equation.target;
    });
  });

  const sumOfValidEquations = validEquations.reduce(
    (acc, equation) => acc + equation.target,
    0,
  );

  console.log(sumOfValidEquations);
})();
