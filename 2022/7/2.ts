import { promises as fs } from 'fs';

interface File {
  name: string;
  size: number;
}

class Directory implements File {
  public contents: Array<File | Directory> = [];

  constructor(public name: string, public parent?: Directory) {}

  get size(): number {
    return this.contents.reduce((total, current) => total + current.size, 0);
  }
}

const inputRegex = /\$ (?<command>\S+)(?: (?<arguments>.+))?\n(?<result>(?:[^$].+\n)+)?/g;

function isDirectory(fileOrDirectory: File | Directory): fileOrDirectory is Directory {
  return fileOrDirectory instanceof Directory;
}

function directoriesLargerThanOrEqualTo(directory: Directory, minSize: number): Directory[] {
  const result: Directory[] = [];

  if (directory.size >= minSize)
    result.push(directory);

  directory.contents.filter(isDirectory).forEach(x => result.push(...directoriesLargerThanOrEqualTo(x, minSize)));

  return result;
}

(async function () {
  const fileContent = await fs.readFile('input.txt', { encoding: 'utf-8' });
  const input = fileContent.matchAll(inputRegex);
  const rootDirectory = new Directory('/');
  let currentDirectory: Directory;

  for (let match of input) {
    switch (match.groups!.command) {
      case 'cd':
        const arg = match.groups!.arguments;

        switch (arg) {
          case '..':
            currentDirectory = currentDirectory!.parent!;
            break;
          case '/':
            currentDirectory = rootDirectory;
            break;
          default:
            currentDirectory = (currentDirectory!.contents.filter(isDirectory)).find(x => x.name === arg)!;
            break;
        }

        break;
      case 'ls':
        const contents = match.groups!.result.split('\n').filter(x => x).map(x => x.split(' '));

        contents.forEach(([dirOrSize, name]) => {
          switch (dirOrSize) {
            case 'dir':
              const newDirectory = new Directory(name, currentDirectory);
              currentDirectory.contents.push(newDirectory);
              break;
            default:
              currentDirectory.contents.push({ name, size: +dirOrSize });
              break;
          }
        });

        break;
    }
  }

  const capacity = 70000000;
  const requiredSpace = 30000000;
  const usedSpace = rootDirectory.size;
  const unusedSpace = capacity - usedSpace;
  const spaceToReclaim = requiredSpace - unusedSpace;
  const directoriesLargeEnough = directoriesLargerThanOrEqualTo(rootDirectory, spaceToReclaim).sort((a, b) => b.size < a.size ? 1 : -1);

  console.log(directoriesLargeEnough[0].size);
})();
