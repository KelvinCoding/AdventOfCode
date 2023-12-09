import { getCurrentFilePath, getFileData } from "../../js-utils/getInput.mjs";

const __dirname = getCurrentFilePath(import.meta.url);
const input = getFileData(__dirname, "day03");

const testInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

/**
 * @param {string} input
 */
function solve(input) {
  const grid = input.split("\n");

  const numRows = grid.length;
  const numCols = grid[0].length;

  const isValidPosition = (row, col) =>
    row >= 0 && row < numRows && col >= 0 && col < numCols;

  const isSymbol = (char) => !(/^\d$/.test(char) || char === ".");

  const partNumbers = Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => [])
  );

  const sumOfPartNumbers = grid.reduce((sum, row, rowIndex) => {
    return (
      sum +
      [...row].reduce((rowSum, char, colIndex) => {
        if (!isNaN(char) && (colIndex === 0 || isNaN(row[colIndex - 1]))) {
          const numberStr = row.slice(colIndex).match(/^\d+/)[0];
          const number = parseInt(numberStr, 10);
          const endCol = colIndex + numberStr.length - 1;

          const isAdjacentToSymbol = Array.from({ length: 3 }).some((_, i) =>
            Array.from({ length: endCol - colIndex + 3 }).some((_, j) => {
              return (
                isValidPosition(rowIndex - 1 + i, colIndex - 1 + j) &&
                isSymbol(grid[rowIndex - 1 + i][colIndex - 1 + j]) &&
                partNumbers[rowIndex - 1 + i][colIndex - 1 + j].push(number)
              );
            })
          );

          return isAdjacentToSymbol ? rowSum + number : rowSum;
        }
        return rowSum;
      }, 0)
    );
  }, 0);

  const productOfSpecialSymbols = partNumbers.flat().reduce((product, cell) => {
    return cell.length === 2 ? product + cell[0] * cell[1] : product;
  }, 0);

  const result = { part1: sumOfPartNumbers, part2: productOfSpecialSymbols };

  console.log(result);
}

solve(testInput); // { part1: 4361, part2: 467835 }
solve(input); // { part1: 553825, part2: 93994191 }
