import { useMemo } from './use-memo';

const useRef = <T>(initialValue: T) => useMemo(() => ({
    current: initialValue
}), []);

export { useRef }
