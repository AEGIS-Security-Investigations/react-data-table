# Release checklist

The first public release, `@brotskyllc/react-data-table@0.1.0`, is already on npm. This section records its original checklist; see the trusted-publishing steps below for future versions.

- [x] React renderer isolated from application data, IDs, generated APIs, permissions, preferences and business actions.
- [x] Runtime dependencies reviewed: MIT, ISC, or Apache-2.0; shadcn-derived primitive notice included.
- [x] Source/build output and npm pack inventory inspected; no credentials, private fixtures, application history, or environment files included.
- [x] Standalone compilation, native ESM import, focused behavior tests, and host compatibility tests run.
- [x] Owner explicitly approved MIT; LICENSE and upstream notices are included.
- [x] Verify existing npm access: `bjbrotsky` is an owner of `brotskyllc` (October 5, 2026). Recheck before future releases; do not create credentials or accept agreements without approval.
- [ ] Review the app adapters and verify live desktop/mobile light/dark behavior before merging them.
- [ ] Resolve/verify required host CI checks in a configured environment.
- [ ] Final `npm pack --dry-run` inventory review and consumer smoke after the approved scope change.

The owner approved `@brotskyllc/react-data-table@0.1.0` as a public MIT npm release. The manifest now uses that name and explicit public registry access; the accidental-publish guard has been removed for this approved release. Run `npm run check:package` and `npm run test:consumer` against the final artifact. Do not substitute the unscoped `react-data-table` name: that package belongs to another publisher.

Check that each new exact version is absent immediately before publishing. Publish only the audited tarball, and do not change consumer dependencies as part of the package release.

The `compat` entry supports migration from existing internal modules. New integrations should use the root entry. Host applications can temporarily consume the audited tarball; replace that dependency with a released version after npm release is explicitly authorized and prerequisites are met.

## Future releases with npm trusted publishing

- Use the public npm package's trusted-publisher settings. Choose **GitHub Actions** with organization `AEGIS-Security-Investigations`, repository `react-data-table`, workflow filename `publish.yml`, and no environment. Grant direct publishing (not staged publishing). No npm secret is needed in this repository.
- Use **Run workflow** on `main` to rehearse. The manual run audits and consumer-tests the tarball and runs `npm publish --dry-run --offline`; it never publishes, even if `NPM_PUBLISH` is enabled.
- For a real release, with owner approval, enable repository variable `NPM_PUBLISH=true` and merge a reviewed change to the stable package version on `main`. The workflow skips any version already present on npm and fails closed if it cannot verify the version list.
- Add a new npm trust connection only when an unpublished release is ready: npm requires a first successful publish within two days. Verify the exact new version and source provenance on npm after release. See the [npm trusted-publishing guide](https://docs.npmjs.com/trusted-publishers/).
