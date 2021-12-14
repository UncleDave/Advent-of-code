import { getLinesFromFile } from '../utils';

const input = await getLinesFromFile('input.txt');
const numberLength = 12;

function getMostCommonValue(values) {
  return values.filter(x => x === '1').length >= values.length / 2 ? '1' : '0';
}

function getMatchingNumber(startNumbers, useMostCommonValue) {
  let pattern = '';
  let validNumbers = startNumbers;

  for (let i = 0; i < numberLength; i++) {
    const mostCommonValue = getMostCommonValue(validNumbers.map(x => x[i]));
    pattern += useMostCommonValue ? mostCommonValue : mostCommonValue === '1' ? '0' : '1';
    validNumbers = validNumbers.filter(x => x.startsWith(pattern));

    if (validNumbers.length === 1) return validNumbers[0];
  }
}

const oxygenGeneratorRatingDecimal = parseInt(getMatchingNumber(input, true), 2);
const co2ScrubberRatingDecimal = parseInt(getMatchingNumber(input, false), 2);

console.log(oxygenGeneratorRatingDecimal * co2ScrubberRatingDecimal);
