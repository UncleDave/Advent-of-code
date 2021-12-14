import { getLinesFromFile } from '../utils';

const input = await getLinesFromFile('input.txt');

const finalPosition = input
  .map(x => x.split(' '))
  .map(([instruction, power]) => [instruction, Number(power)])
  .reduce(([h, d], [instruction, power]) => {
    switch (instruction) {
      case 'forward':
        return [h + power, d];
      case 'up':
        return [h, d - power];
      case 'down':
        return [h, d + power];
    }
  }, [0, 0]);

const result = finalPosition[0] * finalPosition[1];

console.log(result);
