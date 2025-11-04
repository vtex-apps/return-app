## Project Rules for Cursor Agents and Developers

These rules are the source of truth for working in this repository. Cursor Agents and humans should follow them for every change.

### Mandatory steps for any code change

- Update `CHANGELOG.md` following Keep a Changelog + SemVer.
- Update relevant docs: `docs/` and/or `README.md` when behavior, APIs, flows, or configs change.
- Run lint in `node/`:
  - `npm run lint`
- Run tests in `node/` (if tests exist):
  - `npm test`

### Pull Request expectations

- If code changed under `node/`, include edits to at least one of: `CHANGELOG.md`, files in `docs/`, or `README.md`.
- PR description should summarize the changes and link related tickets.

### Style/quality

- Prefer small, focused edits with clear commit messages.
- Keep comments high-signal; avoid obvious comments.

### VTEX Reference/Good practices

- When needing to create connections to VTEX services, please check if the method is already available https://developers.vtex.com/docs/guides/vtex-io-documentation-clients
- Use object destructuring
- Prefer optional chaining and nullish coalescing for safe access/defaults
- Provide payload examples when VTEX docs are insufficient so types can be defined (avoid `any`). Prefer adding sanitized real-world samples to `docs/` and derive TypeScript interfaces from them.
 