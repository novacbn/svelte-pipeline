# CHANGELOG

## v0.1.1 - UNRELEASED

-   Updated the following Components

    -   `<REPLRender dev={boolean} />` / `<REPLSplit dev={boolean} />` — Turns the Svelte compiler dev builds on

## v0.1.0 - 06/05/2021

-   Added new Components

    -   `import {Split} from "svelte-pipeline/repl";`

        -   Renders a split-pane REPL for Svelte, both horizontal and vertical.
        -   Has the following exports:

            -   `<Split context={Record<string, any>} />` — for setting up globals
            -   `<Split imports={Record<string, any>} />` — for setting up imports
            -   `<Split rotation={REPL_ROTATION} />` — for setting to horizontal / vertical
            -   `<Split view={REPL_VIEWS} />` — for setting to display Editor, Preview, or both panes
            -   `<Split split={number}>` — for setting the `0...1` percentage of how much the Editor takes up the parent container
            -   `<Split value={string}>` — for setting the initial code for the Editor

-   Removed CommonJS / UMD builds, now ESM only due to including Components and using SvelteKit for packaging
-   Typings for Components coming soon, need SvelteKit to support generating those during packaging
