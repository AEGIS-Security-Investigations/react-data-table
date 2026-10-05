# Release checklist

This source package is a release candidate, not an npm release.

- [x] React renderer isolated from application data, IDs, generated APIs, permissions, preferences and business actions.
- [x] Runtime dependencies reviewed: MIT, ISC, or Apache-2.0; shadcn-derived primitive notice included.
- [x] Source/build output and npm pack inventory inspected; no credentials, private fixtures, application history, or environment files included.
- [x] Standalone compilation, native ESM import, focused behavior tests, and host compatibility tests run.
- [x] Owner explicitly approved MIT; LICENSE and upstream notices are included.
- [ ] Verify npm organization/scope ownership and publishing rights using existing access. Do not create credentials or accept agreements without approval.
- [ ] Review the app adapters and verify live desktop/mobile light/dark behavior before merging them.
- [ ] Resolve/verify required host CI checks in a configured environment.
- [ ] Final `npm pack --dry-run` inventory review; remove `private: true` only for the approved registry release.

Run `npm run check:package` and `npm run test:consumer` after the final package name/version is selected. The candidate remains `@aegis-security-investigations/react-data-table@0.1.0`, MIT licensed. Public source visibility does not verify ownership of the matching npm scope. Do not substitute the unscoped `react-data-table` name: that package belongs to another publisher.

The release operator must confirm the final name, version, public npm audience and npm account/scope permissions before removing `private: true` and publishing. Preserve the current version while it remains unpublished. Do not change consumer dependencies as part of the package release.

The `compat` entry supports migration from existing internal modules. New integrations should use the root entry. Host applications can temporarily consume the audited tarball; replace that dependency with a released version after npm release is explicitly authorized and prerequisites are met.
