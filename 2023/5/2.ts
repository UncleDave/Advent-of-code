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
  return map.split("\n").map((x) => {
    const [destinationStart, sourceStart, length] = x.split(" ").map(Number);

    return {
      destinationStart,
      sourceStart,
      length,
    };
  });
}

function mapSourceId(sourceId: number, map: AlmanacMap): number {
  return sourceId >= map.sourceStart && sourceId < map.sourceStart + map.length
    ? sourceId - map.sourceStart + map.destinationStart
    : sourceId;
}

function getDestinationId(sourceId: number, maps: AlmanacMap[]): number {
  return (
    maps.map((map) => mapSourceId(sourceId, map)).find((x) => x !== sourceId) ??
    sourceId
  );
}

function getDestinationOverlap(sourceStart: number, length: number, maps: AlmanacMap[]): [number, number] {

}

const inputRegex =
  /seeds: +(?<seeds>(?:\d+ *)+)\s+seed-to-soil map:\n(?<seedToSoil>(?:\d+\s+)+)\nsoil-to-fertilizer map:\n(?<soilToFert>(?:\d+\s+)+)\nfertilizer-to-water map:\n(?<fertToWater>(?:\d+\s+)+)\water-to-light map:\n(?<waterToLight>(?:\d+\s+)+)\nlight-to-temperature map:\n(?<lightToTemp>(?:\d+\s+)+)\ntemperature-to-humidity map:\n(?<tempToHumid>(?:\d+\s+)+)\nhumidity-to-location map:\n(?<humidToLoc>(?:\d+\s+)+)/m;

(async function () {
  const input = await readFileAsString("./input.txt");
  const matchGroups = inputRegex.exec(input)?.groups;

  if (!matchGroups) {
    throw new Error("Invalid input");
  }

  const seedIds = pairwise(
    matchGroups.seeds.split(" ").map(Number),
    (start, length) => Array.from({ length }, (_, i) => start + i),
  ).flat();

  const seedToSoil = parseMap(matchGroups.seedToSoil);
  const soilToFert = parseMap(matchGroups.soilToFert);
  const fertToWater = parseMap(matchGroups.fertToWater);
  const waterToLight = parseMap(matchGroups.waterToLight);
  const lightToTemp = parseMap(matchGroups.lightToTemp);
  const tempToHumid = parseMap(matchGroups.tempToHumid);
  const humidToLoc = parseMap(matchGroups.humidToLoc);

  const seeds = seedIds.map((id) => {
    const soilId = getDestinationId(id, seedToSoil);
    const fertilizerId = getDestinationId(soilId, soilToFert);
    const waterId = getDestinationId(fertilizerId, fertToWater);
    const lightId = getDestinationId(waterId, waterToLight);
    const temperatureId = getDestinationId(lightId, lightToTemp);
    const humidityId = getDestinationId(temperatureId, tempToHumid);
    const locationId = getDestinationId(humidityId, humidToLoc);

    return {
      id,
      soilId,
      fertilizerId,
      waterId,
      lightId,
      temperatureId,
      humidityId,
      locationId,
    };
  });

  console.log(mapMin(seeds, (seed) => seed.locationId)?.locationId);
})();
