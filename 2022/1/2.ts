import { promises as fs } from 'fs';

(async function () {
  const fileContent = await fs.readFile('input.txt', { encoding: 'utf-8' });
  const elves = fileContent.split('\n\n');

  let calories = elves.map(
    elf => elf
      .split('\n')
      .reduce(((total, item) => total + +item), 0),
  );

  let caloriesCarriedByTopThree = 0;

  for (let i = 0; i < 3; i++) {
    const max = Math.max(...calories);
    caloriesCarriedByTopThree += max;
    calories = calories.filter(x => x !== max);
  }

  console.log(caloriesCarriedByTopThree);
})();
