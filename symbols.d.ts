declare const phaseSymbol: unique symbol;
declare const hookSymbol: unique symbol;
declare const updateSymbol: unique symbol;
declare const commitSymbol: unique symbol;
declare const effectsSymbol: unique symbol;
declare const layoutEffectsSymbol: unique symbol;
declare type EffectsSymbols = typeof effectsSymbol | typeof layoutEffectsSymbol;
declare type Phase = typeof updateSymbol | typeof commitSymbol | typeof effectsSymbol;
declare const contextEvent = "haunted.context";
export { phaseSymbol, hookSymbol, updateSymbol, commitSymbol, effectsSymbol, layoutEffectsSymbol, contextEvent, Phase, EffectsSymbols, };
