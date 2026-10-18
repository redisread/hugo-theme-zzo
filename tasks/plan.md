# Hugo 0.168 modernization plan

## Scope and authorization
The user requested design, task breakdown, execution, independent review and PR delivery on 2026-10-18. Preserve existing URLs, content, theme choices, mobile layout, search, RSS and optional page types. Upgrade the theme and its HUGO_blog consumer together. This authorizes execution of this plan; no unrelated redesign or dependency removal.

## Architecture decisions
- Pin Hugo 0.168.0 and Dart Sass 1.105.2, verified stable releases. Remove LibSass dependency and deprecated Sass imports/functions using explicit modules.
- Adopt modern Hugo layouts (_partials, _shortcodes, home, taxonomy/term and RSS names), migrate removed APIs and current configuration names.
- Keep theme tokens configurable through a Sass settings module populated by Hugo. Share theme context within one module rather than across global import order.
- Validate the bilingual example and real blog. Compare old/new output paths and search records, then browser-check desktop/mobile flows. Preserve existing blog template overrides by migrating them simultaneously.
- Ship theme first, then pin the reviewed theme commit in the blog and update its CI. Build PRs before deployment, retain master-only deployment.

## Dependency graph
Baseline → runtime/API + content compatibility → template mapping → Sass modules → output/browser regression → independent review → theme PR/CI/merge → blog pin/PR/CI/merge → production smoke.

## Task list
See todo.md for acceptance criteria and verification. Mechanically related source migrations are divided into bounded batches, verified together at the phase checkpoint.

## Risks and mitigations
| Risk | Mitigation |
|---|---|
| YAML parser accepts different empty values | Normalize affected front matter and compare tags/search data |
| Template lookup silently changes outputs | Compare complete HTML/XML/JSON path inventory and exercise optional types |
| Sass module context or declaration order changes CSS | Compare rendering and all five theme variants; do not silence deprecations |
| Consumer overrides theme templates | Migrate overrides in isolated blog worktree |
| New toolchain missing in CI | Pin/download runtime in PR build job before master deployment |
| Unrelated legacy behavior | Preserve features; record pre-existing limitations with evidence |

## Rollback
Revert the blog upgrade commit to restore its old Hugo version and submodule pin. Theme changes are on a separate branch and do not affect deployed blog until its pin changes.

## Evidence
Initial audit: /tmp/zzo-hugo-audit.kYklUe (old 0.110.0 build passes; unchanged latest build fails). Refresh real-blog baseline from current origin/master a0682c0. No production writes until validated PR merges.

## Outcome
All 11 tasks completed. Theme PR #3 and blog PR #53 merged after review and passing CI; production now serves Hugo 0.168.0. Detailed validation and release links are recorded in todo.md.
