# Upgrade tasks

## 1. Baseline and pinned toolchain

- [ ] Complete

**Description:** Baseline and pinned toolchain.

**Acceptance criteria:** Old blog builds; stable versions recorded.

**Verification:** Run old Hugo production build and save output inventory.

**Dependencies:** None.

**Files likely touched:** tools, baseline outputs.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 2. Runtime and analytics compatibility

- [ ] Complete

**Description:** Runtime and analytics compatibility.

**Acceptance criteria:** No removed IsServer/internal analytics APIs; GA ID retained.

**Verification:** Build latest Hugo.

**Dependencies:** 1.

**Files likely touched:** five service partials.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 3. Modern layout mapping

- [ ] Complete

**Description:** Modern layout mapping.

**Acceptance criteria:** Home, term, taxonomy, RSS and custom types resolve.

**Verification:** Compare generated paths.

**Dependencies:** 2.

**Files likely touched:** layout rename batches, 5 source files per batch.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 4. Configuration and YAML compatibility

- [ ] Complete

**Description:** Configuration and YAML compatibility.

**Acceptance criteria:** No lost tags or duplicate front matter; explicit pagination/output config.

**Verification:** Build bilingual example and blog.

**Dependencies:** 3.

**Files likely touched:** example/blog config and content batches, 5 files per batch.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

### Checkpoint
- [ ] Build/output checks pass before dependent phase.

## 5. Sass settings and theme context

- [ ] Complete

**Description:** Sass settings and theme context.

**Acceptance criteria:** Runtime tokens flow through modules; shared theme context works.

**Verification:** Compile Dart Sass without warnings.

**Dependencies:** 4.

**Files likely touched:** main, settings, variables, mixins, functions.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 6. Sass module conversion

- [ ] Complete

**Description:** Sass module conversion.

**Acceptance criteria:** No legacy imports or deprecated builtins; all five themes retained.

**Verification:** Compile full stylesheet and inspect CSS.

**Dependencies:** 5.

**Files likely touched:** Sass batches of at most five files in abstracts/themes/syntax/base/layout/components/pages.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 7. Consumer overrides and resources

- [ ] Complete

**Description:** Consumer overrides and resources.

**Acceptance criteria:** Existing custom styles, article and cover behavior retained.

**Verification:** Build blog with upgraded theme.

**Dependencies:** 6.

**Files likely touched:** blog layouts/assets in batches of five.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

### Checkpoint
- [ ] Build/output checks pass before dependent phase.

## 8. Output regression harness

- [ ] Complete

**Description:** Output regression harness.

**Acceptance criteria:** Missing routes, invalid search data and local assets fail verification.

**Verification:** Run regression scripts against baseline and candidate.

**Dependencies:** 7.

**Files likely touched:** scripts and fixtures.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 9. Browser regression

- [ ] Complete

**Description:** Browser regression.

**Acceptance criteria:** Mobile columns/background, theme switching, search and page types work.

**Verification:** Browser checks at desktop/mobile widths.

**Dependencies:** 8.

**Files likely touched:** browser test harness.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 10. PR build gates and upgrade documentation

- [ ] Complete

**Description:** PR build gates and upgrade documentation.

**Acceptance criteria:** Pinned Hugo/Sass installed in PR CI; breaking requirements documented.

**Verification:** Execute CI commands locally.

**Dependencies:** 9.

**Files likely touched:** workflow, README, migration guide, theme.toml.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

### Checkpoint
- [ ] Build/output checks pass before dependent phase.

## 11. Independent review and delivery

- [ ] Complete

**Description:** Independent review and delivery.

**Acceptance criteria:** Review issues resolved; CI green before merge; production smoke recorded.

**Verification:** Subagent review, GitHub checks and public HTTP smoke.

**Dependencies:** 10.

**Files likely touched:** PRs and task evidence.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

