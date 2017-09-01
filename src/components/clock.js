import React, { Component } from 'react';

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
      fontSize: 16,
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
    display: "inline-block",
    margin: "0px 10px"
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
      interval: 0,
      clockRunning: false
    }
  }

/*
Helper functions
*/

  // takes date & time to add to given date (minutes and seconds) as arguments
  getStoppingTime = (date, minutes, seconds) => {
    return new Date(date.getTime() + (minutes*60*1000) + (seconds * 1000));
}

// returns an obj w/ minute & second keys with 'number' values
currentTimeObj = (stateTime) => {
      const matchArr = stateTime.match(/^(\d+):(\d+)$/),
            lengthInMinutes = parseInt(matchArr[1], 10),
            lengthInSeconds = parseInt(matchArr[2], 10);

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

// takes a number for minutes & seconds & returns formatted time string
formatTime = (minute, second) => {
  let minutes = minute < 10 ? "0" + minute : minute,
      seconds = second < 10 ? "0" + second : second
  return minutes + ":" + seconds;
}

  //updates state w/ remaining time
  setRemainingTime = (stoppingTime) => {
    // stops clock if time is up
    if (this.isTimeLeft(this.state.remainingTime) === false) {
      clearInterval(this.state.interval);
      this.setState({
        remainingTime: "Time's up!",
        interval: 0,
        clockRunning: false
      });
    }
    else {
      let now = new Date().getTime(),
          diff = stoppingTime - now,
            // calculate remaining min/sec from milliseconds
          minute = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60)),
          second = Math.floor((diff % (1000 *60)) / 1000),
          remaining = this.formatTime(minute, second);

      this.setState({
        remainingTime: remaining
      });
    }
}


// starts clock
tick = (stopTime, setRemainingTimeCallback) => {
  let interval = setInterval(function(){
    setRemainingTimeCallback(stopTime);}, 990);
    this.setState({ interval: interval })
}


/*
Bottom buttons
*/

startClock = () => {
  // cancel function call if clock already running
  if (this.state.clockRunning)
    return;

  if (this.isTimeLeft(this.state.remainingTime)) {
    const timeObj = this.currentTimeObj(this.state.remainingTime),
          stopAt = this.getStoppingTime(new Date(), timeObj.minute, timeObj.second);

    this.tick(stopAt, this.setRemainingTime);
    this.setState({ clockRunning: true });
  }
  else
    alert("Whoops! No time was set.")

}


pauseClock = () => {
  clearInterval(this.state.interval);
  this.setState({
    clockRunning: false,
    interval: 0
  });

}

resetClock = () => {
  clearInterval(this.state.interval);
  this.setState({
    remainingTime: "25:00",
    clockRunning: false,
    interval: 0
  });
}

/*
add or subtract minute methods
*/

addMinute = () => {
  if (this.state.clockRunning === false) {
    const timeObj = this.currentTimeObj(this.state.remainingTime),
          newTimeStr = this.formatTime(timeObj.minute + 1, timeObj.second);
    this.setState({ remainingTime: newTimeStr });
  }
}

subtractMinute = () => {
  if (this.state.clockRunning === false) {
    const timeObj = this.currentTimeObj(this.state.remainingTime);
    if (timeObj.minute > 0) {
      const newTimeStr = this.formatTime(timeObj.minute - 1, timeObj.second);
      this.setState({ remainingTime: newTimeStr });
    }
  }
}


/*
Top button bar buttons, only insert new time
*/
 // clearInterval before setting state
resetIfRunning = () => {
  if (this.state.clockRunning) {
    clearInterval(this.state.interval);
    this.setState({ clockRunning: false, interval: 0 })
  }
}
  pomodoroClock = () => {
    this.resetIfRunning();
    this.setState({ remainingTime: "25:00" });
  }
  shortBreakClock = () => {
    this.resetIfRunning();
    this.setState({ remainingTime: "05:00" });
  }
  longBreakClock = () => {
    this.resetIfRunning();
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
