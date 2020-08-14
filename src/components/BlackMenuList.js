import React from 'react';
import styles from 'styled-components';

const BlackMenuListDiv = styles.div`
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
`

const BlackMenuList = (props) => {
    
    return (
        <BlackMenuListDiv>
            {props.displayedValue}
        </BlackMenuListDiv>
    )
}

export default BlackMenuList