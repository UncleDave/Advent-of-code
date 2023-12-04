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
      copies: 0,
    };
  });

  cards.forEach((card, i) => {
    if (!card.intersection.length) return;

    for (let j = -1; j < card.copies; j++) {
      cards
        .slice(i + 1, i + card.intersection.length + 1)
        .forEach((cardToCopy) => {
          cardToCopy.copies += 1;
        });
    }
  });

  console.log(
    cards.reduce(
      mapReduceSum((card) => card.copies),
      cards.length,
    ),
  );
})();
