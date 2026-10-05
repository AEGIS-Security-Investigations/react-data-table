import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));
export function run(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
}

export function packAndAudit(work) {
  const [packed] = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", work]));
  const tarball = join(work, packed.filename);
  const files = packed.files.map(({ path }) => path);
  const docs = new Set(["package.json", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md"]);
  const forbiddenPath = /(^|\/)(\.[^/]+|__tests__|__fixtures__|fixtures|tests|node_modules)(\/|$)|\.(test|spec)\.|\.(map|tgz)$/;
  for (const file of files) {
    const allowed = docs.has(file) || /^src\/.+\.tsx?$/.test(file) || /^dist\/.+\.(js|d\.ts)$/.test(file);
    if (!allowed || forbiddenPath.test(file)) throw new Error(`Unexpected packed file: ${file}`);
    if (file.startsWith("dist/")) {
      const source = file.replace(/^dist\//, "src/").replace(/\.(d\.ts|js)$/, "");
      if (!files.includes(`${source}.ts`) && !files.includes(`${source}.tsx`)) {
        throw new Error(`Build output has no matching packed source: ${file}`);
      }
    }
  }
  run("tar", ["-xzf", tarball, "-C", work]);
  const pkgRoot = join(work, "package");
  const manifest = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
  const targets = (value) => typeof value === "string" ? [value] : Object.values(value).flatMap(targets);
  for (const target of [manifest.main, manifest.types, ...targets(manifest.exports)]) {
    if (!target.startsWith("./") || !files.includes(target.slice(2))) {
      throw new Error(`Missing or invalid package entry: ${target}`);
    }
  }
  for (const name of ["react", "react-dom"]) {
    if (!manifest.peerDependencies?.[name] || manifest.dependencies?.[name]) {
      throw new Error(`${name} must remain a peer dependency`);
    }
  }
  for (const entry of ["dist/index.js", "dist/compat.js"]) {
    if (!/^['"]use client['"];/.test(readFileSync(join(pkgRoot, entry), "utf8"))) {
      throw new Error(`Missing client boundary: ${entry}`);
    }
  }
  const patterns = [
    ["credential", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,}|npm_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9_-]{20,}|xox[abprs]-[A-Za-z0-9-]{10,})/],
    ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
    ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
    ["workstation path", /\/(?:Users|home)\/[A-Za-z0-9_-]+\//],
    ["application dependency", /(?:from\s*|import\s*\()["'](?:@\/|@prisma\/|.*generated\/)/],
  ];
  const hosts = new Set(["github.com", "ui.shadcn.com", "www.w3.org"]);
  for (const file of files) {
    const text = readFileSync(join(pkgRoot, file), "utf8");
    for (const [label, pattern] of patterns) {
      // Report the location, never the secret or private text itself.
      if (pattern.test(text)) throw new Error(`${label} detected in ${file}`);
    }
    for (const [, host] of text.matchAll(/https?:\/\/([A-Za-z0-9.-]+)/g)) {
      if (!hosts.has(host)) throw new Error(`Unreviewed URL host in ${file}`);
    }
  }
  for (const file of docs) if (!existsSync(join(pkgRoot, file))) throw new Error(`Missing ${file}`);
  console.log(`${manifest.name}@${manifest.version}: ${packed.entryCount} files, ${packed.size} bytes; package audit passed`);
  return { tarball, packed, manifest };
}
