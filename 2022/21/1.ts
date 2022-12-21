import { readFileAsString } from '../utils';

interface Monkey {
  value: number;
}

class SimpleMonkey implements Monkey {
  constructor(public readonly value: number) {
  }
}

abstract class OperationMonkey implements Monkey {
  protected constructor(private readonly monkeyMap: ReadonlyMap<string, Monkey>, protected readonly operands: [string, string]) {
  }

  protected abstract operationResult(monkeys: [Monkey, Monkey]): number;

  public get value(): number {
    return this.operationResult([this.monkeyMap.get(this.operands[0])!, this.monkeyMap.get(this.operands[1])!]);
  }
}

class AdditionMonkey extends OperationMonkey {
  constructor(monkeyMap: ReadonlyMap<string, Monkey>, operands: [string, string]) {
    super(monkeyMap, operands);
  }

  protected operationResult(monkeys: [Monkey, Monkey]): number {
    return monkeys[0].value + monkeys[1].value;
  }
}

class SubtractionMonkey extends OperationMonkey {
  constructor(monkeyMap: ReadonlyMap<string, Monkey>, operands: [string, string]) {
    super(monkeyMap, operands);
  }

  protected operationResult(monkeys: [Monkey, Monkey]): number {
    return monkeys[0].value - monkeys[1].value;
  }
}

class MultiplicationMonkey extends OperationMonkey {
  constructor(monkeyMap: ReadonlyMap<string, Monkey>, operands: [string, string]) {
    super(monkeyMap, operands);
  }

  protected operationResult(monkeys: [Monkey, Monkey]): number {
    return monkeys[0].value * monkeys[1].value;
  }
}

class DivisionMonkey extends OperationMonkey {
  constructor(monkeyMap: ReadonlyMap<string, Monkey>, operands: [string, string]) {
    super(monkeyMap, operands);
  }

  protected operationResult(monkeys: [Monkey, Monkey]): number {
    return monkeys[0].value / monkeys[1].value;
  }
}

const inputRegex = /(?<name>.+): (?:(?<value>\d+)|(?<operand1>\w+) (?<operator>[+\-*\/]) (?<operand2>\w+))/g;

(async function () {
  const input = await readFileAsString('input.txt');
  const monkeyMap = new Map<string, Monkey>;

  for (const match of input.matchAll(inputRegex)) {
    let monkey: Monkey;

    if (match.groups!.value) {
      monkey = new SimpleMonkey(Number(match.groups!.value));
    } else {
      switch (match.groups!.operator) {
        case '+':
          monkey = new AdditionMonkey(monkeyMap, [match.groups!.operand1, match.groups!.operand2]);
          break;
        case '-':
          monkey = new SubtractionMonkey(monkeyMap, [match.groups!.operand1, match.groups!.operand2]);
          break;
        case '*':
          monkey = new MultiplicationMonkey(monkeyMap, [match.groups!.operand1, match.groups!.operand2]);
          break;
        case '/':
          monkey = new DivisionMonkey(monkeyMap, [match.groups!.operand1, match.groups!.operand2]);
      }
    }

    const name = match.groups!.name;

    monkeyMap.set(name, monkey!);
  }

  const result = monkeyMap.get('root')!;
  console.log(result.value);
})();
