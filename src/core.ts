import { makeComponent } from './component';
import { makeContext } from './create-context';

type GenericRenderer = (this: unknown, ...args: any[]) => unknown | void;
type RenderFunction = (result: unknown, container: DocumentFragment | Element) => void;

function haunted({ render }: { render: RenderFunction }) {
  const component = makeComponent(render);
  const createContext = makeContext(component);

  return { component, createContext };
}

export { haunted as default, GenericRenderer, RenderFunction };
export { useCallback } from './use-callback';
export { useEffect } from './use-effect';
export { useState } from './use-state';
export { useReducer } from './use-reducer';
export { useMemo } from './use-memo';
export { useContext } from './use-context';
export { useRef } from './use-ref';
export { hook, Hook } from './hook';
export { BaseScheduler } from './scheduler';
export { State } from './state';
