import React, { Component } from 'react';
import './clock.css';

// pass api call data as props later
const Quote = (props) => {
    return(
      <p style={{fontSize: 24}}>{props.text}</p>
    );
}

const Button = (props) => {
    const btnStyle = {
      width: 150,
      height: 40,
      fontSize: 14,
      backgroundColor: "#008CBA",
      color: "white",
      borderRadius: 6
    }
    return (
      <button style={btnStyle} onClick={() => props.click()}>
        {props.name}
      </button>
    );
}


const TopButtonBar = (props) => {
    return (
      <div>
        <Button name={"Pomodoro"} click={props.pomodoro}/>
        <Button name={"Short Break"} click={props.shortBreak}/>
        <Button name={"Long Break"} click={props.longBreak}/>
      </div>
    );
}

const BottomButtonBar = (props) => {
    let now = new Date().toLocaleTimeString();
    return (
      <div>
        <Button name={"Start"} click={props.start} />
        <Button name={"Pause"} click={props.pause}/>
        <Button name={"Reset"} click={props.reset}/>
      </div>
    );
}


const Timer = (props) => {
    const timerStyle = {fontSize: 72}
    return (
      <div>
        <h2 style={timerStyle}>{props.remainingTime}</h2>
      </div>
    );
}


class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime: "25:00"
    }
  }
  addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes*60000);
}
  getRemainingTime = (stoppingTime) => {
    // refactor so that state is updated every second
    let remaining;
    setInterval(function() {
      let now = new Date().getTime(),
          diff = stoppingTime - now,

          minutesLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60)),
          secondsLeft = Math.floor((diff % (1000 *60)) / 1000),

          minutes = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft,
          seconds = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft,

          remaining = minutes + ":" + seconds;

    }, 1000);
}
  pomodoroClock = () => {
    const stopAt = this.addMinutes(new Date(), 25).getTime(); // create time to stop at in milliseconds
    const temp = this.getRemainingTime(stopAt);
    this.setState({
      remainingTime: temp
    })
  }
  shortBreakClock = () => {
    this.setState({
      remainingTime: "5:00"
    });
  }
  longBreakClock = () => {
    this.setState({
      remainingTime: "10:00"
    });
  }
  startClock = () => {
    this.setState({
      remainingTime: "started"
    });
  }

  pauseClock = () => {
    this.setState({
      remainingTime: "paused"
    });
  }
  resetClock = () => {
    this.setState({
      remainingTime: "reset"
    });
  }

  render() {
    return (
      <div>

        <Quote text={"Success is not born, but grown"}/>

        <TopButtonBar
          pomodoro={this.pomodoroClock}
          shortBreak={this.shortBreakClock}
          longBreak={this.longBreakClock} />

        <Timer remainingTime={this.state.remainingTime}/>

        <BottomButtonBar
          start={this.startClock}
          pause={this.pauseClock}
          reset={this.resetClock} />

      </div>
    );
  }
}






export default Clock
