import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import clsx from 'clsx';
import useForkRef from '../../hooks/useForkRef';
import useControlled from '../../hooks/useControlled';

import Menu from './components/Menu';

import { createUseStyles } from 'react-jss';
import { ISelectProps, IBlackMenuList } from '../../interfaces';
import ownerDocument from '../../utils/ownerDocument';

function isEmpty(displayValue : null | string | undefined ) : null | string | boolean {
    return displayValue == null || (typeof displayValue === 'string' && !displayValue.trim());
}

type Entry = [ string, string ];

type Entries = Array<Entry>

type valueType = string | undefined | ((newValue: any) => void)

function areEqualValues(a : valueType, b : valueType) : boolean {
    if (typeof a === 'string' && typeof b === 'string') {
        return a === b;
    }
    if (a && b) {
        const ent1 : Entries = Object.entries(a);
        const ent2 : Entries = Object.entries(b);
        if (ent1.length !== ent2.length) return false;
        // @ts-ignore
        return ent1.every(([key, value]: Entry) => value === ent2[key]);
    }
    return false;
}

interface isFilledObject {
  value: string;
  defaultValue?: string | undefined;
}

function isFilled(obj : isFilledObject, SSR = false) {
    function hasValue(value : string | undefined) {
        return value != null && !(Array.isArray(value) && value.length === 0);
    }

    return (
        obj &&
        ((hasValue(obj.value) && obj.value !== '') || (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== ''))
    );
}

interface stylesProps {
  width: string;
  height: string;
  border: string;
  padding: number;
  labelColor: string;
  paddingTop: string;
}

const useStyles = createUseStyles((props : stylesProps) => ({
    input: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        opacity: 0,
        pointerEvents: 'none',
    },
    defaultSelectorInputStyles: {
        width: () => props.width || 'calc(100% - 10px)',
        minWidth: 120,
        height: () => props.height || 19,
        border: () => props.border || `1px solid #c1c1c1`,
        padding: () => props.padding || '5px 0 5px 5px',
        tabIndex: '0',
    },
    defaultLabel: {
        color: () => props.labelColor || '#c1c1c1',
        transform: () =>
            `translate(${5}px, ${
                props.height + (props.paddingTop ? props.paddingTop : Number.isInteger(props.padding) ? props.padding / 2 : 0) || 21.5
            }px) scale(1)`,
    },
}));



const BlackSelect = React.forwardRef<HTMLUListElement, ISelectProps>((props, ref) => {
    const {
        disabled,
        ariaLabel,
        readOnly,
        name,
        inputRefProp,
        autoFocus,
        labelId,
        defaultValue,
        value: valueProp,
        onChange,
        children,
        onOpen,
        onClose,
        displayEmpty,
        openSelect: openProp,
        label,
        listClassName,
        labelColor,
        sizeProps,
        displayClassName
    } = props;

    const classes = useStyles({
        ...sizeProps,
        labelColor: labelColor,
    });
    const inputRef = useRef(null);
    const [displayNode, setDisplayNode] = useState<HTMLDivElement | null>(null);
    const [openState, setOpenState] = useState(false);
    const handleRef = useForkRef(ref, inputRefProp);
    const { current: isOpenControlled } = useRef(openProp != null);
    const menuRef = useRef<HTMLUListElement | null>(null)

    const [value, setValue] = useControlled({
        controlled: valueProp,
        default: defaultValue
    });


    const createHandle = () => ({
        focus: () => {
            if (typeof displayNode !== 'function') {
                displayNode!.focus();
            }
        },
        node: inputRef.current,
        value : value,
    })

    useImperativeHandle(
        handleRef,
        createHandle,
        [displayNode, value],
    );

    useEffect(() => {
        if (autoFocus && displayNode) {
            if (typeof displayNode !== 'function') {
                displayNode!.focus();
            }
        }
    }, [autoFocus, displayNode, menuRef]);

    useEffect(() => {
        if (displayNode && labelId && typeof displayNode !== 'function') {
            const labelElem = displayNode!.ownerDocument.getElementById(labelId);
            if (labelElem) {
                const handler = () => {
                    if (getSelection && getSelection()!.isCollapsed) {
                        if (typeof displayNode !== 'function') {
                            displayNode!.focus();
                        }
                    }
                };
                labelElem.addEventListener('click', handler);
                return () => {
                    labelElem.removeEventListener('click', handler);
                };
            }
        }

        return undefined;
    }, [labelId, displayNode]);

    const keyboardListElemActions = (action : string, event?: React.KeyboardEvent) => {
        const activeListElem = ownerDocument(menuRef.current).activeElement;
        if (activeListElem.tagName === "DIV") {
            // @ts-ignore
            menuRef?.current?.children[0].focus();
        }
        if (activeListElem.tagName === "LI") {
            if (action === 'down') {
                if (activeListElem.nextSibling){
                    activeListElem.nextSibling.focus();
                } else {
                    // @ts-ignore
                    menuRef?.current?.firstChild?.focus();
                }
            } 
            if (action === 'up') {
                if (activeListElem.previousSibling){
                    activeListElem.previousSibling.focus();
                } else {
                    // @ts-ignore
                    menuRef?.current?.lastChild?.focus();
                }
            }
            if (action === 'select' && !!event) {
                    
            }
    }

    const handleKeyDown = (e : React.KeyboardEvent) => {
        if (!readOnly) {
            const validKeys = ['', 'ArrowUp', 'ArrowDown', 'Enter', 'Escape'];
            if (validKeys.indexOf(e.key) !== -1) {
                e.preventDefault();
            }
            if (validKeys.indexOf(e.key) === 3) {
                e.preventDefault();
                update(true, e);
                keyboardListElemActions('select', e)
            }
            if (validKeys.indexOf(e.key) === 4) {
                e.preventDefault();
                update(false, e);
            }
            if (validKeys.indexOf(e.key) === 1) {
                e.preventDefault();
                keyboardListElemActions('up');
            }
            if (validKeys.indexOf(e.key) === 2) {
                e.preventDefault();
                keyboardListElemActions('down');
            }
        }
    };

    let display;

    const childrenArray = React.Children.toArray(children);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const index = childrenArray.map((child) => child!.props.value).indexOf(e.target.value);

        if (index === -1) {
            return;
        }

        const child = childrenArray[index];
        // @ts-ignore
        setValue(child.props.value);

        if (onChange) {
            onChange(e.target.value);
        }
    };

    const update = (openSelect : boolean, event : React.MouseEvent | React.KeyboardEvent) => {
        if (openSelect) {
            if (onOpen) {
                onOpen(event);
            }
            // @ts-ignore
            document.body.style = 'overflow: hidden';

        } else {
            // @ts-ignore
            document.body.style = 'overflow: auto';
            if (onClose) {
                onClose(event);
            }
        }

        if (!isOpenControlled) {
            setOpenState(openSelect);
        }
    };

    const items = childrenArray.map((child) => {
        if (!React.isValidElement(child)) {
            return null;
        }

        const selected = areEqualValues(value, child.props.value);

        if (selected) {
            display = child.props.value;
        }

        const handleItemClick = (listElementChild : { props: IBlackMenuList }) => (event : React.MouseEvent) => {
            const newValue = listElementChild.props.value;

            if (listElementChild.props.onClick) {
                listElementChild.props.onClick(event);
            }

            if (value !== newValue) {
                // @ts-ignore
                setValue(newValue);
                if (onChange) {
                    event.persist();
                    onChange(newValue);
                }
            }

            update(false, event);
        };

        return React.cloneElement(child, {
            'aria-selected': selected ? 'true' : undefined,
            onClick: handleItemClick(child),
            onKeyUp: (event : React.KeyboardEvent) => {
                if (event.key === ' ') {
                    event.preventDefault();
                }

                if (child.props.onKeyUp) {
                    child.props.onKeyUp(event);
                }
            },
            role: 'option',
            selected,
            value: undefined,
            'data-value': child.props.value,
        });
    });

    const handleClose = (event : React.KeyboardEvent | React.MouseEvent) => {
        update(false, event);
    };

    const handleMouseDown = (e : React.MouseEvent) => {
        if (e.button !== 0) {
            return;
        }

        e.preventDefault();
        if (typeof displayNode !== 'function') {
            // @ts-ignore
            displayNode?.focus();
        }

        update(true, e);
    };



    return (
        <div className={props.className}>
            <label onMouseDown={readOnly ? undefined : handleMouseDown}>
                <input
                    value={Array.isArray(value) ? value.join(',') : value}
                    name={name}
                    ref={inputRef}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoFocus={autoFocus}
                    className={classes.input}
                />
                <div className={classes.defaultLabel}>
                    {isEmpty(display) ? label : <span dangerouslySetInnerHTML={{ __html: '&#8203;' }} />}
                </div>
                <div
                    className={clsx(displayClassName, classes.defaultSelectorInputStyles)}
                    /* @ts-ignore */
                    ref={setDisplayNode}
                    role="button"
                    aria-disabled={disabled ? 'true' : undefined}
                    aria-haspopup="listbox"
                    aria-label={ariaLabel}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {isEmpty(display) ? <span dangerouslySetInnerHTML={{ __html: '&#8203;' }} /> : display}
                </div>
            </label>
            <Menu
                id={`menu-${name || ''}`}
                isOpen={openState}
                onClose={handleClose}
                onKeyDown={handleKeyDown}
                listClassName={listClassName}
                anchorRef={displayNode}
                ref={menuRef}
            >
                {items}
            </Menu>
        </div>
    );
});

export default BlackSelect;
