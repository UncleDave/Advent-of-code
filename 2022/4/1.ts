import { getLinesFromFile } from '../utils';

function doesRangeOverlap(elf: number[], otherElf: number[]): boolean {
  return (elf[0] >= otherElf[0] && elf[1] <= otherElf[1]) || (otherElf[0] >= elf[0] && otherElf[1] <= elf[1]);
}

(async function () {
  const input = await getLinesFromFile('input.txt');
  const elfPairs = input.map(pair => pair.split(',').map(elf => elf.split('-').map(id => Number(id))));
  const overlappingPairs = elfPairs.filter(([elf, otherElf]) => doesRangeOverlap(elf, otherElf));

  console.log(overlappingPairs.length);
})();
