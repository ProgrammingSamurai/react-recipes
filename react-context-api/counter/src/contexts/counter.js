import { createContext } from 'react';

export const CounterContext = createContext({
  count: null,
  increment: () => {},
  decrement: () => {}
})
