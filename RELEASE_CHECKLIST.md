# Release checklist

This source package is a release candidate, not an npm release.

- [x] React renderer isolated from application data, IDs, generated APIs, permissions, preferences and business actions.
- [x] Runtime dependencies reviewed: MIT, ISC, or Apache-2.0; shadcn-derived primitive notice included.
- [x] Source/build output and npm pack inventory inspected; no credentials, private fixtures, application history, or environment files included.
- [x] Standalone compilation, native ESM import, focused behavior tests, and host compatibility tests run.
- [ ] Owner approves a license. Keep `UNLICENSED` until then; do not infer an open-source license from public visibility.
- [ ] Verify npm organization/scope ownership and publishing rights using existing access. Do not create credentials or accept agreements without approval.
- [ ] Review the app adapters and verify live desktop/mobile light/dark behavior before merging them.
- [ ] Resolve/verify required host CI checks in a configured environment.
- [ ] Final `npm pack --dry-run` inventory review; remove `private: true` only for the approved registry release.

The `compat` entry supports migration from existing internal modules. New integrations should use the root entry. Host applications can temporarily consume the audited tarball; replace that dependency with a released version after npm release is explicitly authorized and prerequisites are met.
