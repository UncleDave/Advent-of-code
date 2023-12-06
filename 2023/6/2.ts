import { getLinesFromFile } from "../utils";

interface Race {
  duration: number;
  bestDistance: number;
}

(async function () {
  const input = await getLinesFromFile("./input.txt");

  const [duration, bestDistance] = input.map((x) =>
    Number(x.split(":")[1].replace(/\s+/g, "")),
  );

  const race: Race = { duration, bestDistance };
  let count = 0;

  for (
    let buttonDuration = 1;
    buttonDuration < race.duration;
    buttonDuration++
  ) {
    if ((race.duration - buttonDuration) * buttonDuration > race.bestDistance)
      count++;
  }

  console.log(count);
})();
