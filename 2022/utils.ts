import { promises as fs } from 'fs';

export async function getLinesFromFile(filePath: string): Promise<string[]> {
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
  return fileContent.split('\n').filter(x => x !== '');
}

function mapByValue<T>(values: T[], selector: (value: T) => number, comparator: (...values: number[]) => number): T | undefined {
  const valuesForComparison = values.map(value => ({ value, comparisonValue: selector(value) }));
  return valuesForComparison.find(x => x.comparisonValue === comparator(...valuesForComparison.map(x => x.comparisonValue)))?.value;
}

export function mapMin<T>(values: T[], selector: (value: T) => number): T | undefined {
  return mapByValue(values, selector, Math.min);
}

export function mapMax<T>(values: T[], selector: (value: T) => number): T | undefined {
  return mapByValue(values, selector, Math.max);
}

interface SequentialLoggerQueueItem {
  value: string;
  position: [number, number];
}

export class SequentialLogger {
  private readonly queue: SequentialLoggerQueueItem[] = [];
  private write$?: Promise<void>;

  enqueue(value: string, position: [number, number]) {
    this.queue.push({
      value,
      position,
    });
  }

  write(): Promise<void> {
    if (!this.write$) {
      this.write$ = this.startWriting().finally(() => this.write$ = undefined);
    }

    return this.write$;
  }

  private startWriting(): Promise<void> {
    const item = this.queue.shift();

    if (!item) return Promise.resolve();

    return new Promise<void>(resolve => {
      process.stdout.cursorTo(...item.position, () => {
        process.stdout.write(item.value, () => {
          resolve();
        });
      });
    })
      .then(() => this.startWriting());
  }
}

export function pairwise<T, U>(arrayLike: ArrayLike<T>, mapper: (firstValue: T, secondValue: T) => U): U[] {
  const result: U[] = [];

  for (let i = 0; i < arrayLike.length; i += 2) {
    result.push(mapper(arrayLike[i], arrayLike[i + 1]));
  }

  return result;
}

type DistinctComparator<T> = (previousValue: T[], currentValue: T) => boolean;
const defaultDistinctComparator: DistinctComparator<any> = (previousValue, currentValue) => previousValue.indexOf(currentValue) === -1;

export function distinct<T>(previousValue: T[], currentValue: T, comparator: DistinctComparator<T> = defaultDistinctComparator): T[] {
  return comparator(previousValue, currentValue) ? [...previousValue, currentValue] : previousValue;
}
