import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

import BlackMenuListElement from './components/BlackMenuListElement';
import BlackSelect from './components/BlackSelect';

const useStyles = createUseStyles({
    selectStyles: {
        width: '50vw',
        marginLeft: 20,
    },
    listClassName: {
        width: 200,
    },
    listElementClassName: {
        padding: '2px 20px',
        borderBottom: '1px solid white',
    },
    '@global': {
        body: {
            margin: 0,
        },
    },
});

interface ISelector {
    value: string;
    displayedValue: string;
}

function App(): React.ReactElement<HTMLDivElement> {
    const classes = useStyles();
    const selectors: Array<ISelector> = [
        { value: '10', displayedValue: 'Десять' },
        { value: '20', displayedValue: 'Двадцать' },
        { value: '30', displayedValue: 'Тридцать' },
    ];

    const [value, setValue] = useState('');
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');

    const handleChange = (newValue: string): void => {
        setValue(newValue);
    };
    const handleChange1 = (newValue: string): void => {
        setValue1(newValue);
    };
    const handleChange2 = (newValue: string): void => {
        setValue2(newValue);
    };

    return (
        <div>
            <BlackSelect
                onChange={handleChange}
                value={value}
                className={classes.selectStyles}
                label="Label"
                listClassName={classes.listClassName}
                key={'bs1'}
            >
                {selectors.map((menuProps) => (
                    <BlackMenuListElement
                        listElementClassName={classes.listElementClassName}
                        value={menuProps.value}
                        displayedValue={menuProps.displayedValue}
                        key={menuProps.value}
                    />
                ))}
            </BlackSelect>

            <BlackSelect
                onChange={handleChange1}
                value={value1}
                className={classes.selectStyles}
                label="Label"
                listClassName={classes.listClassName}
                key={'bs2'}
            >
                {selectors.map((menuProps) => (
                    <BlackMenuListElement
                        listElementClassName={classes.listElementClassName}
                        value={menuProps.value}
                        displayedValue={menuProps.displayedValue}
                        key={menuProps.value}
                    />
                ))}
            </BlackSelect>

            <BlackSelect
                onChange={handleChange2}
                value={value2}
                className={classes.selectStyles}
                label="Label"
                listClassName={classes.listClassName}
                key={'bs3'}
            >
                {selectors.map((menuProps) => (
                    <BlackMenuListElement
                        listElementClassName={classes.listElementClassName}
                        value={menuProps.value}
                        displayedValue={menuProps.displayedValue}
                        key={menuProps.value}
                    />
                ))}
            </BlackSelect>
        </div>
    );
}

export default App;
