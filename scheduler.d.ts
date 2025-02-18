import { State } from './state';
import { commitSymbol, phaseSymbol, updateSymbol, effectsSymbol, Phase, EffectsSymbols } from './symbols';
import { GenericRenderer, ComponentOrVirtualComponent } from './core';
import { ChildPart } from 'lit/html';
declare abstract class BaseScheduler<P extends object, T extends HTMLElement | ChildPart, R extends GenericRenderer<T, P>, H extends ComponentOrVirtualComponent<T, P>> {
    renderer: R;
    host: H;
    state: State<H>;
    [phaseSymbol]: Phase | null;
    _updateQueued: boolean;
    constructor(renderer: R, host: H);
    update(): void;
    handlePhase(phase: typeof commitSymbol, arg: unknown): void;
    handlePhase(phase: typeof updateSymbol): unknown;
    handlePhase(phase: typeof effectsSymbol): void;
    render(): unknown;
    runEffects(phase: EffectsSymbols): void;
    abstract commit(result: unknown): void;
    teardown(): void;
}
export { BaseScheduler };
