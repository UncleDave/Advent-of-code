import { getLinesFromFile } from '../utils';

type Operation = (item: number) => number;

class Monkey {
  public readonly items: number[];
  public readonly inspectItem: Operation;
  public inspectCount = 0;

  private readonly testDivisor: number;
  private readonly testPassTarget: number;
  private readonly testFailTarget: number;

  constructor(monkeyInput: string[]) {
    this.items = monkeyInput[0].split(': ')[1].split(', ').map(Number);

    const operationBody = monkeyInput[1].split(': ')[1];
    this.inspectItem = eval(`(old) => {
      this.inspectCount++;
      const x${ operationBody };
      return xnew;
    }`);

    this.testDivisor = Number(monkeyInput[2].split('by ')[1]);
    this.testPassTarget = Number(monkeyInput[3].split('monkey ')[1]);
    this.testFailTarget = Number(monkeyInput[4].split('monkey ')[1]);
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
  const rounds = 20;

  for (let i = 0; i < rounds; i++) {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const stress = Math.floor(monkey.inspectItem(item) / 3);
        const targetMonkey = monkey.test(stress);
        monkeys[targetMonkey].items.push(stress);
      });

      monkey.items.length = 0;
    });
  }

  monkeys.sort((a, b) => b.inspectCount - a.inspectCount);

  console.log(monkeys[0].inspectCount * monkeys[1].inspectCount);
})();
