import { getLinesFromFile } from '../utils';

// This was an attempt to brute force the solution with B I G G E R I N T S.
// Kept for posterity and out of respect for the absolute insanity of what I was attempting to accomplish here.

type OperationSymbol = '+' | '*';

class BiggerInt {
  private readonly value: string;

  constructor(value: string) {
    this.value = Array.from(value).reverse().join('');
  }

  add(otherValue: BiggerInt): BiggerInt {
    const largest = this.value.length >= otherValue.value.length ? this : otherValue;
    const smallest = largest === this ? otherValue : this;
    const newValue: string[] = [];

    let carry = 0;
    for (let i = 0; i < largest.value.length; i++) {
      const left = Number(largest.value[i]);
      const right = Number(smallest.value[i]);

      if (isNaN(right) && !carry) {
        newValue.push(...largest.value.slice(i));
        break;
      }

      let result = left + (right || 0) + carry;

      carry = 0;

      if (result > 9) {
        result -= 10;
        carry = 1;
      }

      newValue.push(result.toString());
    }

    if (carry)
      newValue.push('1');

    return new BiggerInt(newValue.reverse().join(''));
  }

  subtract(otherValue: BiggerInt): BiggerInt {
    const newValue: string[] = [];

    let carry = 0;
    for (let i = 0; i < this.value.length; i++) {
      const left = Number(this.value[i]);
      const right = Number(otherValue.value[i]);

      let result = left - (right || 0) - carry;

      carry = 0;

      if (result < 0) {
        carry = 1;
        result += 10;
      }

      newValue.push(result.toString());
    }

    return new BiggerInt(BiggerInt.trimStart(newValue.reverse().join('')));
  }

  multiply(otherValue: BiggerInt): BiggerInt {
    let result = new BiggerInt('0');

    while (otherValue.value !== '0') {
      result = result.add(this);
      otherValue = otherValue.subtract(new BiggerInt('1'));
    }

    return result;
  }

  toNumber(): number {
    return Number(Array.from(this.value).reverse().join(''));
  }

  modulo(divisor: BiggerInt): number {
    let dividend: BiggerInt = this;

    while (dividend.toNumber() >= divisor.toNumber()) {
      dividend = dividend.subtract(divisor);
    }

    return dividend.toNumber();
  }

  private static trimStart(value: string): string {
    let start = 0;

    while (start < value.length - 1 && value[start] === '0')
      start++;

    return start > 0 ? value.substring(start) : value;
  }
}

class Monkey {
  public readonly items: BiggerInt[];
  public inspectCount = 0;

  private readonly operationSymbol: OperationSymbol;
  private readonly operationOperand?: BiggerInt;
  private readonly testDivisor: BiggerInt;
  private readonly testPassTarget: number;
  private readonly testFailTarget: number;

  constructor(monkeyInput: string[]) {
    this.items = monkeyInput[0].split(': ')[1].split(', ').map(x => new BiggerInt(x));

    const operationBody = monkeyInput[1].split(' ');
    this.operationSymbol = operationBody[operationBody.length - 2] as OperationSymbol;

    const operationOperand = operationBody[operationBody.length - 1];
    this.operationOperand = !isNaN(Number(operationOperand)) ? new BiggerInt(operationOperand) : undefined;

    this.testDivisor = new BiggerInt(monkeyInput[2].split('by ')[1]);
    this.testPassTarget = Number(monkeyInput[3].split('monkey ')[1]);
    this.testFailTarget = Number(monkeyInput[4].split('monkey ')[1]);
  }

  inspectItem(item: BiggerInt): BiggerInt {
    this.inspectCount++;
    const operand = this.operationOperand ?? item;

    switch (this.operationSymbol) {
      case '*':
        return item.multiply(operand);
      case '+':
        return item.add(operand);
    }
  }

  test(stressLevel: BiggerInt): number {
    return stressLevel.modulo(this.testDivisor) === 0 ? this.testPassTarget : this.testFailTarget;
  }
}

(async function () {
  const input = await getLinesFromFile('input.txt');
  const monkeyInputBlocks: string[][] = [];

  for (let i = 1; i < input.length; i += 6) {
    monkeyInputBlocks.push(input.slice(i, i + 5));
  }

  const monkeys = monkeyInputBlocks.map(x => new Monkey(x));
  const rounds = 10000;

  for (let i = 0; i < rounds; i++) {
    console.log('Round', i);

    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        const stress = monkey.inspectItem(item);
        const targetMonkey = monkey.test(stress);
        monkeys[targetMonkey].items.push(stress);
      });

      monkey.items.length = 0;
    });
  }

  monkeys.sort((a, b) => b.inspectCount - a.inspectCount);

  console.log(monkeys[0].inspectCount * monkeys[1].inspectCount);
})();
