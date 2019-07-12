import { makeContainer } from './container.js';
import { makeComponent } from './component.js';
import { makeContext } from './create-context.js';

function haunted({ render }) {
  const Container = makeContainer(render);
  const component = makeComponent(Container);
  const createContext = makeContext(component);

  return { Container, component, createContext };
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