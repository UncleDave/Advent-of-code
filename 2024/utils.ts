import { promises as fs } from "fs";

export async function getLinesFromFile(filePath: string): Promise<string[]> {
  const fileContent = await readFileAsString(filePath);
  return fileContent.split("\n").filter((x) => x !== "");
}

export function readFileAsString(filePath: string): Promise<string> {
  return fs.readFile(filePath, { encoding: "utf-8" });
}

function mapByValue<T>(
  values: T[],
  selector: (value: T) => number,
  comparator: (...values: number[]) => number,
): T | undefined {
  const valuesForComparison = values.map((value) => ({
    value,
    comparisonValue: selector(value),
  }));
  return valuesForComparison.find(
    (x) =>
      x.comparisonValue ===
      comparator(...valuesForComparison.map((x) => x.comparisonValue)),
  )?.value;
}

export function mapMin<T>(
  values: T[],
  selector: (value: T) => number,
): T | undefined {
  return mapByValue(values, selector, Math.min);
}

export function mapMax<T>(
  values: T[],
  selector: (value: T) => number,
): T | undefined {
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
      this.write$ = this.startWriting().finally(
        () => (this.write$ = undefined),
      );
    }

    return this.write$;
  }

  private startWriting(): Promise<void> {
    const item = this.queue.shift();

    if (!item) return Promise.resolve();

    return new Promise<void>((resolve) => {
      process.stdout.cursorTo(...item.position, () => {
        process.stdout.write(item.value, () => {
          resolve();
        });
      });
    }).then(() => this.startWriting());
  }
}

// TODO: Refactor to generator or extend Array
export function pairwise<T, U>(
  arrayLike: ArrayLike<T>,
  mapper: (firstValue: T, secondValue: T) => U,
): U[] {
  const result: U[] = [];

  for (let i = 0; i < arrayLike.length; i += 2) {
    result.push(mapper(arrayLike[i], arrayLike[i + 1]));
  }

  return result;
}

type DistinctComparator<T> = (previousValue: T[], currentValue: T) => boolean;
const defaultDistinctComparator: DistinctComparator<any> = (
  previousValue,
  currentValue,
) => previousValue.indexOf(currentValue) === -1;

export function distinct<T>(
  previousValue: T[],
  currentValue: T,
  comparator: DistinctComparator<T> = defaultDistinctComparator,
): T[] {
  return comparator(previousValue, currentValue)
    ? [...previousValue, currentValue]
    : previousValue;
}

export function* permute<T>(value: T[]): Generator<T[]> {
  const length = value.length;
  const counter: number[] = Array(length).fill(0);
  let i = 1;

  yield value.slice();
  while (i < length) {
    if (counter[i] < i) {
      const k = i % 2 && counter[i];
      const p = value[i];
      value[i] = value[k];
      value[k] = p;
      ++counter[i];
      i = 1;
      yield value.slice();
    } else {
      counter[i] = 0;
      ++i;
    }
  }
}

export function permuteWithRepetition<T>(values: T[], length: number): T[][] {
  // @ts-ignore
  const replicateM = (n, f) => {
    // @ts-ignore
    const loop = (x) => (x <= 0 ? [[]] : liftA2(cons, f, loop(x - 1)));
    return loop(n);
  };

  // @ts-ignore
  const liftA2 = (f, a, b) => listApply(a.map(curry(f)), b);

  // @ts-ignore
  const listApply = (fs, xs) =>
    [].concat.apply(
      [],
      // @ts-ignore
      fs.map((f) =>
        [].concat.apply(
          [],
          // @ts-ignore
          xs.map((x) => [f(x)]),
        ),
      ),
    );

  // @ts-ignore
  const curry = (f) => (a) => (b) => f(a, b);

  // @ts-ignore
  const cons = (x, xs) => [x].concat(xs);

  return replicateM(length, values);
}

export function mapReduce<T, M, U>(
  mapper: (value: T) => M,
  reducer: (acc: U, current: M) => U,
) {
  return function mapReduce(acc: U, current: T): U {
    return reducer(acc, mapper(current));
  };
}

export function mapReduceSum<T>(mapper: (value: T) => number) {
  return mapReduce<T, number, number>(mapper, (acc, current) => acc + current);
}

export function mapReducePower<T>(mapper: (value: T) => number) {
  return mapReduce<T, number, number>(mapper, (acc, current) => acc * current);
}
