import type {IActionHandle} from "./actions";

export type IInnerTextAction = IActionHandle<IInnerTextOptions>;

export interface IInnerTextOptions {
    on_innertext: (text: string) => void;
}

export function InnerText(element: HTMLElement, options: IInnerTextOptions): IInnerTextAction {
    let previous_inner_text = element.innerText;
    let {on_innertext: callback} = options;

    function on_mutation(mutations: MutationRecord[]) {
        const inner_text = element.innerText;
        if (inner_text !== previous_inner_text) {
            previous_inner_text = inner_text;
            callback(inner_text);
        }
    }

    const observer = new MutationObserver(on_mutation);
    observer.observe(element, {characterData: true, characterDataOldValue: true, subtree: true});

    return {
        destroy() {
            observer.disconnect();
        },

        update(options) {
            ({on_innertext: callback} = options);
        },
    };
}
