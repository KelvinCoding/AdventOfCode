import { getCurrentFilePath, getFileData } from "../../js-utils/getInput.mjs";

const __dirname = getCurrentFilePath(import.meta.url);
const input = getFileData(__dirname, "day01");

const testInput = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const nums = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function solve(input) {
  const result = input.split("\n").reduce(
    (acc, line) => {
      const { p1Digits, p2Digits } = parseLineValue(line);

      const p1LineValue = 10 * p1Digits.at(0) + p1Digits.at(-1);
      const p2LineValue = 10 * p2Digits.at(0) + p2Digits.at(-1);

      acc.part1 += p1LineValue;
      acc.part2 += p2LineValue;

      return acc;
    },
    {
      part1: 0,
      part2: 0,
    }
  );

  console.log(result);
}

function parseLineValue(line) {
  return [...line].reduce(
    (acc, char, index) => {
      const charNum = Number(char);
      if (charNum) {
        acc.p1Digits.push(charNum);
        acc.p2Digits.push(charNum);
      }

      nums.forEach(
        (num, idx) =>
          line.slice(index).startsWith(num) && acc.p2Digits.push(idx)
      );

      return acc;
    },
    {
      p1Digits: new Array(),
      p2Digits: new Array(),
    }
  );
}

solve(testInput); // { part1: NaN, part2: 281 }
solve(input); // { part1: 54632, part2: 54019 }
