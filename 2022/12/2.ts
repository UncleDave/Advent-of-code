import { getLinesFromFile } from '../utils';

type PriorityQueueComparator<T> = (a: T, b: T) => number;

class PriorityQueue<T> {
  constructor(private readonly comparator: PriorityQueueComparator<T>, private readonly items: T[] = []) {}

  push(...items: T[]): number {
    return this.items.push(...items);
  }

  pop(): T | undefined {
    return this.items.sort(this.comparator).shift();
  }

  peek(): T | undefined {
    return this.items.sort(this.comparator)[0];
  }

  includes(item: T): boolean {
    return this.items.includes(item);
  }

  remove(item: T) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}

class NodePriorityQueue extends PriorityQueue<Node> {
  private static readonly comparator: PriorityQueueComparator<Node> = (a, b) => b.distanceFromStartNode + b.distanceFromEndNode - a.distanceFromStartNode + a.distanceFromEndNode;

  constructor(...items: Node[]) {
    super(NodePriorityQueue.comparator, items);
  }
}

class Position {
  constructor(public readonly x: number, public readonly y: number) {}

  add(position: Position): Position;
  add(position: number[]): Position;
  add(position: number[] | Position): Position {
    if (position instanceof Array)
      return this.add(new Position(position[0], position[1]));

    return new Position(this.x + position.x, this.y + position.y);
  }

  distance(otherPosition: Position): number {
    const difference = this.add(new Position(-otherPosition.x, -otherPosition.y));
    return Math.abs(difference.x) + Math.abs(difference.y);
  }
}

class Node {
  public readonly height: number;
  public readonly position: Position;
  public distanceFromStartNode!: number;
  public distanceFromEndNode!: number;
  public neighbours!: Node[];
  public pathParent?: Node;

  constructor(public readonly character: string, position: [number, number]) {
    this.height = character.charCodeAt(0) - 97;
    this.position = new Position(...position);
  }

  distance(otherNode: Node): number {
    return this.position.distance(otherNode.position);
  }
}

class Graph {
  public readonly nodes: Node[] = [];
  private readonly endNode!: Node;

  constructor(input: string[]) {
    for (let i = 0; i < input.length; i++) {
      const row = input[i];

      for (let j = 0; j < row.length; j++) {
        const nodeLetter = row[j];
        const heightLetter = nodeLetter === 'S' ? 'a' : nodeLetter === 'E' ? 'z' : nodeLetter;

        const node = new Node(heightLetter, [i, j]);
        this.nodes.push(node);

        if (nodeLetter === 'E')
          this.endNode = node;
      }
    }

    this.nodes.forEach(node => {
      node.neighbours = this.nodeNeighbours(node);
      node.distanceFromEndNode = node.distance(this.endNode);
    });
  }

  routeDistance(startNode: Node): number {
    this.nodes.forEach(node => {
      node.distanceFromStartNode = node.distance(startNode);
      node.pathParent = undefined;
    });

    const open = new NodePriorityQueue(startNode);
    const closed: Node[] = [];

    while (open.peek() !== this.endNode && open.peek()) {
      const node = open.pop()!;
      closed.push(node);

      node.neighbours.forEach(otherNode => {
        const cost = node.distanceFromStartNode + 1;

        if (open.includes(otherNode) && cost < otherNode.distanceFromStartNode) {
          open.remove(otherNode);
        } else if (!open.includes(otherNode) && !closed.includes(otherNode)) {
          open.push(otherNode);
          otherNode.pathParent = node;
        }
      });
    }

    let result = 0;
    let node = this.endNode;

    while(node.pathParent) {
      result++;
      node = node.pathParent;
    }

    return result;
  }

  private nodeNeighbours(node: Node): Node[] {
    const possibleNeighbours = [this.nodeAt(node.position.add([-1, 0])), this.nodeAt(node.position.add([1, 0])), this.nodeAt(node.position.add([0, -1])), this.nodeAt(node.position.add([0, 1]))];
    const neighbours = possibleNeighbours.filter(x => x) as Node[];
    return neighbours.filter(x => node.height - x.height >= -1);
  }

  private nodeAt(position: Position): Node | undefined {
    return this.nodes.find(({ position: { x, y } }) => x === position.x && y === position.y);
  }
}

(async function () {
  const input = await getLinesFromFile('input.txt');
  const graph = new Graph(input);
  console.log(Math.min(...graph.nodes.filter(x => x.height === 0).map(x => graph.routeDistance(x)).filter(x => x)));
})();
