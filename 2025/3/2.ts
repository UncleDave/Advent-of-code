import { getLinesFromFile, mapReduceSum } from "../utils";

class BatteryBank {
  constructor(private readonly batteries: number[]) {}

  get maximumJoltage(): number {
    const highestJoltageBatteryIndices: number[] = [];

    for (let i = 11; i >= 0; i--) {
      const currentHighestJoltageBatteryIndex =
        highestJoltageBatteryIndices[highestJoltageBatteryIndices.length - 1] ??
        -1;

      const firstBatteryIndex = currentHighestJoltageBatteryIndex + 1;

      const applicableBatteries = this.batteries.slice(
        firstBatteryIndex,
        -i || undefined,
      );

      const highestJoltageBatteryIndex =
        BatteryBank.getHighestJoltageBatteryIndex(applicableBatteries);

      highestJoltageBatteryIndices.push(
        highestJoltageBatteryIndex + firstBatteryIndex,
      );
    }

    const highestJoltageBatteries = highestJoltageBatteryIndices.map(
      (x) => this.batteries[x],
    );

    return Number(
      highestJoltageBatteries.reduce(
        (result, battery) => `${result}${battery}`,
        "",
      ),
    );
  }

  private static getHighestJoltageBatteryIndex(batteries: number[]): number {
    return batteries.reduce((highestIndex, battery, i) => {
      const currentHighestJoltage = batteries[highestIndex];

      if (battery > currentHighestJoltage) {
        return i;
      }

      return highestIndex;
    }, 0);
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
