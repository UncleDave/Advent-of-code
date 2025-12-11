import { getLinesFromFile } from "../utils";

const start = "you";
const end = "out";

interface ServerRack {
  name: string;
  outputs: string[];
}

function dfs(
  graph: Record<string, string[]>,
  start: string,
  visited: string[],
  pathCount: number,
): number {
  if (start === end) {
    return pathCount + 1;
  }

  visited.push(start);

  for (const neighbour of graph[start] || []) {
    if (!visited.includes(neighbour)) {
      pathCount = dfs(graph, neighbour, [...visited], pathCount);
    }
  }

  return pathCount;
}

(async function () {
  const input = await getLinesFromFile("input.txt");

  const racks = input.map<ServerRack>((rack) => {
    const [name, outputs] = rack.split(": ");

    return {
      name,
      outputs: outputs.split(" "),
    };
  });

  const graph = racks.reduce(
    (graph, rack) => {
      graph[rack.name] = rack.outputs;
      return graph;
    },
    {} as Record<string, string[]>,
  );

  const result = dfs(graph, start, [], 0);
  console.log(result);
})();
