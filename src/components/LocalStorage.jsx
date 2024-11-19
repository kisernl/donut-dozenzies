// Function to save a time score to local storage
function saveTimeScore(finalTime) {
    // Parse existing scores or create a new array if no scores exist
    let scores = JSON.parse(localStorage.getItem("timeScores")) || [];
  
    // Destructure the final time into its components
    const { minutes, seconds, centiseconds } = getTimeComponents(finalTime);
  
    // Create a new score object
    const newScore = {
      minutes,
      seconds,
      centiseconds,
      timestamp: new Date().toISOString() // Optional: add timestamp for reference
    };
  
    // Add the new score to the array
    scores.push(newScore);
  
    // Save the updated array back to local storage
    localStorage.setItem("timeScores", JSON.stringify(scores));
  }
  
  // Function to retrieve scores from local storage
  function getTimeScores() {
    return JSON.parse(localStorage.getItem("timeScores")) || [];
  }
  
  // Example of displaying scores
  function displayScores() {
    const scores = getTimeScores();
  
    // Sort scores (optional, e.g., by fastest time)
    scores.sort((a, b) => {
      return (
        a.minutes * 6000 + a.seconds * 100 + a.centiseconds -
        (b.minutes * 6000 + b.seconds * 100 + b.centiseconds)
      );
    });
  
    // Render scores (example for DOM rendering)
    scores.forEach((score) => {
      console.log(
        `Time: ${formatTime(score.minutes)}:${formatTime(score.seconds)}:${formatTime(score.centiseconds)}`
      );
    });
  }
  
  ////////////////////////////////

  if (finalTime !== null) {
    saveTimeScore(finalTime);
  }

  ////////////////////////////////

  const scores = getTimeScores();
scores.forEach((score) => {
  console.log(`Time: ${formatTime(score.minutes)}:${formatTime(score.seconds)}:${formatTime(score.centiseconds)}`);
});


  
