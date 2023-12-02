import { dirname } from "path";
import fs from "fs";

const __dirname = dirname(new URL(import.meta.url).pathname);

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf-8").trim();

const testInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

const maxCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

function solve(input) {
  const result = input.split("\n").reduce(
    (acc, line) => {
      const { part1, part2 } = parseGame(line);
      acc.part1 += part1;
      acc.part2 += part2;

      return acc;
    },
    {
      part1: 0,
      part2: 0,
    }
  );

  console.log(result);
}

/**
 * Parses game for a given line
 * @param {string} line
 */
function parseGame(line) {
  const [game, setStr] = line.split(":").map((str) => str.trim());
  const sets = setStr.split(";").map((set) =>
    set
      .trim()
      .split(",")
      .map((cube) => {
        const [val, color] = cube.trim().split(" ");
        return {
          val: Number(val),
          color,
        };
      })
  );

  const gameId = Number(game.split(" ").at(-1).trim());

  const { isInvalidGame, minCubes } = solveGame(sets);

  return {
    part1: !isInvalidGame ? gameId : 0,
    part2: Object.values(minCubes).reduce((acc, val) => acc * val, 1),
  };
}

/**
 * @param {{val: number, color: string}[][]} game
 */
function solveGame(game) {
  return game.reduce(
    (acc, set) => {
      set.forEach((cube) => {
        const currentMinCube = acc.minCubes[cube.color];

        if (currentMinCube === undefined || cube.val > currentMinCube) {
          acc.minCubes[cube.color] = cube.val;
        }

        acc.isInvalidGame =
          acc.isInvalidGame || cube.val > maxCubes[cube.color];
      });

      return acc;
    },
    {
      isInvalidGame: false,
      minCubes: {},
    }
  );
}

solve(input);
// solve(testLines);
