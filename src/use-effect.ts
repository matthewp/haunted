import { State, Callable } from './state';
import { effectsSymbol } from './symbols';
import { createEffect } from './create-effect';

function setEffects(state: State, cb: Callable) {
  state[effectsSymbol].push(cb);
}

const useEffect = createEffect(setEffects);

export { setEffects, useEffect };
