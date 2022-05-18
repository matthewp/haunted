import { Hook } from './hook';
import { hookSymbol, effectsSymbol, layoutEffectsSymbol, EffectsSymbols } from './symbols';
interface Callable {
    call: (state: State) => void;
}
declare class State<H = unknown> {
    update: VoidFunction;
    host: H;
    virtual?: boolean;
    [hookSymbol]: Map<number, Hook>;
    [effectsSymbol]: Callable[];
    [layoutEffectsSymbol]: Callable[];
    constructor(update: VoidFunction, host: H);
    run<T>(cb: () => T): T;
    _runEffects(phase: EffectsSymbols): void;
    runEffects(): void;
    runLayoutEffects(): void;
    teardown(): void;
}
export { State, Callable };
