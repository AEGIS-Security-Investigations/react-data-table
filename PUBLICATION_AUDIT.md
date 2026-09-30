# Publication audit

Candidate reviewed September 30, 2026. This is a fresh standalone source tree; no application repository history is included.

## Included

Generic React table presentation, scalar/nested column types, row identity helpers, selection/expansion UI, controlled resize handles, lazy client-only drag rendering, inline picker context, UI primitives, and deterministic sorting/width helpers. Tests use synthetic example rows only.

## Excluded

Application APIs and generated types, business entities and actions, authentication and authorization, customer or employee data, credentials and environment files, application table ID registries, preference persistence, export/audit services, saved-view persistence, data fetching, and application Git history.

Source inspection and pattern/import checks found no unexpected application imports, credential patterns, environment access, network calls, or storage access. This is a bounded code review and scan, not a guarantee against every possible security issue.

## Dependencies and licensing

The production dependency closure contains only MIT, ISC, and Apache-2.0 license identifiers. Dependencies remain external packages, not bundled copies. The shadcn-derived table, skeleton, and tooltip primitive license is retained in THIRD_PARTY_NOTICES.md. No copyleft, paid-component, or proprietary dependency was found in the extracted source or runtime dependency closure.

Owner licensing for the extracted code remains undecided. `license: UNLICENSED` and `private: true` prevent accidental registry publication; they do not grant an open-source license. Public repository creation is authorized. No license grant, registry credential creation, legal agreement, registry publish, deployment, or merge has been performed.

## Verification

Standalone TypeScript build and 11 behavioral tests pass. The packed ESM root and compatibility entry load and server-render with React peers in a clean consumer. The pack allowlist includes source, compiled ESM/declarations and documentation only; no application history, environment files, node_modules or absolute workstation paths are included.

Host application integration changes and internal validation evidence remain in their separate private worktrees. Full host CI and real authenticated-app visual verification are required before merging integrations.
