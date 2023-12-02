import { dirname } from "path";
import fs from "fs";

const __dirname = dirname(new URL(import.meta.url).pathname);

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf-8").trim();

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

function solve() {
  const result = input.split("\n").reduce(
    (acc, line) => {
      const { p1Digits, p2Digits } = [...line].reduce(
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

solve();
