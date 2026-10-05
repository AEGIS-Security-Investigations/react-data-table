import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("package CI remains read-only and validates the packed consumer", () => {
	const workflow = Bun.YAML.parse(
		readFileSync(new URL("../.github/workflows/check.yml", import.meta.url), "utf8"),
	) as {
		permissions: Record<string, string>;
		jobs: Record<string, {
			permissions?: Record<string, string>;
			steps: { run?: string }[];
		}>;
	};
	expect(workflow.permissions).toEqual({ contents: "read" });
	for (const job of Object.values(workflow.jobs)) {
		expect(job.permissions ?? workflow.permissions).toEqual({ contents: "read" });
		for (const step of job.steps) {
			expect(step.run ?? "").not.toMatch(/npm publish(?![^\n]*--dry-run)/);
		}
	}
	const commands = workflow.jobs.check!.steps.map((step) => step.run);
	for (const command of ["npm run build", "bun test", "npm pack --dry-run", "npm run check:package", "npm run test:consumer"]) {
		expect(commands).toContain(command);
	}
});
