# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nuxt 3 (Vue 3 / TypeScript) frontend for a recipes app. It talks to a separate backend API (`NUXT_PUBLIC_BASE_URL` in `.env`, currently a Heroku-hosted service) and uses Cloudinary for image hosting.

## Commands

```bash
npm run dev          # start dev server at http://localhost:3000
npm run build         # production build
npm run generate      # static generation
npm run preview       # preview production build
npm run lint          # eslint .
npm run lint:fix      # eslint . --fix
npm run format        # prettier --write "**/*.{js,jsx,ts,tsx,vue,scss}"
npm run test          # vitest (watch mode by default)
npm run storybook     # storybook dev -p 6006
```

Run a single test file: `npx vitest run components/base/Typeahead/Typeahead.test.ts`
Run tests matching a name: `npx vitest run -t "renders the label"`

There is no separate `typecheck` script; TypeScript checking happens via `nuxt prepare`/build and editor tooling against `.nuxt/tsconfig.json`.

## Architecture

- **Nuxt 3 file-based routing** under `pages/`. Dynamic routes use `[id].vue` (e.g. `pages/recipes/[id].vue`). Admin-only pages live under `pages/admin/` and are gated by the `adminAuth` middleware (`middleware/adminAuth.ts`), applied via `definePageMeta({ middleware: 'adminAuth' })`.
- **Auto-imports**: Vue/Nuxt composables, `stores/*`, `composables/*`, and all files under `components/` are auto-imported — do not hand-write imports for these except where a component explicitly re-imports to work around a Storybook resolution issue (see `Button.vue`). Component auto-import uses `directoryAsNamespace: true` (via `unplugin-vue-components`), so a file at `components/base/Button/Button.vue` is used in templates as `<BaseButton>`, `components/recipes-list/Grid.vue` as `<RecipesListGrid>`, etc. Keep this folder-to-tag-name convention in mind when adding or moving components.
- **State**: Pinia stores in `stores/`. `stores/auth.ts` (composition-style `defineStore` with refs/computed) holds the JWT (persisted via a `useCookie` named `auth_token`) and current user, and exposes `isAuthenticated`/`isAdmin`. `stores/shoppingList.ts` (options-style `defineStore`) is persisted client-side via `@pinia-plugin-persistedstate/nuxt` using cookies. Follow whichever store style (composition vs. options) matches the file you're editing.
- **API calls**: no generated SDK is wired in yet despite `openapitools.json` being present — components/stores call the backend directly with Nuxt's `useFetch`/`$fetch`/`useAsyncData`, building URLs from `useBaseUrl()` (`composables/useBaseUrl.ts`, reads `runtimeConfig.public.BASE_URL`) and passing `Authorization: Bearer <token>` from the auth store manually on each call. There is no shared API client wrapper — this pattern is repeated per call site.
- **Types**: domain types (e.g. `Recipe`, `RecipeIngredient`, `Tag`, `Category`) live in `types/recipe.ts` and are imported with `import type`.
- **Components**: `components/base/*` are the design-system primitives (Button, Checkbox, Chip, Dropdown, Input, Modal, Typeahead, Typography, etc.), each with its own folder containing the `.vue` file and, where present, a `.stories.ts` for Storybook and/or a `.test.ts` for Vitest. Feature components are grouped by domain folder (`recipes-list/`, `recipe-details/`, `edit-recipe/`, `shopping-list/`, `category-tabs/`, `auth/`, `layout/`, `image/`).
- **Styling**: SCSS with `<style scoped lang="scss">` per component. Design tokens (`assets/styles/_colors.scss`, `_spacing.scss`, `_typography.scss`, `_breakpoints.scss`, `_elevation.scss`, `_zindex.scss`) are aggregated in `assets/styles/_variables.scss` and injected globally into every SCSS block via `additionalData` in both `nuxt.config.ts` and `vite.config.ts` (the latter is needed for Storybook) — variables like `$color-primary-01` or `$spacing-4` are available without importing them. A global `reset.scss` is loaded app-wide. Keep both Vite configs in sync if you change the SCSS injection setup.
- **Testing**: Vitest with the Nuxt test environment (`vitest.config.ts` uses `defineVitestConfig` with `environment: "nuxt"`). Tests use `mountSuspended` from `@nuxt/test-utils/runtime` (needed because components rely on Nuxt auto-imports/composables). Test files sit next to the component they cover (`Component.test.ts`).
- **Storybook**: stories live next to components (`Component.stories.ts`), scanned via `components/**/*.stories.@(js|jsx|ts|tsx)`. `.storybook/main.ts` manually merges `vite.config.ts` into the Storybook Vite config so path aliases and SCSS injection match the app.

## Conventions

- ESLint config extends `@nuxtjs/eslint-config-typescript` + `plugin:prettier/recommended`, with `vue/multi-word-component-names` turned off (single-word component filenames like `Button.vue`, `Grid.vue` are expected given the directory-as-namespace auto-import convention). Prettier: 2-space width, `trailingComma: "es5"`.
- Line endings are normalized to LF via `.gitattributes` (`* text=auto eol=lf`).
- UI text in this app is in Russian; keep new user-facing strings consistent with that.
