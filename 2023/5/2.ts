import { mapMin, pairwise, readFileAsString } from "../utils";

interface Seed {
  id: number;
  soilId: number;
  fertilizerId: number;
  waterId: number;
  lightId: number;
  temperatureId: number;
  humidityId: number;
  locationId: number;
}

interface AlmanacMap {
  destinationStart: number;
  sourceStart: number;
  length: number;
}

function parseMap(map: string): Array<AlmanacMap> {
  return map.trim().split("\n").map((x) => {
    const [destinationStart, sourceStart, length] = x.split(" ").map(Number);

    return {
      destinationStart,
      sourceStart,
      length,
    };
  });
}

function sortByDestinationStartAscending(a: AlmanacMap, b: AlmanacMap): number {
  return a.destinationStart - b.destinationStart;
}

function getSourceMapsInRange<
  T extends { destinationStart: number; length: number },
>(start: number, length: number, map: T[]): T[] {
  return map.filter(
    (x) => x.destinationStart >= start && x.destinationStart < start + length,
  );
}

const inputRegex =
  /seeds: +(?<seeds>(?:\d+ *)+)\s+seed-to-soil map:\n(?<seedToSoil>(?:\d+\s+)+)\nsoil-to-fertilizer map:\n(?<soilToFert>(?:\d+\s+)+)\nfertilizer-to-water map:\n(?<fertToWater>(?:\d+\s+)+)\water-to-light map:\n(?<waterToLight>(?:\d+\s+)+)\nlight-to-temperature map:\n(?<lightToTemp>(?:\d+\s+)+)\ntemperature-to-humidity map:\n(?<tempToHumid>(?:\d+\s+)+)\nhumidity-to-location map:\n(?<humidToLoc>(?:\d+\s+)+)/m;

(async function () {
  const input = await readFileAsString("./input.txt");
  const matchGroups = inputRegex.exec(input)?.groups;

  if (!matchGroups) {
    throw new Error("Invalid input");
  }

  const seedIdRanges = pairwise(
    matchGroups.seeds.split(" ").map(Number),
    (start, length) => [start, length],
  );

  const seedToSoil = parseMap(matchGroups.seedToSoil);
  const soilToFert = parseMap(matchGroups.soilToFert);
  const fertToWater = parseMap(matchGroups.fertToWater);
  const waterToLight = parseMap(matchGroups.waterToLight);
  const lightToTemp = parseMap(matchGroups.lightToTemp);
  const tempToHumid = parseMap(matchGroups.tempToHumid);
  const humidToLoc = parseMap(matchGroups.humidToLoc).sort(
    sortByDestinationStartAscending,
  );

  const lowestLocationMap = humidToLoc.find((x) => {
    const humidityMaps = getSourceMapsInRange(
      x.sourceStart,
      x.length,
      tempToHumid,
    );

    const tempMaps = humidityMaps.flatMap((humidityMap) =>
      getSourceMapsInRange(
        humidityMap.sourceStart,
        humidityMap.length,
        lightToTemp,
      ),
    );

    const lightMaps = tempMaps.flatMap((tempMap) =>
      getSourceMapsInRange(tempMap.sourceStart, tempMap.length, waterToLight),
    );

    const waterMaps = lightMaps.flatMap((lightMap) =>
      getSourceMapsInRange(lightMap.sourceStart, lightMap.length, fertToWater),
    );

    const fertMaps = waterMaps.flatMap((waterMap) =>
      getSourceMapsInRange(waterMap.sourceStart, waterMap.length, soilToFert),
    );

    const soilMaps = fertMaps.flatMap((fertMap) =>
      getSourceMapsInRange(fertMap.sourceStart, fertMap.length, seedToSoil),
    );

    const seedMaps = soilMaps.flatMap((soilMap) =>
      getSourceMapsInRange(
        soilMap.sourceStart,
        soilMap.length,
        seedIdRanges.map(([start, length]) => ({
          destinationStart: start,
          length,
        })),
      ),
    );
  });

  if (!lowestLocationMap) {
    throw new Error("No location found");
  }
})();
