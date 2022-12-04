import { getLinesFromFile } from '../utils';

(async function () {
  const input = await getLinesFromFile('input.txt');
  const elfPairs = input.map(pair => pair.split(',').map(elf => {
    const [start, end] = elf.split('-').map(id => Number(id));
    const middle: number[] = [];

    for (let i = start + 1; i < end; i++) {
      middle.push(i);
    }

    return [start, ...middle, end];
  }));

  const overlappingPairs = elfPairs.filter(([elf, otherElf]) => elf.some(x => otherElf.indexOf(x) !== -1));

  console.log(overlappingPairs.length);
})();
