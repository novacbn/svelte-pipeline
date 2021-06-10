export declare function debounce<F extends (...args: any[]) => void | Promise<void>>(func: F, duration?: number): (...args: Parameters<F>) => void | Promise<void>;
export declare function timeout(callback: () => void, duration?: number): () => void;
