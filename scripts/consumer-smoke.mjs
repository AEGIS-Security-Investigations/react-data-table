import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { packAndAudit, run } from "./package-utils.mjs";

const work = mkdtempSync(join(tmpdir(), "table-consumer-"));
try {
  const { tarball, manifest } = packAndAudit(work);
  const app = join(work, "app");
  mkdirSync(app);
  const write = (file, contents) => writeFileSync(join(app, file), contents);
  write("package.json", JSON.stringify({
    name: "table-consumer-smoke", private: true, type: "module",
    dependencies: { [manifest.name]: `file:${tarball}`, react: "19.2.5", "react-dom": "19.2.5" },
    devDependencies: { typescript: "5.9.3", "@types/react": "19.2.0", "@types/react-dom": "19.2.0", tailwindcss: "3.4.16", "tailwindcss-animate": "1.0.7" },
  }, null, 2));
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], app);
  run("npm", ["ls", "react", "react-dom"], app);
  write("smoke.tsx", `import { DataTableCore, type TableColumn } from "${manifest.name}";
import { parsePersistedColumnWidths } from "${manifest.name}/compat";
type Row = { id: string; name: string; count: number; active: boolean };
const columns: TableColumn<Row>[] = [{ key: "name", header: "Name" }, { key: "count", header: "Count" }, { key: "active", header: "Active" }];
export const table = <DataTableCore data={[{ id: "a", name: "Alpha", count: 0, active: false }]} columns={columns} scrollAreaLabel="Items" onSort={() => {}} onSelectAll={() => {}} onRowSelect={() => {}} />;
void parsePersistedColumnWidths;
`);
  write("tsconfig.json", JSON.stringify({ compilerOptions: {
    target: "ES2022", module: "NodeNext", moduleResolution: "NodeNext", jsx: "react-jsx",
    strict: true, noUncheckedIndexedAccess: true, skipLibCheck: false, outDir: "build",
  }, include: ["smoke.tsx"] }));
  run(process.execPath, ["node_modules/typescript/bin/tsc", "-p", "tsconfig.json"], app);
  write("runtime.mjs", `import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { table } from "./build/smoke.js";
import { DataTableCore } from "${manifest.name}";
import * as compat from "${manifest.name}/compat";
assert.equal(typeof DataTableCore, "function");
assert.equal(typeof compat.DataTableDraggableRows, "function");
assert.equal(typeof compat.parsePersistedColumnWidths, "function");
const html = renderToStaticMarkup(table);
for (const value of ["Alpha", ">0<", ">false<", 'aria-label="Items"']) assert.ok(html.includes(value), value);
console.log("Native ESM, both exports, strict declarations, and server render passed");
`);
  console.log(run(process.execPath, ["runtime.mjs"], app).trim());
  write("tailwind.config.cjs", `module.exports = {
    content: ["./node_modules/${manifest.name}/src/**/*.{ts,tsx}"],
    theme: { extend: { colors: { background: "#fff", foreground: "#111", muted: "#eee", border: "#ccc", ring: "#00f", primary: "#00f", popover: "#fff" } } },
    plugins: [require("tailwindcss-animate")]
  };\n`);
  write("input.css", "@tailwind utilities;\n");
  run(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "input.css", "-o", "output.css"], app);
  const css = readFileSync(join(app, "output.css"), "utf8");
  for (const rule of [".caption-bottom", ".bg-popover", ".text-sm", ".animate-in"]) {
    assert.ok(css.includes(rule), `Published source did not generate ${rule}`);
  }
  console.log("Tailwind 3 published-source scan passed; consumer smoke passed");
} finally {
  rmSync(work, { recursive: true, force: true });
}
