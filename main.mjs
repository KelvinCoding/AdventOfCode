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
} else if (args.length && args.some((arg) => dirs.includes(arg))) {
  const dir = args.find((arg) => dirs.includes(arg));
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
  const timeText = `Ran for`;
  if (shouldTime) {
    console.time(timeText);
  }
  console.log(`Running solution for: ${dir}\n`);
  await import(`${__dirname}/${dir}/solve.mjs`);

  if (shouldTime) {
    console.log();
    console.timeEnd(timeText);
  }

  console.log();
}

process.exit(0);
