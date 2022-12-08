import { getLinesFromFile } from '../utils';

(async function () {
  const rows = (await getLinesFromFile('input.txt')).map(row => Array.from(row).map(x => Number(x)));
  const columns: number[][] = [];

  for (let i = 0; i < rows[0].length; i++) {
    columns.push(rows.map(x => x[i]));
  }

  const visibleTrees = rows.reduce((visibleTrees, row, rowIndex) => {
    for (let i = 0; i < row.length; i++) {
      const tree = row[i];
      const column = columns[i];

      const treesLeft = row.slice(0, i);
      const treesRight = row.slice(i + 1);
      const horizontallyVisible = [treesLeft, treesRight].some(trees => trees.every(x => x < tree));

      const treesAbove = column.slice(0, rowIndex);
      const treesBelow = column.slice(rowIndex + 1);
      const verticallyVisible = [treesAbove, treesBelow].some(trees => trees.every(x => x < tree));

      if (horizontallyVisible || verticallyVisible)
        visibleTrees.push(tree);
    }

    return visibleTrees;
  }, []);

  console.log(visibleTrees.length);
})();
