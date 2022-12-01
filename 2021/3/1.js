import { getLinesFromFile } from '../utils.js';

const input = await getLinesFromFile('input.txt');
const numberLength = 12;
const accumulator = [];

for (let i = 0; i < numberLength; i++) {
  accumulator.push(0);
}

const countOfOnesPerColumn = input.reduce((acc, current) => {
  for (let i = 0; i < current.length; i++) {
    accumulator[i] += Number(current[i]);
  }

  return acc;
}, accumulator);


const gammaRate = countOfOnesPerColumn.reduce((acc, current) => acc + (current >= 500 ? '1' : '0'), '');
const epsilonRate = countOfOnesPerColumn.reduce((acc, current) => acc + (current >= 500 ? '0' : '1'), '');

const gammaRateDecimal = parseInt(gammaRate, 2);
const epsilonRateDecimal = parseInt(epsilonRate, 2);

const powerConsumption = gammaRateDecimal * epsilonRateDecimal;

console.log(powerConsumption);
