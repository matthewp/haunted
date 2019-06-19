import { useMemo } from "./use-memo.js";

const useRef = (initialValue) => {
    return useMemo(() => {
        return {
            current: initialValue
        };
    }, []);
}

export { useRef }