# Upgrade tasks

## 1. Baseline and pinned toolchain

- [x] Complete

**Description:** Baseline and pinned toolchain.

**Acceptance criteria:** Old blog builds; stable versions recorded.

**Verification:** Run old Hugo production build and save output inventory.

**Dependencies:** None.

**Files likely touched:** tools, baseline outputs.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 2. Runtime and analytics compatibility

- [x] Complete

**Description:** Runtime and analytics compatibility.

**Acceptance criteria:** No removed IsServer/internal analytics APIs; GA ID retained.

**Verification:** Build latest Hugo.

**Dependencies:** 1.

**Files likely touched:** five service partials.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 3. Modern layout mapping

- [x] Complete

**Description:** Modern layout mapping.

**Acceptance criteria:** Home, term, taxonomy, RSS and custom types resolve.

**Verification:** Compare generated paths.

**Dependencies:** 2.

**Files likely touched:** layout rename batches, 5 source files per batch.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 4. Configuration and YAML compatibility

- [x] Complete

**Description:** Configuration and YAML compatibility.

**Acceptance criteria:** No lost tags or duplicate front matter; explicit pagination/output config.

**Verification:** Build bilingual example and blog.

**Dependencies:** 3.

**Files likely touched:** example/blog config and content batches, 5 files per batch.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

### Checkpoint
- [ ] Build/output checks pass before dependent phase.

## 5. Sass settings and theme context

- [x] Complete

**Description:** Sass settings and theme context.

**Acceptance criteria:** Runtime tokens flow through modules; shared theme context works.

**Verification:** Compile Dart Sass without warnings.

**Dependencies:** 4.

**Files likely touched:** main, settings, variables, mixins, functions.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 6. Sass module conversion

- [x] Complete

**Description:** Sass module conversion.

**Acceptance criteria:** No legacy imports or deprecated builtins; all five themes retained.

**Verification:** Compile full stylesheet and inspect CSS.

**Dependencies:** 5.

**Files likely touched:** Sass batches of at most five files in abstracts/themes/syntax/base/layout/components/pages.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 7. Consumer overrides and resources

- [x] Complete

**Description:** Consumer overrides and resources.

**Acceptance criteria:** Existing custom styles, article and cover behavior retained.

**Verification:** Build blog with upgraded theme.

**Dependencies:** 6.

**Files likely touched:** blog layouts/assets in batches of five.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

### Checkpoint
- [ ] Build/output checks pass before dependent phase.

## 8. Output regression harness

- [x] Complete

**Description:** Output regression harness.

**Acceptance criteria:** Missing routes, invalid search data and local assets fail verification.

**Verification:** Run regression scripts against baseline and candidate.

**Dependencies:** 7.

**Files likely touched:** scripts and fixtures.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 9. Browser regression

- [x] Complete

**Description:** Browser regression.

**Acceptance criteria:** Mobile columns/background, theme switching, search and page types work.

**Verification:** Browser checks at desktop/mobile widths.

**Dependencies:** 8.

**Files likely touched:** browser test harness.

**Estimated scope:** Medium per batch; numbered migration batches are recorded below as executed.

## 10. PR build gates and upgrade documentation

- [x] Complete

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


## Execution evidence (2026-10-18)

- Baseline: Hugo 0.110.0, blog a0682c0 and theme 1626bec. Latest stable verified from official releases.
- Hugo 0.168.0 + Dart Sass 1.105.2: bilingual example and real blog build with `--panicOnWarning`.
- Blog: 563 artifacts; all HTML/XML/JSON paths, search URLs/titles/nonempty tags and RSS item order match baseline.
- Chromium: all five palettes at 390px and 1440px have identical computed layout/color/font properties with animations disabled.
- Browser suite covers desktop/mobile article, five palettes, desktop/mobile search and optional page types. Example: 5 passing tests.
- Independent review: no blocking findings; auto-merge permitted after current GitHub CI is green.
- Third-party tracking/comments/media blocked in browser regression; live service functionality is not claimed.

### Mechanical migration batches

Each batch below contains at most five files. Acceptance: module/template dependencies resolve, no deprecated API remains in the changed code, and the complete warning-free build plus output/browser checkpoint passes. Template moves without content edits are verified by Git rename detection.

- [x] Sass batch 1: `assets/sass/abstracts/_functions.scss`, `assets/sass/abstracts/_mixins.scss`, `assets/sass/abstracts/_settings.scss`, `assets/sass/abstracts/_variables.scss`, `assets/sass/base/_animation.scss`.
- [x] Sass batch 2: `assets/sass/base/_helpers.scss`, `assets/sass/base/_reset.scss`, `assets/sass/base/_typography.scss`, `assets/sass/components/_alert.scss`, `assets/sass/components/_bio.scss`.
- [x] Sass batch 3: `assets/sass/components/_box.scss`, `assets/sass/components/_breadcrumb.scss`, `assets/sass/components/_busuanzi.scss`, `assets/sass/components/_button.scss`, `assets/sass/components/_codetab.scss`.
- [x] Sass batch 4: `assets/sass/components/_comment.scss`, `assets/sass/components/_diagram.scss`, `assets/sass/components/_donation.scss`, `assets/sass/components/_expand.scss`, `assets/sass/components/_featuredImage.scss`.
- [x] Sass batch 5: `assets/sass/components/_gtt.scss`, `assets/sass/components/_hr.scss`, `assets/sass/components/_ie.scss`, `assets/sass/components/_modal.scss`, `assets/sass/components/_notice.scss`.
- [x] Sass batch 6: `assets/sass/components/_pagination.scss`, `assets/sass/components/_related.scss`, `assets/sass/components/_search.scss`, `assets/sass/components/_summary.scss`, `assets/sass/components/_swiper.scss`.
- [x] Sass batch 7: `assets/sass/components/_switch.scss`, `assets/sass/components/_tab.scss`, `assets/sass/components/_taxo.scss`, `assets/sass/components/_toc.scss`, `assets/sass/components/_whoami.scss`.
- [x] Sass batch 8: `assets/sass/layout/_body.scss`, `assets/sass/layout/_footer.scss`, `assets/sass/layout/_grid.scss`, `assets/sass/layout/_header.scss`, `assets/sass/layout/_navigation.scss`.
- [x] Sass batch 9: `assets/sass/layout/_sidebar.scss`, `assets/sass/main.scss`, `assets/sass/pages/_404.scss`, `assets/sass/pages/_archive.scss`, `assets/sass/pages/_contact.scss`.
- [x] Sass batch 10: `assets/sass/pages/_gallery.scss`, `assets/sass/pages/_list.scss`, `assets/sass/pages/_publication.scss`, `assets/sass/pages/_resume.scss`, `assets/sass/pages/_showcase.scss`.
- [x] Sass batch 11: `assets/sass/pages/_single.scss`, `assets/sass/pages/_talk.scss`, `assets/sass/pages/_terms.scss`, `assets/sass/pages/_wrapper.scss`, `assets/sass/syntax/_syntax.scss`.
- [x] Sass batch 12: `assets/sass/themes/_dark.scss`, `assets/sass/themes/_darkcode.scss`, `assets/sass/themes/_hacker.scss`, `assets/sass/themes/_hackercode.scss`, `assets/sass/themes/_kimbie.scss`.
- [x] Sass batch 13: `assets/sass/themes/_kimbiecode.scss`, `assets/sass/themes/_light.scss`, `assets/sass/themes/_lightcode.scss`, `assets/sass/themes/_solarized.scss`, `assets/sass/themes/_solarizedcode.scss`.
- [x] Sass batch 14: `assets/sass/themes/_theme.scss`.
