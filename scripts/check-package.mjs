import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { packAndAudit } from "./package-utils.mjs";

const work = mkdtempSync(join(tmpdir(), "table-pack-"));
try {
  packAndAudit(work);
} finally {
  rmSync(work, { recursive: true, force: true });
}
