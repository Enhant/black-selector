import React, { forwardRef } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
import {IMenuListProps} from '../../../interfaces';

const useStyles = createUseStyles<{ positionStyle: { top: number, left: number } }>(({ positionStyle }) => ({
    menu: {
        backgroundColor: 'black',
        position: 'fixed',
        padding: 0,
    },
    positionStyle: {
        top: ({positionStyle}) => positionStyle?.top,
        left: ({positionStyle}) => positionStyle?.left
    }
}));

const MenuList = forwardRef<HTMLUListElement, IMenuListProps>((props : IMenuListProps, ref : React.Ref<HTMLUListElement>) => {
    const {
        listClassName,
        items,
        positionStyle
    } = props;
    const classes = useStyles({positionStyle});
    return (
        <ul className={clsx(classes.menu, listClassName, classes.positionStyle)} ref={ref} tabIndex={0} onKeyDown={props.onKeyDown}>
            {items}
        </ul>
    );
});

export default MenuList;