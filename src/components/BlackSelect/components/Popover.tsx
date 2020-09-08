import React from 'react';
import { createUseStyles } from 'react-jss';
import { IPopover } from '../../../interfaces';

const useStyles = createUseStyles({
    popover: {
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        overflow: 'hidden',
    },
});

const Popover = React.forwardRef((props: IPopover, ref: React.Ref<HTMLDivElement>) => {
    const classes = useStyles();
    return (
        <div className={classes.popover} ref={ref} onClick={props.onClose} role="popover">
            {props.children}
        </div>
    );
});

export default Popover;
