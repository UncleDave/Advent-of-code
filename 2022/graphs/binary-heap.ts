export type Comparator<T> = (a: T, b: T) => number;

export interface PriorityQueue<T> {
  push(value: T): void;

  pop(): T | undefined;

  peek(): T | undefined;
}

export class BinaryHeap<T> implements PriorityQueue<T> {
  private readonly values: T[] = [];

  constructor(comparator: Comparator<T>);
  constructor(comparator: Comparator<T>, values: T[]);
  constructor(private readonly comparator: Comparator<T>, values?: T[]) {
    if (values) {
      this.values = [...values];
      for (let i = Math.floor(this.values.length / 2) - 1; i >= 0; i--) {
        this.siftDown(i);
      }
    }
  }

  push(value: T) {
    const i = this.values.push(value) - 1;
    this.siftUp(i);
  }

  pop(): T | undefined {
    const result = this.values.shift();

    if (this.values.length > 1) {
      this.values.unshift(this.values.pop()!);
      this.siftDown(0);
    }

    return result;
  }

  peek(): T | undefined {
    return this.values[0];
  }

  private siftUp(i: number) {
    let parentIndex = this.parentIndex(i);

    while (i > 0 && this.comparator(this.values[i], this.values[parentIndex]) < 0) {
      [this.values[i], this.values[parentIndex]] = [this.values[parentIndex], this.values[i]];
      i = parentIndex;
      parentIndex = this.parentIndex(i);
    }
  }

  private siftDown(i: number) {
    while (true) {
      const leftIndex = this.leftIndex(i);
      const rightIndex = this.rightIndex(i);
      let indexToSwap: number | undefined = undefined;

      if (leftIndex < this.values.length && this.comparator(this.values[i], this.values[leftIndex]) > 0)
        indexToSwap = leftIndex;

      if (rightIndex < this.values.length && this.comparator(indexToSwap === undefined ? this.values[i] : this.values[leftIndex], this.values[rightIndex]) > 0)
        indexToSwap = rightIndex;

      if (indexToSwap === undefined) break;

      [this.values[i], this.values[indexToSwap]] = [this.values[indexToSwap], this.values[i]];
      i = indexToSwap;
    }
  }

  private parentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private leftIndex(i: number): number {
    return (i + 1) * 2 - 1;
  }

  private rightIndex(i: number): number {
    return (i + 1) * 2;
  }
}
