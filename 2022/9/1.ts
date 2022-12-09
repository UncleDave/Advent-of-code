import { getLinesFromFile } from '../utils';

type Direction = 'U' | 'R' | 'D' | 'L';

interface Instruction {
  direction: Direction;
  steps: number;
}

type Position = [number, number];

function distanceBetweenPositions(positionA: Position, positionB: Position): number {
  return Math.abs(positionA[0] - positionB[0]) + Math.abs(positionA[1] - positionB[1]);
}

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

(async function () {
  const input = await getLinesFromFile('input.txt');

  const instructions = input.map<Instruction>(x => {
    const [direction, steps] = x.split(' ') as [Direction, string];

    return {
      direction,
      steps: Number(steps),
    };
  });

  const headPosition: Position = [0, 0];
  const tailPosition: Position = [0, 0];
  const visitedPositions: Position[] = [[0, 0]];

  function pushIfUnique(position: Position) {
    const [x, y] = position;

    if (!visitedPositions.find(([otherX, otherY]) => otherX === x && otherY === y))
      visitedPositions.push([x, y]);
  }

  instructions.forEach(({ direction, steps }) => {
    let previousHeadPosition: Position;

    for (let i = 0; i < steps; i++) {
      previousHeadPosition = [...headPosition];
      applyMovement(direction, headPosition);

      const distance = distanceBetweenPositions(headPosition, tailPosition);

      if (distance === 2 && (Math.abs(headPosition[0] - tailPosition[0]) === 2 || Math.abs(headPosition[1] - tailPosition[1]) === 2)) {
        applyMovement(direction, tailPosition);
      } else if (distance === 3) {
        tailPosition[0] = previousHeadPosition[0];
        tailPosition[1] = previousHeadPosition[1];
      }

      pushIfUnique(tailPosition);
    }
  });

  console.log(visitedPositions.length);
})();
