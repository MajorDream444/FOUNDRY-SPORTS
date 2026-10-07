# Foundry Sports OS — discovery prototype

7 October 2026 · PROPOSAL · Synthetic data only.

Open `index.html` in a modern browser. This portable, dependency-free prototype runs without a server or API key. It is a single-file HTML/CSS/JavaScript discovery artifact, suitable for sharing as a downloaded file or importing into a new repository. The product is not deployed to Google AI Studio or a public URL.

## Walkthrough

1. Coordinator → Prepare: simulate all three permission checks.
2. Deliver: choose Confirm appearance permission, select PASS, add a reason and record the simulated decision.
3. Athlete → Prepare: confirm understanding. Deliver → Open Prepare athlete introduction, add a fictional note and submit.
4. Coordinator → Deliver: select the introduction, review its draft through Open, record PASS with a reason. The contribution appears in the record.
5. Athlete or coordinator: request guidance. Expert: review the request and enter an example response. That response does not approve the assignment.
6. Build: save a fictional next-step idea. No certification or ownership is generated.
7. Capture anonymous feedback and export the demo JSON. Reset clears local state after confirmation.

## Honest boundaries

- Roles are perspective switches, not authentication or security controls. Anyone with the file can view the local demo state. Real access controls must be implemented before real data.
- No live AI, Hanzo, Lux, MobStack, Google, treasury, identity, email or contract integration.
- Permission checks and decisions are simulated, never legal approvals.
- Ordinary local browser storage, no immutable provenance or cross-device sync. Storage may be restricted for local files or in private mode; the app remains usable within the current session and can export.
- Fictional adult athletes only; no private contracts, youth profiles, health records or bank data.
- Feedback and drafts are not sent anywhere. Do not enter identifying details.
- Entry points are configurable. Accepted demonstration tasks do not automatically advance a participant or create equity.
- Withdrawing a demo permission invalidates affected accepted demo tasks and requires re-review. Historical decisions remain in the local log.

## Product direction

HAMAL: H — Hanzo; AMA — Art Mob AGInts; L — Lux. Foundry OS is the shared platform; Sports OS is the sports vertical. Qatar is a proposed launch/validation hub, with no claimed institutional authorization or investment.

The next production decision depends on a real authorized workflow, named reviewers, measured baseline and a buyer/budget test. Separate manual service effort from software value.

## Verification status

JavaScript syntax passes. Seventeen targeted workflow checks pass in Node using a minimal DOM/storage harness: required decisions/reasons, permission prerequisites, submission/understanding gates, role action restrictions, dependency invalidation, request/feedback validation, escaped user text, expert response isolation, local-state persistence and confirmed reset.

These checks do not verify actual DOM interaction, responsive layout, accessibility or visual fidelity. Cloud-browser local-file navigation was blocked; a separate local Chromium installation failed because the download did not provide a valid browser archive. Browser and mobile visual sign-off remain incomplete. Use the walkthrough above to review the downloaded prototype before external demonstration.
