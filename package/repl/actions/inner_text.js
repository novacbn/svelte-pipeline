export function InnerText(element, options) {
    let previous_inner_text = element.innerText;
    let {on_innertext: callback} = options;
    function on_mutation(mutations) {
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
