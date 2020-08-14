import React, {forwardRef, useRef, Children, isValidElement} from 'react';
import styles from 'styled-components';

const RTL_ORIGIN = {
    vertical: 'top',
    horizontal: 'right'
}

const BlackMenu = styles.div`
    width: 100%;
`

function setRef(ref, value) {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
}
  

const Menu = forwardRef( function Menu(props, ref) {
    const {
        autoFocus = true,
        children, 
        disableAutoFocusItem = false,
        MenuListProps = {},
        onClose,
        onEntering,
        open,
        PaperProps={},
        PopoverClasses,
        transitionDuration='auto',
        variant = 'selectedMenu',
        ...other
    } = props;

    const autoFocusItem = autoFocus && !disableAutoFocusItem && open;

    const menuListActionRef = useRef(null);
    const contentAnchorRef = useRef(null);

    const getContentAnchorEl = () => contentAnchorRef.current;

    const handleEntering = (element, isAppearing) => {
        if (onEntering) {
            onEntering(element, isAppearing);
        }
    }

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();

            if (onClose) {
                onClose(event, 'tabKeyDown');
            }
        }
    };
    
    let activeItemIndex = -1;

    Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
            return;
        }

        if (!child.props.disabled) {
            if ((variant === 'selectedMenu' && child.props.selected) || activeItemIndex === -1) {
                activeItemIndex = index;
            }
        }
    })

    const items = Children.map(children, (child, index) => {
        if (index === activeItemIndex) {
          return React.cloneElement(child, {
            ref: (instance) => {
              contentAnchorRef.current = instance;
              setRef(child.ref, instance);
            },
          });
        }
    
        return child;
    });

    return (
        <BlackMenu>
            {items}
        </BlackMenu>    
    )
});

export default Menu;