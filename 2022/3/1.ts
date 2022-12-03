import { getLinesFromFile } from '../utils';

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

(async function () {
  const rucksacks = await getLinesFromFile('input.txt');
  const compartments = rucksacks.map(x => [x.substring(0, x.length / 2), x.substring(x.length / 2)]);
  const misplacedTypes = compartments.reduce((types, [left, right]) => [...types, Array.from(left).filter(x => right.indexOf(x) !== -1)[0]], []);
  const totalPriority = misplacedTypes.reduce((total, item) => total + letters.indexOf(item) + 1, 0);

  console.log(totalPriority);
})();
