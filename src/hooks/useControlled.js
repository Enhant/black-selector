import React, {useRef, useState, useEffect, useCallback} from 'react';

export default function useControlled({ controlled, default: defaultProp, name, state='value' }) {
    const {current: isControlled} = useRef(controlled !== undefined);
    const [valueState, setValue] = useState(defaultProp);
    const value = isControlled ? controlled : valueState;

    const { current: defaultValue } = useRef(defaultProp);

    const setValueIfUncontrolled = useCallback((newValue) => {
        if (!isControlled) {
            setValue(newValue)
        }
    }, [])

    return [value, setValueIfUncontrolled];
}