import { getLinesFromFile } from '../utils';

type OperationSymbol = '+' | '*';

class Monkey {
  public readonly items: number[];
  public inspectCount = 0;
  public readonly testDivisor: number;

  private readonly operationSymbol: OperationSymbol;
  private readonly operationOperand?: number;
  private readonly testPassTarget: number;
  private readonly testFailTarget: number;

  constructor(monkeyInput: string[]) {
    this.items = monkeyInput[0].split(': ')[1].split(', ').map(Number);

    const operationBody = monkeyInput[1].split(' ');
    this.operationSymbol = operationBody[operationBody.length - 2] as OperationSymbol;

    const operationOperand = operationBody[operationBody.length - 1];
    this.operationOperand = !isNaN(Number(operationOperand)) ? Number(operationOperand) : undefined;

    this.testDivisor = Number(monkeyInput[2].split('by ')[1]);
    this.testPassTarget = Number(monkeyInput[3].split('monkey ')[1]);
    this.testFailTarget = Number(monkeyInput[4].split('monkey ')[1]);
  }

  inspectItem(item: number): number {
    this.inspectCount++;
    const operand = this.operationOperand ?? item;

    switch (this.operationSymbol) {
      case '*':
        return item * operand;
      case '+':
        return item + operand;
    }
  }

  test(stressLevel: number): number {
    return stressLevel % this.testDivisor === 0 ? this.testPassTarget : this.testFailTarget;
  }
}

(async function () {
  const input = await getLinesFromFile('input.txt');
  const monkeyInputBlocks: string[][] = [];

  for (let i = 1; i < input.length; i += 6) {
    monkeyInputBlocks.push(input.slice(i, i + 5));
  }

  const monkeys = monkeyInputBlocks.map(x => new Monkey(x));
  const productOfDivisors = monkeys.map(x => x.testDivisor).reduce((total, curr) => total * curr, 1);
  const rounds = 10000;

  for (let i = 0; i < rounds; i++) {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const stress = monkey.inspectItem(item);
        const targetMonkey = monkey.test(stress);
        monkeys[targetMonkey].items.push(stress % productOfDivisors);
      });

      monkey.items.length = 0;
    });
  }

  monkeys.sort((a, b) => b.inspectCount - a.inspectCount);

  console.log(monkeys[0].inspectCount * monkeys[1].inspectCount);
})();
