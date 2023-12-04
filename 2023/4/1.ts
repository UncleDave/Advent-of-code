import { getLinesFromFile, mapReduceSum } from "../utils";

const inputRegex =
  /Card\s+(?<card>\d+):\s+(?<winningNumbers>(?:\d+\s+)+)\|\s+(?<heldNumbers>(?:\d+\s*)+)/;

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const cards = input.map((x) => {
    const groups = x.match(inputRegex)?.groups;

    if (!groups) throw new Error(`Invalid input: ${x}`);

    function processNumbers(numbers: string) {
      return numbers
        .split(" ")
        .filter((x) => x !== "")
        .map((x) => Number(x));
    }

    const winningNumbers = processNumbers(groups.winningNumbers);
    const heldNumbers = processNumbers(groups.heldNumbers);

    return {
      card: Number(groups.card),
      winningNumbers,
      heldNumbers,
      intersection: winningNumbers.filter((x) => heldNumbers.includes(x)),
    };
  });

  const cardScores = cards.map((card) =>
    !card.intersection.length
      ? 0
      : card.intersection.reduce((acc) => (acc === 0 ? 1 : acc * 2), 0),
  );

  console.log(
    cardScores.reduce(
      mapReduceSum((score) => score),
      0,
    ),
  );
})();
