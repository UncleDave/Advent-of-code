import { getLinesFromFile, mapReduceSum } from "../utils";

const gameIdRegex = /Game (?<id>\d+): (?<content>.+)/;
const handfulRegex = /(?<quantity>\d+) (?<colour>.+)/;

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const games = input.map((line) => {
    const gameGroups = line.match(gameIdRegex)?.groups;

    if (!gameGroups?.id || !gameGroups.content)
      throw new Error(`Invalid line: ${line}`);

    const sets = gameGroups.content.split("; ").map((set) =>
      set.split(", ").map((handful) => {
        const groups = handfulRegex.exec(handful)?.groups;

        if (!groups?.quantity || !groups.colour)
          throw new Error(`Invalid handful: ${handful}`);

        return {
          quantity: Number(groups?.quantity),
          colour: groups?.colour,
        };
      }),
    );

    return {
      id: Number(gameGroups.id),
      sets,
    };
  });

  const maxRedCubes = 12;
  const maxGreenCubes = 13;
  const maxBlueCubes = 14;

  const possibleGames = games.filter((game) =>
    game.sets.every((set) =>
      set.every((handful) => {
        switch (handful.colour) {
          case "red":
            return handful.quantity <= maxRedCubes;
          case "green":
            return handful.quantity <= maxGreenCubes;
          case "blue":
            return handful.quantity <= maxBlueCubes;
        }
      }),
    ),
  );

  console.log(
    possibleGames.reduce(
      mapReduceSum((x) => x.id),
      0,
    ),
  );
})();
