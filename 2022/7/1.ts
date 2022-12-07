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

function directoriesSmallerThanOrEqualTo(directory: Directory, maxSize: number): number {
  let totalSize = 0;
  const directorySize = directory.size;

  if (directorySize <= maxSize)
    totalSize += directorySize;

  const directories = directory.contents.filter(isDirectory);

  directories.forEach(x => totalSize += directoriesSmallerThanOrEqualTo(x, maxSize));

  return totalSize;
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

  console.log(directoriesSmallerThanOrEqualTo(rootDirectory, 100000));
})();
