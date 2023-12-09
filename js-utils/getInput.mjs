import fs from "fs";
import path from "path";

/**
 *
 * @param {import('fs').PathLike} currentPath
 */
export function getFileData(currentPath, inputName) {
  return fs
    .readFileSync(
      path.join(currentPath, "../inputs", `${inputName}.txt`),
      "utf-8"
    )
    .trim();
}

export function getCurrentFilePath(importMetaUrl) {
  return path.dirname(new URL(importMetaUrl).pathname);
}
