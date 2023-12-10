import { getCurrentFilePath, getFileData } from "../../js-utils/getInput.mjs";

const __dirname = getCurrentFilePath(import.meta.url);
const input = getFileData(__dirname, "day05");

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

/**
 * @param {string} input
 */
function solve(input) {
  const { seeds, destinationRanges } = parseInput(input.trim());

  const { part1Seeds, part2Seeds } = seeds.reduce(
    (acc, seed, index) => {
      acc.part1Seeds.push({
        start: seed,
        rangeLength: 1,
      });

      if (index % 2 === 0) {
        acc.part2Seeds.push({
          start: seed,
          rangeLength: seeds[index + 1],
        });
      }

      return acc;
    },
    {
      part1Seeds: [],
      part2Seeds: [],
    }
  );

  const part1 = getMinimumDestination(part1Seeds, destinationRanges);

  const part2 = getMinimumDestination(part2Seeds, destinationRanges);

  console.log({
    part1,
    part2,
  });
}

function getMinimumDestination(seedRanges, destinationRanges) {
  return seedRanges.reduce((minLocation, seed) => {
    const locations = destinationRanges.reduce(
      (prevRanges, destinationRange) =>
        mapRangeToDestinations(prevRanges, destinationRange),
      [seed]
    );

    return locations.reduce(
      (min, { start }) => Math.min(min, start),
      minLocation
    );
  }, Infinity);
}

/**
 * Splits an existing range to their destination ranges
 * @param {{start: number, rangeLength: number}[]} currentRange
 * @param {{source: number, destination: number, rangeLength: number}[]} sourceToDestinationRanges
 * @returns {{start: number, rangeLength: number}[]}
 */
function mapRangeToDestinations(currentRanges, sourceToDestinationRanges) {
  let toSplit = currentRanges;
  const finalRanges = [];

  for (const {
    source: sourceStart,
    destination: destinationStart,
    rangeLength: destinationRangeLength,
  } of sourceToDestinationRanges) {
    const newRangesToSplit = [];

    const sourceEnd = sourceStart + destinationRangeLength - 1;

    for (const range of toSplit) {
      const { start, rangeLength } = range;
      const end = start + rangeLength - 1;

      const isStartInRange = start >= sourceStart && start <= sourceEnd;
      const isEndInRange = end >= sourceStart && end <= sourceEnd;
      const isMiddleInRange = start < sourceStart && end > sourceEnd;

      if (!isStartInRange && !isEndInRange && !isMiddleInRange) {
        newRangesToSplit.push(range);
        continue;
      }

      // start and end are within source range
      if (isStartInRange && isEndInRange) {
        finalRanges.push({
          start: destinationStart + (start - sourceStart),
          rangeLength,
        });
        continue;
      }

      // Only the middle portion is within source range
      if (isMiddleInRange) {
        newRangesToSplit.push({
          start,
          rangeLength: sourceStart - start,
        });

        newRangesToSplit.push({
          start: end,
          rangeLength: end - sourceEnd,
        });

        finalRanges.push({
          start: destinationStart,
          rangeLength,
        });
        continue;
      }

      // start is within sourceRange but end is not
      if (isStartInRange && !isEndInRange) {
        newRangesToSplit.push({
          start: sourceEnd + 1,
          rangeLength: end - sourceEnd + 1,
        });

        finalRanges.push({
          start: destinationStart + (start - sourceStart),
          rangeLength: sourceEnd - start,
        });

        continue;
      }

      // end is within sourceRange but start is not
      if (!isStartInRange && isEndInRange) {
        newRangesToSplit.push({
          start,
          rangeLength: sourceStart - start,
        });

        finalRanges.push({
          start: destinationStart,
          rangeLength: end - sourceStart + 1,
        });

        continue;
      }
    }

    toSplit = newRangesToSplit;
  }

  return finalRanges.concat(toSplit);
}

/**
 *
 * @param {string} input
 */
function parseInput(input) {
  const [seedsStr, ...destinationStrs] = input.split("\n\n");

  const seeds = seedsStr.split(": ").at(-1).split(" ").map(Number);

  /**
   * @type {{source: number, destination: number, rangeLength: number}[][]}
   */
  const destinationRanges = destinationStrs.reduce((ranges, destinationStr) => {
    ranges.push(
      destinationStr
        .split("\n")
        .slice(1)
        .map((row) => {
          const [destination, source, rangeLength] = row.split(" ").map(Number);

          return {
            destination,
            source,
            rangeLength,
          };
        })
        .sort((a, b) => a.source - b.source)
    );
    return ranges;
  }, []);

  return {
    seeds,
    destinationRanges,
  };
}

console.group("Day 05");
solve(testInput); // { part1: 35, part2: 46 }
solve(input); // { part1: 331445006, part2: 6472060 }
console.groupEnd("Day 05");
