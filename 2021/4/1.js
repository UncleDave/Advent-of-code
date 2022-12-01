import { getLinesFromFile } from '../utils.js';

const input = await getLinesFromFile('input.txt');
const numbers = input.splice(0, 1)[0].split(',');
const boardSize = 5;
const boards = [];

for (let i = 0; i < input.length; i += boardSize) {
  const board = [];

  for (let j = i; j < i + boardSize; j++) {
    const row = input[j];
    board.push(row.split(' ').filter(x => x !== '').map(x => ({ value: x, marked: false })));
  }

  boards.push(board);
}

for (const number of numbers) {
  const boardsContainingNumber = boards.filter(board => board.some(row => row.some(cell => cell.value === number)));

  if (boardsContainingNumber.some(board => {
    const row = board.find(row => row.some(x => x.value === number));
    const cell = row.find(cell => cell.value === number);
    const indexOfCell = row.findIndex(x => x === cell);
    const column = board.map(x => x[indexOfCell]);

    cell.marked = true;

    const hasFullRow = row.every(x => x.marked);
    const hasFullColumn = column.every(x => x.marked);

    if (hasFullRow || hasFullColumn) {
      const unmarkedTotal = board
        .flatMap(winningBoardRow => winningBoardRow.map(winningBoardCell => ({ ...winningBoardCell, value: Number(winningBoardCell.value) })))
        .filter(x => !x.marked)
        .reduce((unmarkedTotal, current) => unmarkedTotal + current.value, 0);

      console.log(unmarkedTotal * Number(number));
      return true;
    }
  })) break;
}
