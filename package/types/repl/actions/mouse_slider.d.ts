import type { IActionHandle } from "./actions";
export declare type IMouseSliderAction = IActionHandle<IMouseSliderOptions>;
export interface IMouseSliderOptions {
    horizontal?: boolean;
    on_move: (percentage: number) => void;
    on_state?: (grabbing: boolean) => void;
    target?: HTMLElement;
}
export declare function mouse_slider(element: HTMLElement, options: IMouseSliderOptions): {
    update(options: IMouseSliderOptions): void;
    destroy(): void;
};
