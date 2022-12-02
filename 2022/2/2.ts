import { getLinesFromFile } from '../utils';

abstract class Shape {
  protected constructor(public readonly opponentLetter: 'A' | 'B' | 'C', private readonly score: 1 | 2 | 3) {}

  public getScore(opponent: Shape): number {
    return this.getResultScore(opponent) + this.score;
  }

  protected abstract getResultScore(opponent: Shape): number;

  public abstract getMyShape(letter: 'X' | 'Y' | 'Z'): Shape;
}

class Rock extends Shape {
  constructor() {
    super('A', 1);
  }

  protected getResultScore(opponent: Shape): number {
    return opponent instanceof Rock ? 3 : opponent instanceof Paper ? 0 : 6;
  }

  public getMyShape(letter: 'X' | 'Y' | 'Z'): Shape {
    switch (letter) {
      case 'X':
        return new Scissors();
      case 'Y':
        return new Rock();
      case 'Z':
        return new Paper();
    }
  }
}

class Paper extends Shape {
  constructor() {
    super('B', 2);
  }

  protected getResultScore(opponent: Shape): number {
    return opponent instanceof Paper ? 3 : opponent instanceof Scissors ? 0 : 6;
  }

  public getMyShape(letter: 'X' | 'Y' | 'Z'): Shape {
    switch (letter) {
      case 'X':
        return new Rock();
      case 'Y':
        return new Paper();
      case 'Z':
        return new Scissors();
    }
  }
}

class Scissors extends Shape {
  constructor() {
    super('C', 3);
  }

  protected getResultScore(opponent: Shape): number {
    return opponent instanceof Scissors ? 3 : opponent instanceof Rock ? 0 : 6;
  }

  public getMyShape(letter: 'X' | 'Y' | 'Z'): Shape {
    switch (letter) {
      case 'X':
        return new Paper();
      case 'Y':
        return new Scissors();
      case 'Z':
        return new Rock();
    }
  }
}

const rock = new Rock();
const paper = new Paper();
const scissors = new Scissors();

const shapes = [rock, paper, scissors];

(async function () {
  const input = await getLinesFromFile('input.txt');

  const rounds = input.map(row => {
    const letters = row.split(' ') as ['A' | 'B' | 'C', 'X' | 'Y' | 'Z'];
    const opponentShape = shapes.find(x => x.opponentLetter === letters[0])!;
    return opponentShape.getMyShape(letters[1]).getScore(opponentShape);
  });

  const score = rounds.reduce((total, round) => total + round, 0);

  console.log(score);
})();
