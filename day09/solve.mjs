import { dirname } from "path";
import fs from "fs";

const __dirname = dirname(new URL(import.meta.url).pathname);

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf-8").trim();

const testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`.trim();

/**
 * @param {string} input
 * @returns {number[][]}
 */
function parseInput(input) {
  const lineValues = input
    .split("\n")
    .map((line) => line.split(" ").map(Number));

  return lineValues;
}

/**
 * @param {string} input
 */
function solve(input) {
  const lineSequences = parseInput(input).map((line) => getAllSequences(line));

  console.log({
    part1: lineSequences.reduce(
      (acc, line) => acc + line.reduce((acc, seq) => acc + seq.at(-1), 0),
      0
    ),
    part2: lineSequences.reduce(
      (acc, line) =>
        acc + line.toReversed().reduce((acc, seq) => seq.at(0) - acc, 0),
      0
    ),
  });
}

/**
 *
 * @param {number[]} line
 * @returns {number[][]}
 */
function getAllSequences(line) {
  const allSequences = [line];

  while (allSequences.at(-1).some((e) => e !== 0)) {
    const last = allSequences.at(-1);
    const next = last.reduce((acc, e, i) => {
      if (i !== 0) {
        acc.push(e - last[i - 1]);
      }

      return acc;
    }, []);

    allSequences.push(next);
  }

  return allSequences;
}

solve(testInput); // { part1: 114, part2: 2 }
solve(input); // { part1: 2175229206, part2: 942 }
