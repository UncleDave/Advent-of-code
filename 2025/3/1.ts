import { getLinesFromFile, mapReduceSum } from "../utils";

class BatteryBank {
  constructor(private readonly batteries: number[]) {}

  get maximumJoltage(): number {
    const batteriesWithoutLast = this.batteries.slice(0, -1);

    const highestJoltageBatteryIndex = batteriesWithoutLast.reduce(
      (highestIndex, battery, i) => {
        const currentHighestJoltage = batteriesWithoutLast[highestIndex];

        if (battery > currentHighestJoltage) {
          return i;
        }

        return highestIndex;
      },
      0,
    );

    const highestJoltageBattery = this.batteries[highestJoltageBatteryIndex];
    const batteriesToTheRight = this.batteries.slice(
      highestJoltageBatteryIndex + 1,
    );
    const maxJoltageToTheRight = Math.max(...batteriesToTheRight);

    return Number(`${highestJoltageBattery}${maxJoltageToTheRight}`);
  }
}

(async function () {
  const input = await getLinesFromFile("input.txt");
  const batteryBanks = input.map(
    (line) => new BatteryBank(Array.from(line).map(Number)),
  );

  const overallMaxJoltage = batteryBanks.reduce(
    mapReduceSum((x) => x.maximumJoltage),
    0,
  );

  console.log(overallMaxJoltage);
})();
