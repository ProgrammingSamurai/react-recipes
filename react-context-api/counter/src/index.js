import React from 'react';
import ReactDOM from 'react-dom';
import { CounterContext } from './contexts/counter'
import Counter from './components/counter'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      count: 0,
      increment: () => this.setState(state => ({count: state.count + 1})),
      decrement: () => this.setState(state => ({count: state.count - 1}))
    }
  }

  render() {
    return (
      <CounterContext.Provider value={this.state} >
        <Counter />
      </CounterContext.Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
