import React from "react";

export default function Score(props) {
    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
      };

    return (
        <>
        {/* <h2>Time</h2> */}
        <div id="timer">
        <h2>Time</h2>
            <h1 id="time-display">
                {formatTime(props.minutes)}:{formatTime(props.seconds)}:{formatTime(props.centiseconds)}
            </h1>
      {/* <button onClick={toggleStopwatch}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={resetStopwatch}>Reset</button> */}
        </div>
        </>
    )

}