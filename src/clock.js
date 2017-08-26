import React, { Component } from 'react';
import './clock.css';

const Button = (props) => <button>{ props.name }</button>;

class Clock extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Button name={ "Start" } />
        <Button name={ "Stop" } />
      </div>
    );
  }
}


export default Clock
