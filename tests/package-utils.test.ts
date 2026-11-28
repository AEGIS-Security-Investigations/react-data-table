import { expect, test } from "bun:test";
import { parsePackResult } from "../scripts/package-utils.mjs";

const name = "@brotskyllc/react-data-table";
const packed = {
  name,
  filename: "brotskyllc-react-data-table-0.1.1.tgz",
  files: [{ path: "package.json" }],
  entryCount: 1,
  size: 200,
};

test("reads npm 10/11 list and npm 12 package-keyed output", () => {
  for (const result of [[packed], { [name]: packed }]) {
    expect(parsePackResult(JSON.stringify(result), name)).toEqual(packed);
  }
});

test("refuses ambiguous, mismatched, and malformed metadata", () => {
  for (const result of [
    { other: packed },
    [packed, packed],
    { [name]: { ...packed, name: "other" } },
    [{ ...packed, filename: "../other.tgz" }],
    [{ ...packed, files: null }],
    [{ ...packed, entryCount: 2 }],
  ]) {
    expect(() => parsePackResult(JSON.stringify(result), name)).toThrow(
      "npm pack did not report exactly one valid tarball"
    );
  }
});
