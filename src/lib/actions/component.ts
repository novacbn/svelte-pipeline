import type {SvelteComponent} from "svelte";

import type {IActionHandle} from "./actions";

/**
 * Represents the Svelte Action handle returned by [[component]]
 */
export type IComponentHandle = Required<IActionHandle<IComponentOptions>>;

/**
 * Represents the typing for the [[IComponentOptions.on_error]] callback
 */
export type IComponentErrorCallback = (error: Error) => void;

/**
 * Represents the typings for the [[IComponentOptions.on_destroy]] / [[IComponentOptions.on_mount]] callback
 */
export type IComponentLifecycleCallback = (component: SvelteComponent) => void;

/**
 * Represents the options passable to the [[component]] Svelte Action
 */
export interface IComponentOptions {
    /**
     * Represents the callback that's dispatched right before the previously supplied
     * Svelte Component instance is destroyed
     */
    on_destroy: IComponentLifecycleCallback;

    /**
     * Represents the callback that's dispatched when the mounting of a new
     * Svelte Component instance has thrown an exception
     */
    on_error: IComponentErrorCallback;

    /**
     * Represents the callback that's dispatched right after the current Svelte Component
     * instance has been successfully mounted
     */
    on_mount: IComponentLifecycleCallback;

    /**
     * Represents the Svelte Component constructor that will be mounted
     */
    Component: typeof SvelteComponent;

    /**
     * Represents the optional Svelte Context that will be passed onto the Component
     */
    context: Map<any, any>;

    /**
     * Represents the optional properties that will be passed into the Component
     */
    props: Record<string, any>;
}

/**
 * Mounts a compiled Svelte Component to the given element, and reactively remounts
 * every change to the options
 *
 * **NOTE**: This is an alternative to `<svelte:component this={Component}>...</svelte:component>` that
 * also supports lifecycle + error handling callbacks
 *
 * @param element
 * @param options
 * @returns
 */
export function component(
    element: HTMLElement,
    options: Partial<IComponentOptions> = {}
): IComponentHandle {
    let {on_destroy, on_error, on_mount, Component, context = new Map(), props = {}} = options;
    let component: SvelteComponent | null = null;

    element.setAttribute("data-pipeline-component", "true");

    function try_destroy(): void {
        if (!component) return;
        if (on_destroy) on_destroy(component);

        component.$destroy();
        component = null;
    }

    function try_mount(): void {
        try_destroy();
        if (!Component) return;

        try {
            component = new Component({
                target: element,

                context,
                props,
            });
        } catch (err) {
            if (on_error) on_error(err as Error);
            return;
        }

        if (on_mount) on_mount(component);
    }

    function try_update(): void {
        if (!component) return;

        component.$set(props);
    }

    try_mount();

    return {
        update(options: IComponentOptions) {
            ({on_destroy, on_error, on_mount} = options);

            if (options.Component !== Component || options.context !== context) {
                ({Component, context = new Map(), props = {}} = options);

                try_mount();
            } else if (options.props !== props) {
                ({props = {}} = options);

                try_update();
            }
        },

        destroy() {
            try_destroy();

            element.removeAttribute("data-pipeline-component");
        },
    };
}
