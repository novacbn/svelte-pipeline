import type {IActionHandle} from "./actions";

/**
 * Represents the Svelte Action handle returned by [[stylesheet]]
 */
export type IStylesheetHandle = Required<IActionHandle<IStylesheetOptions>>;

/**
 * Represents the options passable to the [[stylesheet]] Svelte Action
 */
export interface IStylesheetOptions {
    stylesheet: string;
}

/**
 * Appends a `<style>` element to the targeted element, and reactively updates the
 * stylesheet with [[IStylesheetOptions.value]]
 *
 * **NOTE**: This is an alternative to `<svelte:head><style>...</style></svelte:head>` that
 * also supports dynamic stylesheet values
 *
 * @param element
 * @param options
 * @returns
 */
export function stylesheet(
    element: HTMLElement,
    options: Partial<IStylesheetOptions> = {}
): IStylesheetHandle {
    let {stylesheet = ""} = options;

    const stylesheet_element = document.createElement("style");

    stylesheet_element.setAttribute("data-pipeline-stylesheet", "true");
    stylesheet_element.innerText = stylesheet;

    element.appendChild(stylesheet_element);

    return {
        update(options: IStylesheetOptions) {
            ({stylesheet = ""} = options);

            stylesheet_element.innerText = stylesheet;
        },

        destroy() {
            stylesheet_element.remove();
        },
    };
}
