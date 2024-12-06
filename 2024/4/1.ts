import { getLinesFromFile } from "../utils";

type Position = [number, number];

(async function () {
  const rows = await getLinesFromFile("./input.txt");

  const isWordPresent = (
    word: string,
    startPosition: Position,
    getNextPosition: (position: Position) => Position,
  ): boolean => {
    let position = startPosition;

    for (const letter of word) {
      if (
        position[0] < 0 ||
        position[0] >= rows.length ||
        position[1] < 0 ||
        position[1] >= rows[0].length ||
        rows[position[0]]?.[position[1]] !== letter
      )
        return false;

      position = getNextPosition(position);
    }

    return true;
  };

  const word = "XMAS";
  const wordCount = rows.reduce(
    (acc, row, rowIndex) =>
      acc +
      Array.from(row).reduce((smallAcc, letter, colIndex) => {
        let score = 0;

        if (letter === word[0]) {
          // Up
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0] + 1,
              position[1],
            ])
          )
            score += 1;

          // Down
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0] - 1,
              position[1],
            ])
          )
            score += 1;

          // Right
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0],
              position[1] + 1,
            ])
          )
            score += 1;

          // Left
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0],
              position[1] - 1,
            ])
          )
            score += 1;

          // Up-right
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0] + 1,
              position[1] + 1,
            ])
          )
            score += 1;

          // Up-left
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0] + 1,
              position[1] - 1,
            ])
          )
            score += 1;

          // Down-right
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0] - 1,
              position[1] + 1,
            ])
          )
            score += 1;

          // Down-left
          if (
            isWordPresent(word, [rowIndex, colIndex], (position) => [
              position[0] - 1,
              position[1] - 1,
            ])
          )
            score += 1;
        }

        return smallAcc + score;
      }, 0),
    0,
  );

  console.log(wordCount);
})();
