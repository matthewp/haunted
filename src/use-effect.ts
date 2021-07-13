import { State, Callable } from './state';
import { effectsSymbol } from './symbols';
import { createEffect } from './create-effect';

function setEffects(state: State, cb: Callable) {
  state[effectsSymbol].push(cb);
}

/**
 * @function
 * @param {() => void} effect - callback function that runs each time dependencies change
 * @param {unknown[]} [dependencies] - list of dependencies to the effect
 * @return {void}
 */
const useEffect = createEffect(setEffects);

export { setEffects, useEffect };
