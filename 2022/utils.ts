import { promises as fs } from 'fs';

export async function getLinesFromFile(filePath: string): Promise<string[]> {
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
  return fileContent.split('\n').filter(x => x !== '');
}

function mapByValue<T>(values: T[], selector: (value: T) => number, comparator: (...values: number[]) => number): T {
  const valuesForComparison = values.map(value => ({ value, comparisonValue: selector(value) }));
  return valuesForComparison.find(x => x.comparisonValue === comparator(...valuesForComparison.map(x => x.comparisonValue)))!.value;
}

export function mapMin<T>(values: T[], selector: (value: T) => number): T {
  return mapByValue(values, selector, Math.min);
}

export function mapMax<T>(values: T[], selector: (value: T) => number): T {
  return mapByValue(values, selector, Math.max);
}
