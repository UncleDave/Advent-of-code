import { getLinesFromFile } from "../utils";

const numbersMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const spelledNumbers = Object.keys(numbersMap);

(async function () {
  const input = await getLinesFromFile("./input.txt");

  const output = input
    .map((line) => {
      const digits: string[] = [];

      for (let i = 0; i < line.length; i++) {
        if (Number(line[i])) {
          digits.push(line[i]);
          continue;
        }

        const part = line.slice(i);
        const spelledNumber = spelledNumbers.find((x) =>
          part.startsWith(x),
        ) as keyof typeof numbersMap;

        if (spelledNumber) digits.push(numbersMap[spelledNumber]);
      }

      const firstDigit = digits[0];
      const lastDigit = digits[digits.length - 1];

      return Number(firstDigit.concat(lastDigit));
    })
    .reduce((a, b) => a + b, 0);

  console.log(output);
})();
