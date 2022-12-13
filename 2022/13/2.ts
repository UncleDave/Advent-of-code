import { getLinesFromFile } from '../utils';

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
  const input = await getLinesFromFile('input.txt');
  const dividerPackets = [[[2]], [[6]]];
  const packets = input.map(x => JSON.parse(x) as Array<NumberOrArray>).concat(dividerPackets);

  packets.sort((left, right) => compare(left, right)! ? -1 : 1);

  const decoderKey = dividerPackets.map(x => packets.indexOf(x) + 1).reduce((total, current) => total * current, 1);

  console.log(decoderKey);
})();
