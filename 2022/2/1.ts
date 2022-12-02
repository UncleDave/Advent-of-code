import { getLinesFromFile } from '../utils';

abstract class Shape {
  protected constructor(public readonly opponentLetter: 'A' | 'B' | 'C', public readonly myLetter: 'X' | 'Y' | 'Z', private readonly score: 1 | 2 | 3) {}

  public getScore(opponent: Shape): number {
    return this.getResultScore(opponent) + this.score;
  }

  protected abstract getResultScore(opponent: Shape): number;
}

class Rock extends Shape {
  constructor() {
    super('A', 'X', 1);
  }

  protected getResultScore(opponent: Shape): number {
    return opponent instanceof Rock ? 3 : opponent instanceof Paper ? 0 : 6;
  }
}

class Paper extends Shape {
  constructor() {
    super('B', 'Y', 2);
  }

  protected getResultScore(opponent: Shape): number {
    return opponent instanceof Paper ? 3 : opponent instanceof Scissors ? 0 : 6;
  }
}

class Scissors extends Shape {
  constructor() {
    super('C', 'Z', 3);
  }

  protected getResultScore(opponent: Shape): number {
    return opponent instanceof Scissors ? 3 : opponent instanceof Rock ? 0 : 6;
  }
}

const rock = new Rock();
const paper = new Paper();
const scissors = new Scissors();

const shapes = [rock, paper, scissors];

(async function () {
  const input = await getLinesFromFile('input.txt');

  const rounds = input.map(row => {
    const letters = row.split(' ');
    return [shapes.find(x => x.opponentLetter === letters[0])!, shapes.find(x => x.myLetter === letters[1])!];
  });

  const score = rounds.reduce((total, round) => total + round[1].getScore(round[0]), 0);

  console.log(score);
})();
