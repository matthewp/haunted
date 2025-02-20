const phaseSymbol = Symbol("haunted.phase");
const hookSymbol = Symbol("haunted.hook");

const updateSymbol = Symbol("haunted.update");
const commitSymbol = Symbol("haunted.commit");
const effectsSymbol = Symbol("haunted.effects");
const layoutEffectsSymbol = Symbol("haunted.layoutEffects");

type EffectsSymbols = typeof effectsSymbol | typeof layoutEffectsSymbol;
type Phase = typeof updateSymbol | typeof commitSymbol | typeof effectsSymbol;

const contextEvent = "haunted.context";

export {
  phaseSymbol,
  hookSymbol,
  updateSymbol,
  commitSymbol,
  effectsSymbol,
  layoutEffectsSymbol,
  contextEvent,
  Phase,
  EffectsSymbols,
};
