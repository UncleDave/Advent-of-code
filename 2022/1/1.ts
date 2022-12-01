import { promises as fs } from 'fs';

(async function () {
  const fileContent = await fs.readFile('input.txt', { encoding: 'utf-8' });
  const elves = fileContent.split('\n\n');

  const calories = elves.map(
    elf => elf
      .split('\n')
      .reduce(((total, item) => total + +item), 0),
  );

  console.log(Math.max(...calories));
})();
