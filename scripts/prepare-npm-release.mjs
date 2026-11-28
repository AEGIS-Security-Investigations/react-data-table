import { mkdirSync, renameSync } from "node:fs";
import { join, resolve } from "node:path";
import { packAndAudit } from "./package-utils.mjs";

const dir = resolve(process.argv[2]);
mkdirSync(dir);
const { tarball } = packAndAudit(dir);
renameSync(tarball, join(dir, "package.tgz"));
