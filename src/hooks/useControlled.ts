import { useRef, useState, useCallback } from 'react';

interface useControlledProps {
    controlled?: string;
    default?: string;
}

export default function useControlled({
    controlled,
    default: defaultProp,
}: useControlledProps): [string, (newValue: string) => void] {
    const { current: isControlled } = useRef(controlled !== undefined);
    const [valueState, setValue] = useState(defaultProp);
    const value: string = (isControlled ? controlled : valueState) || '';

    const setValueIfUncontrolled = useCallback((newValue) => {
        if (!isControlled) {
            setValue(newValue);
        }
    }, []);

    return [value, setValueIfUncontrolled];
}
