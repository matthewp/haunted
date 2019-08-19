import { makeScheduler } from './scheduler.js';
import { makeComponent } from './component.js';
import { makeContext } from './create-context.js';

function haunted({ render }) {
  const Scheduler = makeScheduler(render);
  const component = makeComponent(Scheduler);
  const createContext = makeContext(component);

  return { Scheduler, component, createContext };
}

export { haunted as default };
export { useCallback } from "./use-callback.js";
export { useEffect } from './use-effect.js';
export { useState } from './use-state.js';
export { useReducer } from './use-reducer.js';
export { useMemo } from './use-memo.js';
export { useContext } from './use-context.js';
export { useRef } from './use-ref.js';
export { hook, Hook } from './hook.js';
export { State } from './state.js';
