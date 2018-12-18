import { useMemo } from "./use-memo.js";

const useCallback = (fn, inputs) => useMemo(() => fn, inputs);

export { useCallback };
