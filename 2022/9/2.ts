import { getLinesFromFile } from '../utils';

type Direction = 'U' | 'R' | 'D' | 'L';

interface Instruction {
  direction: Direction;
  steps: number;
}

type Position = [number, number];

function applyMovement(direction: Direction, position: Position) {
  switch (direction) {
    case 'U':
      position[1]++;
      break;
    case 'R':
      position[0]++;
      break;
    case 'D':
      position[1]--;
      break;
    case 'L':
      position[0]--;
      break;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

(async function () {
  const input = await getLinesFromFile('input.txt');

  const instructions = input.map<Instruction>(x => {
    const [direction, steps] = x.split(' ') as [Direction, string];

    return {
      direction,
      steps: Number(steps),
    };
  });

  const headKnot: Position = [0, 0];
  const knots = Array.from({ length: 9 }, () => [0, 0] as Position);
  const lastKnot = knots[knots.length - 1];
  const lastKnotVisitedPositions: Position[] = [[0, 0]];

  function pushIfUnique(position: Position) {
    const [x, y] = position;

    if (!lastKnotVisitedPositions.find(([otherX, otherY]) => otherX === x && otherY === y))
      lastKnotVisitedPositions.push([x, y]);
  }

  instructions.forEach(({ direction, steps }) => {
    for (let i = 0; i < steps; i++) {
      applyMovement(direction, headKnot);

      knots.forEach((knot, j) => {
        const previousKnot = knots[j - 1] ?? headKnot;
        const xDistance = Math.abs(previousKnot[0] - knot[0]);
        const yDistance = Math.abs(previousKnot[1] - knot[1]);

        if (xDistance > 1 || yDistance > 1) {
          knot[0] += clamp(previousKnot[0] - knot[0], -1, 1);
          knot[1] += clamp(previousKnot[1] - knot[1], -1, 1);
        }
      });

      pushIfUnique(lastKnot);
    }
  });

  console.log(lastKnotVisitedPositions.length);
})();
