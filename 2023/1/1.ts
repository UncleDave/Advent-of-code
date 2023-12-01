import { getLinesFromFile } from "../utils";

(async function () {
  const input = await getLinesFromFile("./input.txt");

  const output = input
    .map((line) => {
      const digits = Array.from(line).filter((x) => Number(x));
      const firstDigit = digits[0];
      const lastDigit = digits[digits.length - 1];

      return Number(firstDigit.concat(lastDigit));
    })
    .reduce((a, b) => a + b, 0);

  console.log(output);
})();
