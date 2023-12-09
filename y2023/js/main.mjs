#! /usr/bin/env node

import { dirname } from "path";
import fs from "fs";
import readline from "readline";

const __dirname = dirname(new URL(import.meta.url).pathname);

const dirs = fs
  .readdirSync(`${__dirname}`)
  .filter((dir) => dir.startsWith("day"));

const args = process.argv.slice(2);

const shouldTime = args.includes("--time");

if (args.length && args.includes("--latest")) {
  await runDir(dirs.at(-1));
} else if (args.length && args.includes("--all")) {
  if (shouldTime) {
    console.time("Ran all days for");
  }
  await Promise.allSettled(dirs.map((dir) => runDir(dir)));

  if (shouldTime) {
    console.timeEnd("Ran all days for");
  }
} else if (
  args.length &&
  dirs.some((dir) => args.some((arg) => dir.startsWith(arg)))
) {
  const dir = dirs.find((dir) => args.some((arg) => dir.startsWith(arg)));
  await runDir(dir);
} else if (!args.length) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `Please enter which to run: \n  - ${dirs.join("\n  - ")}\nInput: `,
    async (answer) => {
      if (!dirs.includes(answer)) {
        console.error(`Invalid day: ${answer}`);
        process.exit(1);
      }
      console.log();

      await runDir(answer);
      rl.close();
    }
  );
} else {
  console.error('Invalid arguments. Use "--latest" to run latest solution');
  console.error('or specify a day to run. Example: "./main.mjs day01"');
}

async function runDir(dir) {
  const timeText = `Ran ${dir} for`;
  if (shouldTime) {
    console.time(timeText);
  }
  console.log(`Running solution for: ${dir}\n`);
  await import(`${__dirname}/${dir}`);

  if (shouldTime) {
    console.timeEnd(timeText);
  }

  console.log();
}

process.exit(0);
