import { getLinesFromFile, mapReducePower, mapReduceSum } from "../utils";

const gameIdRegex = /Game (?<id>\d+): (?<content>.+)/;
const handfulRegex = /(?<quantity>\d+) (?<colour>.+)/;

(async function () {
  const input = await getLinesFromFile("./input.txt");
  const games = input.map((line) => {
    const gameGroups = line.match(gameIdRegex)?.groups;

    if (!gameGroups?.id || !gameGroups.content)
      throw new Error(`Invalid line: ${line}`);

    const sets = gameGroups.content.split("; ").map((set) =>
      set.split(", ").reduce(
        (setHandfuls, handful) => {
          const groups = handfulRegex.exec(handful)?.groups;

          if (!groups?.quantity || !groups.colour)
            throw new Error(`Invalid handful: ${handful}`);

          return {
            ...setHandfuls,
            [groups.colour]: Number(groups.quantity),
          };
        },
        { red: 0, green: 0, blue: 0 },
      ),
    );

    return {
      id: Number(gameGroups.id),
      sets,
    };
  });

  const minCubesPerGame = games.map((game) =>
    game.sets.reduce(
      (minCubes, set) => ({
        red: Math.max(minCubes.red, set.red),
        green: Math.max(minCubes.green, set.green),
        blue: Math.max(minCubes.blue, set.blue),
      }),
      { red: 0, green: 0, blue: 0 },
    ),
  );

  const result = minCubesPerGame.reduce(
    mapReduceSum((cubeTypes) =>
      Object.values(cubeTypes).reduce(
        mapReducePower((x) => x),
        1,
      ),
    ),
    0,
  );

  console.log(result);
})();
