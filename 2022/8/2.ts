import { getLinesFromFile } from '../utils';

function getViewDistance(tree: number, trees: number[]): number {
  let result = 0;

  for (let i = 0; i < trees.length; i++) {
    result++;

    if (trees[i] >= tree) break;
  }

  return result;
}

(async function () {
  const rows = (await getLinesFromFile('input.txt')).map(row => Array.from(row).map(x => Number(x)));
  const columns: number[][] = [];

  for (let i = 0; i < rows[0].length; i++) {
    columns.push(rows.map(x => x[i]));
  }

  const highestScenicScore = rows.reduce((highScore, row, rowIndex) => {
    for (let i = 0; i < row.length; i++) {
      const tree = row[i];
      const column = columns[i];

      const treesLeft = row.slice(0, i).reverse();
      const treesRight = row.slice(i + 1);
      const treesAbove = column.slice(0, rowIndex).reverse();
      const treesBelow = column.slice(rowIndex + 1);

      const scenicScore = getViewDistance(tree, treesLeft) * getViewDistance(tree, treesRight) * getViewDistance(tree, treesAbove) * getViewDistance(tree, treesBelow);

      if (scenicScore > highScore)
        highScore = scenicScore;
    }

    return highScore;
  }, 0);

  console.log(highestScenicScore);
})();
