import { useMemo } from 'react';

const setRef = function (ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
};

export default function useForkRef(refA, refB) {
    return useMemo(() => {
        if (refA == null && refB == null) {
            return null;
        }
        return (refValue) => {
            setRef(refA, refValue);
            setRef(refB, refValue);
        };
    }, [refA, refB]);
}
