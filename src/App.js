import React, { Component } from 'react';
import Home from './containers/Home'
import logo from './logo.svg';
import './App.css';
import './styles/index.scss';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Home/>
      </div>
    );
  }
}

export default App;
