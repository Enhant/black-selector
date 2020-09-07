import React, {ReactNode} from 'react';

interface standartProp {
    children?: ReactNode;
}

export interface IBlackMenuList extends standartProp {
    listElementClassName?: string;
    value: string;
    displayedValue: string;
    onClick?: (e : React.MouseEvent) => void;
    selected?: boolean;
}

export interface IPopover extends standartProp {
    onClose?: (event : React.MouseEvent) => void;
    handleListKeyDown?: (event : React.KeyboardEvent) => void;
}

export interface IMenuProps {
    children?: React.ReactNode;
    onClose?: (event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent) => void;
    isOpen?: boolean;
    anchorRef: HTMLDivElement | null;
    marginThreshold?: number;
    listClassName?: string;
    id?: string;
    onKeyDown?: (e : React.KeyboardEvent) => void;
}

export interface IMenuListProps {
    listClassName?: string;
    children?: React.ReactNode;
    items?: React.ReactNode;
    positionStyle?: { top: number, left: number }
    onKeyDown?: (e : React.KeyboardEvent) => void;
}

export interface ISelectProps {
    disabled?: boolean
    ariaLabel?: string
    readOnly?: boolean
    name?: string
    inputRefProp?: HTMLInputElement;
    autoFocus?: boolean;
    labelId?: string;
    defaultValue?: string;
    valueProp?: string;
    value?: string;
    onChange?: (newValue: string) => void,
    onOpen?: (event: React.MouseEvent | React.KeyboardEvent) => void,
    onClose?: (event: React.MouseEvent | React.KeyboardEvent) => void,
    displayEmpty?: boolean,
    openSelect?: boolean
    label?: string
    listClassName?: string
    children?: React.ReactNode;
    labelColor?: string
    sizeProps?: object;
    className?: string;
    displayClassName?: string;
  }