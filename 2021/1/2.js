import { getLinesFromFile } from '../utils.js';

const input = await getLinesFromFile('input.txt');

const result = input
  .map(Number)
  .reduce((acc, x, i, all) => {
    const group = [all[i], all[i + 1], all [i + 2]];

    acc.push(group);

    return acc;
  }, [])
  .reduce((counts, x) => {
    if (x.length < 3 || !x.every(entry => entry)) return counts;

    counts.push(x[0] + x[1] + x[2]);

    return counts;
  }, [])
  .reduce((largerCount, x, i, all) => {
    if (i === 0) return largerCount;

    if (x > all[i - 1]) return largerCount + 1;

    return largerCount;
  }, 0);

console.log(result);
