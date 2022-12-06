import { promises as fs } from 'fs';

function everyCharIsUnique(chars: string): boolean {
  const uniqueChars: string[] = [];

  for (let char of chars) {
    if (uniqueChars.indexOf(char) !== -1)
      return false;

    uniqueChars.push(char);
  }

  return true;
}

(async function () {
  const fileContent = await fs.readFile('input.txt', { encoding: 'utf-8' });
  const input = fileContent.replaceAll('\n', '');
  let firstMarkerIndex = -1;

  for (let i = 13; i < input.length; i++) {
    if (everyCharIsUnique(input.substring(i - 13, i + 1))) {
      firstMarkerIndex = i + 1;
      break;
    }
  }

  console.log(firstMarkerIndex);
})();
