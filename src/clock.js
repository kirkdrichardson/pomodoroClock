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
    return (
      <div>
        <Button name={"Start"} click={props.start} />
        <Button name={"Pause"} click={props.pause}/>
        <Button name={"Reset"} click={props.reset}/>
      </div>
    );
}


const ChangeTimeToggle = (props) => {
  const style = {
    fontSize: 36,
    fontWeight: "bold",
    display: "inline-block"
  };
  return (
    <button style={style} onClick={() => props.click()}>
      {props.symbol}
    </button>
  );
}


const Timer = (props) => {
    const timerStyle = {
      fontSize: 72,
      display: "inline-block"
    }
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
      remainingTime: "25:00",
      clockRunning: false
    }
  }

/*
Helper functions
*/

  // takes date & time to add to given date as arguments
  getStoppingTime = (date, minutes) => {
    return new Date(date.getTime() + minutes*60000);
}

// returns an obj w/ minute & second keys with 'number' values
currentTimeObj = (stateTime) => {
  // handles cases where state is a message str & not a time str
  if (stateTime.length !== 5) {
    this.setState({ remainingTime: "25:00"});
  }

  // capture minutes & seconds from current state string
  const matchArr = stateTime.match(/^(\d+):(\d+)$/)
  const lengthInMinutes = parseInt(matchArr[1]);
  const lengthInSeconds = parseInt(matchArr[2]);

  return {
    minute: lengthInMinutes,
    second: lengthInSeconds
  }
}

// returns Boolean if time is up
isTimeLeft = (stateTime) => {
  const timeObj = this.currentTimeObj(stateTime);
  return (timeObj.minute > 0 || timeObj.second > 0) ?
     true :
     false;
   }

  //updates state w/ remaining time
  setRemainingTime = (stoppingTime, interval) => {
    // stops clock if time is up
    if (this.isTimeLeft(this.state.remainingTime) === false) {
      clearInterval(interval);
      this.setState({
        remainingTime: "Time's up!",
        clockRunning: false
      });
      return;
    }

      let now = new Date().getTime(),
          diff = stoppingTime - now,
            // calculate remaining min/sec from milliseconds
          minutesLeft = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60)),
          secondsLeft = Math.floor((diff % (1000 *60)) / 1000),
            // format time
          minutes = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft,
          seconds = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft,

          remaining = minutes + ":" + seconds;
      this.setState({
        remainingTime: remaining
      });
}

// starts clock
tick = (stopTime, setRemainingTimeCallback) => {
  let interval = setInterval(function(){
    setRemainingTimeCallback(stopTime, interval);}, 990);
}


/*
Bottom buttons
*/

startClock = () => {
  // cancel function call if clock already running
  if (this.state.clockRunning)
    return;

  if (this.isTimeLeft(this.state.remainingTime)) {
    const matchArr = this.state.remainingTime.match(/^(\d+):(\d+)$/)
    const lengthInMinutes = parseInt(matchArr[1]);
    const stopAt = this.getStoppingTime(new Date(), lengthInMinutes);
    this.tick(stopAt, this.setRemainingTime);
    this.setState({ clockRunning: true });
  }
  else
    alert("Whoops! No time was set.")

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

/*
add or subtract minute methods
*/

addMinute = () => {
  const timeObj = this.currentTimeObj(this.state.remainingTime);
  const newTimeStr = String(timeObj.minute + 1) + ':' + String(timeObj.second);
  this.setState({ remainingTime: newTimeStr });
}

subtractMinute = () => {
  alert("connected");
}


/* Top button bar buttons, only insert new time */
  pomodoroClock = () => {
    this.setState({ remainingTime: "25:00" });
  }
  shortBreakClock = () => {
    this.setState({ remainingTime: "5:00" });
  }
  longBreakClock = () => {
    this.setState({ remainingTime: "10:00" });
  }


  render() {
    return (
      <div>

        <Quote text={"Success is not born, but grown"}/>

        <TopButtonBar
          pomodoro={this.pomodoroClock}
          shortBreak={this.shortBreakClock}
          longBreak={this.longBreakClock} />

          <div style={{display: "flex", justifyContent: "center"}}>
            <ChangeTimeToggle symbol={String.fromCharCode(43)} click={this.addMinute}/>
            <Timer  remainingTime={this.state.remainingTime}/>
            <ChangeTimeToggle symbol={String.fromCharCode(8722)} click={this.subtractMinute}/>
          </div>

        <BottomButtonBar
          start={this.startClock}
          pause={this.pauseClock}
          reset={this.resetClock} />

      </div>
    );
  }
}






export default Clock
