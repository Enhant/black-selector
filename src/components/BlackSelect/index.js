import React, {useState, useRef, useImperativeHandle, useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useForkRef from '../../hooks/useForkRef';
import useControlled from '../../hooks/useControlled';

import Menu from './components/Menu'

function isEmpty(displayValue) {
    return displayValue == null || (typeof displayValue === 'string' && !displayValue.trim());
}

function areEqualValues(a, b) {
    if ( a && b ) {
        
    const ent1 = Object.entries(a);
    const ent2 = Object.entries(b);

    if (ent1.length !== ent2.length) return false;
    return ent1.every(([key, value]) => value === ent2[key]);        
    }

}

function isFilled(obj, SSR = false) {
    function hasValue(value) {
        return value != null && !(Array.isArray(value) && value.length === 0);
    }

    return (
      obj &&
      ((hasValue(obj.value) && obj.value !== '') ||
        (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== ''))
    );
  }

const BlackSelect = React.forwardRef(function BlackSelect(props, ref) {
    const {
        disabled,
        'aria-label': ariaLabel,
        readOnly,
        name,
        inputRef: inputRefProp,
        autoFocus,
        labelId,
        defaultValue,
        value: valueProp,
        onChange,
        children,
        onOpen,
        onClose,
        MenuProps = {},
        multiple,
        displayEmpty,
        renderValue,
        autoWidth,
        openSelect: openProp,
        ...other
    } = props;

    const inputRef = useRef(null);
    const [displayNode, setDisplayNode] = useState(null);
    const [menuMinWidthState, setMenuMinWidthState] = useState();
    const [openState, setOpenState] = useState(false);
    const handleRef = useForkRef(ref, inputRefProp);
    const { current: isOpenControlled } = React.useRef(openProp != null);

    const [value, setValue] = useControlled({
        controlled: valueProp,
        default: defaultValue,
        name: 'Select',
    });

    useImperativeHandle(
        handleRef,
        () => ({
            focus: () => {
                displayNode.focus();
            },
            node: inputRef.current,
            value
        }),
        [displayNode, value]
    );

    useEffect( () => {
        if (autoFocus && displayNode) {
            displayNode.focus();
        }
    }, [autoFocus, displayNode] )

    useEffect( () => { 
        if (displayNode) {
            const label = ownerDocument(displayNode).getElementById(labelId);
            if (label) {
                const handler = () => {
                    if (getSelection().isCollapsed) {
                        displayNode.focus();
                    }
                }
                label.addEventListener('click', handler);
                return () => {
                    label.removeEventListener('click', handler);
                }
            }
        } 

        return undefined;
    }, [labelId, displayNode])

    const handleKeyDown = (e) => {
        if (!readOnly) {
            const validKeys = [
                '',
                'ArrowUp',
                'ArrowDown',
                'Enter',
                'Escape'
            ];
            if (validKeys.indexOf(e.key) !== -1) {
                e.preventDefault();
            }
        };

    }

    let computeDisplay = false;
    let display;
    
    if (isFilled({ value }) || displayEmpty) {
        if (renderValue) {
          display = renderValue(value);
        } else {
          computeDisplay = true;
        }
    }

    let selected;
    let foundMatch = false;
    
    if (selected) {
        foundMatch = true;
    }

    const childrenArray = React.Children.toArray(children);

    const handleChange = (e) => {
        const index = childrenArray.map((child) => child.props.value).indexOf(e.target.value);
        
        if (index === -1) {
            return
        }

        const child = childrenArray[index];
        setValue(child.props.value);

        if (onChange) {
            onChange(e, child);
        }
    }

    let displaySingle;
    const displayMultiple = [];

    
    const update = (openSelect, event) => {
        if (openSelect) {
            if (onOpen) {
                onOpen(event)
            }
        } else if (onClose) {
            onClose(event)
        }

        if (!isOpenControlled) {
            setMenuMinWidthState(autoWidth ? null : displayNode.clientWidth);
            setOpenState(openSelect);
        }
    }

    let items = childrenArray.map( child => {
        if (!React.isValidElement(child)) {
          return null;
        }
        
        let selected;

        if (multiple) {
            if (!Array.isArray(value)) {
                throw new Error('Value is not array')
            }

            selected = value.some(v => areEqualValues(value, v));
            if (selected && computeDisplay) {
                displayMultiple.push(child.props.children);
            }
        } else {
            selected = areEqualValues(value, child.props.value);
            if (selected && computeDisplay) {
                displaySingle = child.props.children;
            }
        }

        if (computeDisplay) {
            display = multiple ? displayMultiple.join(', ') : displaySingle;
        }

        if (selected) {
            foundMatch = true;
        }

        

        const handleItemClick = (child) => (event) => {
            let newValue;

            if (multiple) {
                newValue = Array.isArray(value) ? value.slice() : [];
                const itemIndex = value.indexOf(child.props.value);
                if (itemIndex === -1) {
                    newValue.push(child.props.value);
                } else {
                    newValue.splice(itemIndex, 1);
                }
            } else {
                newValue = child.props.value;
            }

            
            if (child.props.onClick) {
                child.props.onClick(event);
            }

            if (value !== newValue) {
                setValue(newValue);
          
                if (onChange) {
                  event.persist();
                  onChange(event, child);
                }
            }
          
            if (!multiple) {
                update(false, event);
            }
        }

        return React.cloneElement(child, {
                'aria-selected': selected ? 'true' : undefined,
                onClick: handleItemClick(child),
                onKeyUp: (event) => {
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
    } )

    let menuMinWidth = menuMinWidthState;
    if (!autoWidth && isOpenControlled && displayNode) {
        menuMinWidth = displayNode.clientWidth;
    }

    const handleClose = (event) => {
        update(false, event);
    };

    return (
        <>
            <div
                className={clsx(
                    props.className
                )}
                ref={setDisplayNode}
                role="button"
                aria-disabled={disabled ? 'true' : undefined}
                aria-haspopup="listbox"
                aria-label={ariaLabel}
                onKeyDown={handleKeyDown}
            >
                {isEmpty( display ) ? (
                    <span dangerouslySetInnerHTML={{ __html: '&#8203;' }}/>
                ) : (
                    display
                )}
            </div>
            <input 
                value={Array.isArray(value) ? value.join(',') : value}
                name={name}
                ref={inputRef}
                onChange={handleChange}
                tabIndex={-1}
                autoFocus={autoFocus}
                {...other}
            />
            <Menu
                id={`menu-${name || ''}`}
                anchorEl={displayNode}
                open={openState}
                onClose={handleClose}
                {...MenuProps}
                MenuListProps={{
                    'aria-labelledby': labelId,
                    role: 'listbox',
                    disableListWrap: true,
                    ...MenuProps.MenuListProps,
                }}
                PaperProps={{
                    ...MenuProps.PaperProps,
                    style: {
                        minWidth: menuMinWidth,
                        ...(MenuProps.PaperProps != null ? MenuProps.PaperProps.style : null),
                    },
                }}
            >
                {items} 
            </Menu>
        </>
    )
});

BlackSelect.propTypes = {
    className: PropTypes.string,
}

export default BlackSelect;