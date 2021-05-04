import { makeComponent, ComponentCreator } from './component';
import { makeContext, ContextCreator } from './create-context';

type GenericRenderer = (this: unknown, ...args: any[]) => unknown | void;
type RenderFunction = (result: unknown, container: DocumentFragment | Element) => void;

interface Options {
  render: RenderFunction;
}

function haunted({ render }: Options): { component: ComponentCreator, createContext: ContextCreator } {
  const component = makeComponent(render);
  const createContext = makeContext(component);

  return { component, createContext };
}

export { haunted as default, Options, GenericRenderer, RenderFunction };
export { useCallback } from './use-callback';
export { useController } from './use-controller';
export { useEffect } from './use-effect';
export { useLayoutEffect } from './use-layout-effect';
export { useState } from './use-state';
export { useReducer } from './use-reducer';
export { useMemo } from './use-memo';
export { useContext } from './use-context';
export { useRef } from './use-ref';
export { hook, Hook } from './hook';
export { BaseScheduler } from './scheduler';
export { State } from './state';
