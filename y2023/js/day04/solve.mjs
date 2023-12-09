import { dirname } from "path";
import fs from "fs";

const __dirname = dirname(new URL(import.meta.url).pathname);

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf-8").trim();

const testInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

/**
 * @param {string} input
 */
function solve(input) {
  const games = input.split("\n");
  const { totalPoints, cardCopies } = games.reduce(
    (res, line) => {
      const [card, numbers] = line.split(": ");
      const cardNum = Number(card.split(" ").at(-1));
      const [winningNumStr, myNumStr] = numbers.split(" | ");

      /**
       * @type {Set<number>}
       */
      const winningNums = winningNumStr.split(" ").reduce((acc, numStr) => {
        if (!numStr.trim()) {
          return acc;
        }
        const num = Number(numStr.trim());
        acc.add(num);
        return acc;
      }, new Set());

      const myWinningCount = myNumStr.split(" ").reduce((acc, numStr) => {
        if (!numStr.trim()) {
          return acc;
        }
        const num = Number(numStr.trim());
        if (winningNums.has(num)) {
          acc += 1;
        }
        return acc;
      }, 0);

      const gameValue =
        myWinningCount === 0 ? 0 : Math.pow(2, myWinningCount - 1);

      res.totalPoints = res.totalPoints + gameValue;

      // How many copies to make of myself?
      const numGamesToCopy = res.cardCopies[cardNum - 1];

      for (let winsToAdd = 0; winsToAdd < myWinningCount; winsToAdd += 1) {
        res.cardCopies[winsToAdd + cardNum] += numGamesToCopy;
      }

      return res;
    },
    {
      totalPoints: 0,
      cardCopies: Array.from({ length: games.length }, () => 1),
    }
  );

  console.log({
    part1: totalPoints,
    part2: cardCopies.reduce((acc, wins) => acc + wins, 0),
  });
}

solve(testInput); // { part1: 13, part2: 30 }
solve(input); // { part1: 22193, part2: 5625994 }
