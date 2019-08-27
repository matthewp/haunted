import { useMemo } from './use-memo.js';

const useRef = (initialValue) => useMemo(() => ({
    current: initialValue
}), []);

export { useRef }
