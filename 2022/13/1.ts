import { promises as fs } from 'fs';

type NumberOrArray = number | Array<NumberOrArray>;

function compare(left: NumberOrArray, right: NumberOrArray): boolean | undefined {
  if (typeof left === 'number' && typeof right === 'number')
    return left === right ? undefined : left < right;

  if (left instanceof Array && right instanceof Array) {
    for (let i = 0; i < left.length; i++) {
      if (right[i] === undefined)
        return false;

      const comparisonResult = compare(left[i], right[i]);

      if (comparisonResult !== undefined)
        return comparisonResult;
    }

    if (left.length === right.length)
      return undefined;

    return true;
  }

  return typeof left === 'number' ? compare([left], right) : compare(left, [right]);
}

(async function () {
  const input = await fs.readFile('input.txt', { encoding: 'utf-8' });
  const pairsInput = input.split('\n\n');

  const pairs = pairsInput.map(pairInput => {
    const packetsInput = pairInput.split('\n').filter(x => x !== '');
    return packetsInput.map(x => JSON.parse(x) as Array<NumberOrArray>) as [Array<NumberOrArray>, Array<NumberOrArray>];
  });

  const sumOfPairsInCorrectOrder = pairs.reduce((total, pair, index) => {
    const [left, right] = pair;

    if (compare(left, right))
      return total + index + 1;

    return total;
  }, 0);

  console.log(sumOfPairsInCorrectOrder);
})();
