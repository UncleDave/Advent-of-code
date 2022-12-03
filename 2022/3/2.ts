import { getLinesFromFile } from '../utils';

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

(async function () {
  const rucksacks = await getLinesFromFile('input.txt');
  const teams: string[][] = [];

  for (let i = 0; i < rucksacks.length; i += 3) {
    teams.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]]);
  }

  const commonItems = teams.map(([first, ...rest]) => Array.from(first).filter(x => rest.every(rucksack => rucksack.indexOf(x) !== -1))[0]);
  const totalPriority = commonItems.reduce((total, item) => total + letters.indexOf(item) + 1, 0);

  console.log(totalPriority);
})();
