import React from 'react';
import ReactDOM from 'react-dom';
import HelloMessage from './sub';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello React!</h1>
        <HelloMessage
          message="with Babel & webpack"
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-root'));
