import React from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
import { IBlackMenuList } from '../interfaces';

const useStyles = createUseStyles({
    menuListElement: {
        fontSize: 20,
        color: 'white',
        listStyle: 'none',
        cursor: 'pointer',
        "&:focus, &:hover": {
            background: 'gray',
        }
    },
    selectedMenuList: {
        color: 'black',
        background: 'white'
    },
});

const BlackMenuListElement = (props : IBlackMenuList) => {
    const classes = useStyles();
    return (
        <li 
            className={clsx(classes.menuListElement, props.listElementClassName, props.selected && classes.selectedMenuList )} 
            onClick={props.onClick}
            tabIndex={1}
            onKeyDown={props.onKeyDown}
        >
            {props.displayedValue}
        </li>
    );
};

export default BlackMenuListElement;
