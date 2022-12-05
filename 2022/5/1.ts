import { promises as fs } from 'fs';

(async function () {
  const input = await fs.readFile('input.txt', { encoding: 'utf-8' });
  const [stackInput, instructionInput] = input.split('\n\n');
  const stacks: string[][] = [];

  for (let i = 1, stackIndex = 0; ; i += 4, stackIndex++) {
    const current = stackInput[i];

    if (Number(current))
      break;

    if (!stacks[stackIndex])
      stacks.push([]);

    if (current === ' ')
      continue;

    stacks[stackIndex].unshift(current);

    if (stackInput[i + 2] === '\n') {
      stackIndex = -1;
    }
  }

  const instructions = instructionInput.split('\n').filter(x => !!x).map(line => line.split(' ').filter(x => Number(x)).map(x => Number(x)));

  instructions.forEach(([quantity, origin, destination]) => {
    for (let i = 0; i < quantity; i++) {
      stacks[destination - 1].push(stacks[origin - 1].pop()!);
    }
  });

  console.log(stacks.map(x => x.pop()).join(''));
})();
