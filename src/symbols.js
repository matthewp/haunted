const symbolFor = typeof Symbol === 'function' ? Symbol.for : str => str;

export const phaseSymbol = symbolFor('haunted.phase');
export const hookSymbol = symbolFor('haunted.hook');

export const updateSymbol = symbolFor('haunted.update');
export const commitSymbol = symbolFor('haunted.commit');
export const effectsSymbol = symbolFor('haunted.effects');
export const contextSymbol = symbolFor('haunted.context');

export const contextEvent = 'haunted.context'; 
