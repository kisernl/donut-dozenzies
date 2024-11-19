import React, { useState, useRef, useEffect } from "react";

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in milliseconds
  const startTimeRef = useRef(null); // Ref to hold the start timestamp
  const timerRef = useRef(null); // Ref to manage the interval timer

  // Format time for display
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  // Calculate the display values from elapsed time
  const getTimeComponents = (elapsed) => {
    const totalCentiseconds = Math.floor(elapsed / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    return { minutes, seconds, centiseconds };
  };

  // Start or stop the stopwatch
  const toggleStopwatch = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setElapsedTime((prev) => prev + (Date.now() - startTimeRef.current));
    } else {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const currentElapsed = Date.now() - startTimeRef.current;
        setElapsedTime((prev) => prev + currentElapsed);
        startTimeRef.current = Date.now();
      }, 10);
    }
    setIsRunning(!isRunning);
  };

  // Reset the stopwatch
  const resetStopwatch = () => {
    clearInterval(timerRef.current);
    setElapsedTime(0);
    setIsRunning(false);
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Get formatted time components
  const { minutes, seconds, centiseconds } = getTimeComponents(elapsedTime);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 id="time-display">
        {formatTime(minutes)}:{formatTime(seconds)}:{formatTime(centiseconds)}
      </h1>
      <button onClick={toggleStopwatch}>
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={resetStopwatch}>Reset</button>
    </div>
  );
};

export default Stopwatch;
