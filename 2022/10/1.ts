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

  const cycleSignalStrength: number[] = [];
  let register = 1;

  for (let cycle = 1, instructionCycle = 0, instructionIndex = 0; instructionIndex < instructions.length; cycle++) {
    const instruction = instructions[instructionIndex];

    cycleSignalStrength[cycle] = cycle * register;

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

  console.log(cycleSignalStrength[20] + cycleSignalStrength[60] + cycleSignalStrength[100] + cycleSignalStrength[140] + cycleSignalStrength[180] + cycleSignalStrength[220]);
})();
