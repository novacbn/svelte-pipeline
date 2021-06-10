import type { IActionHandle } from "./actions";
export declare type IInnerTextAction = IActionHandle<IInnerTextOptions>;
export interface IInnerTextOptions {
    on_innertext: (text: string) => void;
}
export declare function InnerText(element: HTMLElement, options: IInnerTextOptions): IInnerTextAction;
