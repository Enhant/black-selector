import React, {useState} from 'react';
import styles from 'styled-components';
import BlackMenuList from './components/BlackMenuList';
import BlackSelect from './components/BlackSelect';

const Background = styles.div`
  background-color: black;
`

function App() {
  const [ selectors, setSelectors ] = useState([
      { value: '10', displayedValue: 'Десять' },
      { value: '20', displayedValue: 'Двадцать' },
      { value: '30', displayedValue: 'Тридцать' },
    ]);

  return (
    <Background>
      { selectors.map( selector => (
        <BlackSelect>
          {
            selectors.map( menuProps => <BlackMenuList value={ menuProps.value } displayedValue={ menuProps.displayedValue }/> )
          }
        </BlackSelect>
      ) ) }
    </Background>
  );
}

export default App;
