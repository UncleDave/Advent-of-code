import { getLinesFromFile } from "../utils";

interface Machine {
  desiredLightState: number;
  buttonMasks: number[];
  lightCount: number;
}

function bfs(
  desiredState: number,
  buttonMasks: number[],
  lightCount: number,
): number {
  const initialState = 0;
  const maxStates = 1 << lightCount;
  const visited = Array(maxStates).fill(-1);
  const queue: number[] = [];

  visited[initialState] = 0;
  queue.push(initialState);

  while (queue.length > 0) {
    const currentState = queue.shift()!;

    if (currentState === desiredState) {
      return visited[currentState];
    }

    for (const buttonMask of buttonMasks) {
      const nextState = currentState ^ buttonMask;

      if (visited[nextState] === -1) {
        visited[nextState] = visited[currentState] + 1;
        queue.push(nextState);
      }
    }
  }

  return -1;
}

function parseMachine(line: string): Machine {
  const parts = line.trim().split(" ");
  const lights = Array.from(parts[0].slice(1, -1));

  const desiredLightState = lights.reduce(
    (mask, char, index) => (char === "#" ? mask | (1 << index) : mask),
    0,
  );

  const buttonMasks = Array.from(parts.slice(1, -1)).map((group) => {
    const indices = group.slice(1, -1).split(",").map(Number);
    let mask = 0;

    for (const idx of indices) {
      mask |= 1 << idx;
    }

    return mask;
  });

  return {
    desiredLightState,
    buttonMasks,
    lightCount: lights.length,
  };
}

(async function () {
  const input = await getLinesFromFile("input.txt");
  const machines = input.map(parseMachine);

  const totalButtonsPressed = machines.reduce((sum, machine, i) => {
    console.log(`Processing machine ${i + 1}/${machines.length}...`);

    return sum + bfs(
      machine.desiredLightState,
      machine.buttonMasks,
      machine.lightCount
    );
  }, 0);

  console.log(`Total buttons pressed: ${totalButtonsPressed}`);
})();
