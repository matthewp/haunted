import { commitSymbol } from './symbols.js';
import { current, notify } from './interface.js';

function useEffect(callback) {
  let id = notify();
  if(!(commitSymbol in current)) {
    current[commitSymbol] = new Map();
  }
  current[commitSymbol].set(id, callback);
}

export { useEffect };