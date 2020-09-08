import React, { forwardRef, useRef, Children, isValidElement, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import MenuList from './MenuList';
import Popover from './Popover';
import { IMenuProps } from '../../../interfaces';
import setRef from '../../../utils/setRef';

const Menu = forwardRef<HTMLUListElement, IMenuProps>((props, ref) => {
    const { children, onClose, isOpen, anchorRef, marginThreshold = 16, listClassName, id } = props;

    const [containerEl] = useState(document.createElement('div'));

    useEffect(() => {
        document.body.appendChild(containerEl);
        return () => {
            document.body.removeChild(containerEl);
        };
    });

    const getPositionStyle = useCallback(
        (element) => {
            let top = element.offsetTop;
            const left = element.offsetLeft;
            if (top < marginThreshold) {
                const diff = top - marginThreshold;
                top -= diff;
            }
            return {
                top: Math.round(top),
                left: Math.round(left),
            };
        },
        [anchorRef, marginThreshold],
    );

    const contentAnchorRef = useRef<React.Ref<HTMLUListElement>>(null);

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();

            if (onClose) {
                onClose(event);
            }
        }
    };

    let activeItemIndex = -1;

    Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
            return;
        }

        if (!child.props.disabled) {
            if (child.props.selected || activeItemIndex === -1) {
                activeItemIndex = index;
            }
        }
    });

    const getItems = (children: React.ReactNode | undefined) =>
        Children.map(children, (child, index: number) => {
            if (index === activeItemIndex) {
                return React.cloneElement(child as React.ReactElement, {
                    ref: (
                        instance: ((instance: HTMLUListElement | null) => void) | null | React.Ref<HTMLUListElement>,
                    ) => {
                        contentAnchorRef.current = instance;
                        // @ts-ignore
                        setRef(child?.ref, instance);
                    },
                });
            }

            return child;
        });

    const items = getItems(children);

    if (isOpen) {
        return createPortal(
            <Popover onClose={onClose} handleListKeyDown={handleListKeyDown}>
                <MenuList
                    items={items}
                    ref={ref}
                    listClassName={listClassName}
                    positionStyle={getPositionStyle(anchorRef)}
                    onKeyDown={props.onKeyDown}
                    id={id}
                />
            </Popover>,
            containerEl,
        );
    }

    return <div />;
});

export default Menu;
