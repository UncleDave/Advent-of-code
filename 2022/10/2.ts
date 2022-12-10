import { getLinesFromFile } from '../utils';

type Operation = 'noop' | 'addx';

interface NoopInstruction {
  operation: 'noop';
}

interface AddInstruction {
  operation: 'addx';
  argument: number;
}

type Instruction = NoopInstruction | AddInstruction;

(async function () {
  const input = await getLinesFromFile('input.txt');
  const instructions = input.map<Instruction>(x => {
    const [operation, argument] = x.split(' ');

    return {
      operation: operation as Operation,
      argument: Number(argument),
    };
  });

  const screenWidth = 40;
  let register = 1;

  for (let cycle = 1, instructionCycle = 0, instructionIndex = 0, hPos = 0; instructionIndex < instructions.length; cycle++, hPos++) {
    const instruction = instructions[instructionIndex];

    if (hPos >= register - 1 && hPos <= register + 1)
      process.stdout.write('#');
    else
      process.stdout.write('.');

    if (hPos === screenWidth - 1) {
      hPos = -1;
      process.stdout.write('\n');
    }

    switch (instruction.operation) {
      case 'noop':
        instructionIndex++;
        break;
      case 'addx':
        switch (instructionCycle) {
          case 1:
            register += instruction.argument;
            instructionIndex++;
            instructionCycle = 0;
            break;
          default:
            instructionCycle++;
            break;
        }
    }
  }
})();
