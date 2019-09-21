import { State, Callable } from './state';
import { layoutEffectsSymbol } from './symbols';
import { createEffect } from './create-effect';

function setLayoutEffects(state: State, cb: Callable) {
  state[layoutEffectsSymbol].push(cb);
}

const useLayoutEffect = createEffect(setLayoutEffects);

export { useLayoutEffect };
