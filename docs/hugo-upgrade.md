# Hugo 0.168 migration

This fork requires Hugo **0.168.0** and Dart Sass **1.105.2**. The pinned versions live in `scripts/toolchain.env`. LibSass and Hugo 0.110 are no longer supported. The visible theme, all five palettes, configurable widths, URLs and shortcode features remain supported.

## Build and test

```sh
scripts/install-tools.sh
export PATH="$PWD/.build/toolchain:$PWD/.build/toolchain/dart-sass:$PATH"
npm ci
npx playwright install chromium
scripts/build-example.sh
npm test
```

The installer supports macOS arm64 and Linux x86_64. Other platforms can install the same releases manually. Node is needed for browser tests, not site generation. The example build treats all warnings as failures. Browser tests use an isolated browser and block external media/tracking; live third-party services require a separate smoke check.

## Upgrade a consuming site

1. Pin the upgraded theme commit and install both Hugo and Dart Sass in local development and CI.
2. Move `layouts/partials` to `layouts/_partials`, `layouts/shortcodes` to `layouts/_shortcodes`, and `_default` overrides to `layouts/`. Rename old `terms.*` to `taxonomy.*`, old `taxonomy.*` to `term.*`, and home `index.*` to `home.*`. RSS overrides use `.rss.xml` or the general `rss.xml`.
3. Replace `paginate` with `pagination.pagerSize`, `googleAnalytics` with `services.googleAnalytics.ID`, and `languageName` with `label`. Use `taxonomy` for taxonomy roots and `term` for individual terms in `[outputs]`, preserving HTML/RSS/SearchIndex for both.
4. Remove duplicate YAML keys and use `[]` for empty arrays and `""` for empty scalar text. A bare `-` is a null item, not an empty list. New YAML parsing can reject empty block values or misread following fields.
5. Convert custom SCSS to Dart Sass modules as necessary. Plain CSS in `custom_css` is minified directly; `.scss` and `.sass` use Dart Sass.
6. Build with `hugo --gc --minify --panicOnWarning`. Compare artifacts with an old build: `python3 themes/zzo-dev/scripts/verify-output.py public --baseline /path/to/old-public`.

## Sass design

`main.scss` configures `abstracts/settings` from Hugo data and site params before loading styles. Other modules reference settings explicitly. `abstracts/mixins` owns the palette context for `themify` and `themed`; the context no longer depends on global import order across files. Styles use `@use` and namespaced builtins. Layout width is computed once in `layout/grid` and consumed by `pages/wrapper`.

## Compatibility notes

- Retained mobile single-column/hidden-sidebar behavior and themed body background.
- Search JSON paths, article links and feed item order are regression checked. Empty null tags normalize to empty arrays.
- Term RSS now uses escaped XML content consistently with the general RSS template; remote cover URLs are not prefixed twice.
- Language menus read each translated page's language label directly.
- The example's retired `twitter_simple` call is replaced with an original-post link and migration guidance; the Vimeo example uses the supported iframe shortcode. This avoids build-time dependence on social oEmbed APIs. The custom `twitterTimeline` feature remains available.
- Old Hugo theme minimum-version claims in upstream documentation do not apply to this fork.

## Deployment and rollback

Merge and validate the theme first. Update the blog submodule pin and CI in a separate PR, then verify the deployment and public HTML, search, RSS, article and taxonomy endpoints. To roll back, revert the blog upgrade commit, restoring both its Hugo version and theme pin together.
