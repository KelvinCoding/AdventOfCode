import { getCurrentFilePath, getFileData } from "../../js-utils/getInput.mjs";

const __dirname = getCurrentFilePath(import.meta.url);
const input = getFileData(__dirname, "day06");

const testInput = `Time:      7  15   30
Distance:  9  40  200
`.trim();

/**
 * @param {string} input
 */
function solve(input) {
  const [times, distances] = input.split("\n").map((line) =>
    line
      .split(/:\s+/)
      .at(-1)
      .split(/\s+/)
      .filter((ch) => !!ch.trim())
      .map(Number)
  );

  const part1 = Array.from({ length: times.length }).reduce((total, _, i) => {
    return total * getPossibleOptionCount(times[i], distances[i]);
  }, 1);

  const part2 = getPossibleOptionCount(
    Number(times.join("")),
    Number(distances.join(""))
  );

  console.log({
    part1,
    part2,
  });
}

/**
 *
 * @param {number} time
 * @param {number} distance
 * @returns {number}
 */
function getPossibleOptionCount(time, distance) {
  // Charging time is c distance is given by c * (t - c).
  // We want the distance to be greater than d so -c^2 + tc -d > 0.
  // Use quadratic formula (t - √t^2 - 4*d) / 2 < c < (t - √t^2 - 4*d) / 2

  const sqrt = Math.sqrt(time * time - 4.0 * distance);

  const maxTime = Math.ceil((time + sqrt) / 2.0);
  const minTime = Math.floor((time - sqrt) / 2.0);

  const result = maxTime - minTime - 1;

  return result;
}

solve(testInput); // { part1: 288, part2: 71503 }
solve(input); // { part1: 303600, part2: 23654842 }
