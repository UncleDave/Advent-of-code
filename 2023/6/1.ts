import { getLinesFromFile, mapReducePower } from "../utils";

interface Race {
  duration: number;
  bestDistance: number;
}

(async function () {
  const input = await getLinesFromFile("./input.txt");

  const [times, distances] = input.map((x) =>
    x
      .split(":")[1]
      .trim()
      .split(" ")
      .filter((x) => x)
      .map(Number),
  );

  const races: Array<Race> = [];

  for (let i = 0; i < times.length; i++) {
    races.push({ duration: times[i], bestDistance: distances[i] });
  }

  console.log(
    races.reduce(
      mapReducePower((race) => {
        let count = 0;

        for (
          let buttonDuration = 1;
          buttonDuration < race.duration;
          buttonDuration++
        ) {
          if (
            (race.duration - buttonDuration) * buttonDuration >
            race.bestDistance
          )
            count++;
        }

        return count;
      }),
      1,
    ),
  );
})();
