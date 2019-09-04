const phaseSymbol = Symbol.for('haunted.phase');
const hookSymbol = Symbol.for('haunted.hook');

const updateSymbol = Symbol.for('haunted.update');
const commitSymbol = Symbol.for('haunted.commit');
const effectsSymbol = Symbol.for('haunted.effects');
const layoutEffectsSymbol = Symbol.for('haunted.layoutEffects');

type EffectsSymbols = typeof effectsSymbol | typeof layoutEffectsSymbol;
type Phase = typeof updateSymbol | typeof commitSymbol | typeof effectsSymbol;

const contextEvent = 'haunted.context';

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
