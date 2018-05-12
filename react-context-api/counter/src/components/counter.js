import React from 'react';

import { CounterContext } from '../contexts/counter'

const Counter = () => (
  <CounterContext.Consumer>
    {
      ({ count, increment, decrement }) =>  {
        return (
          <React.Fragment>
            <div>count: {count}</div>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
          </React.Fragment>
        )
      }
    }
  </CounterContext.Consumer>
)

export default Counter
