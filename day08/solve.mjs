import { dirname } from "path";
import fs from "fs";

const __dirname = dirname(new URL(import.meta.url).pathname);

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf-8").trim();

const testInput = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`.trim();

function parseInput(input) {
  const [rules, mappingStr] = input
    .replaceAll("(", "")
    .replaceAll(")", "")
    .split("\n\n");

  const mappings = mappingStr.split("\n").reduce((acc, line) => {
    const [from, to] = line.split(" = ");

    const [left, right] = to.split(", ");

    if (acc[from]) {
      throw new Error(`Duplicate mapping for ${from}`);
    }

    acc[from] = {
      R: right,
      L: left,
    };

    return acc;
  }, {});

  return {
    rules: [...rules],
    mappings,
  };
}

function solve(input) {
  const { rules, mappings } = parseInput(input);

  console.log({
    part1: walk(mappings, rules, "AAA", (pos) => pos === "ZZZ").counter,
    part2: lcmVariadic(
      ...Object.keys(mappings)
        .filter((pos) => pos.endsWith("A"))
        .map((startPos) => {
          const { counter, firstLoopCount } = walk(
            mappings,
            rules,
            startPos,
            (pos) => pos.endsWith("Z"),
            true
          );

          const loopDistance = counter - firstLoopCount;

          return loopDistance;
        })
    ),
  });
}

function walk(mappings, rules, startPos, isEndPos, isPart2 = false) {
  let counter = 0;
  let currentPosition = startPos;

  let firstLoopCount = 0;

  const max = rules.length * 10_000_000;

  while (true) {
    const step = rules[counter % rules.length];
    counter += 1;

    const nextStep = mappings[currentPosition][step];

    if (isEndPos(nextStep)) {
      if (isPart2 && !firstLoopCount) {
        firstLoopCount = counter;
      } else {
        break;
      }
    }

    currentPosition = nextStep;

    if (counter > max) {
      console.log("max reached");
      break;
    }
  }

  return { counter, firstLoopCount };
}

// Function to find GCD of two numbers
function gcd(a, b) {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Function to find LCM of two numbers
function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

// Variadic function to find LCM of any number of arguments
function lcmVariadic(...args) {
  return args.reduce((acc, val) => lcm(acc, val), 1);
}

solve(testInput); // { part1: 2, part2: 1 }
solve(input); // { part1: 12083, part2: 13385272668829 }
