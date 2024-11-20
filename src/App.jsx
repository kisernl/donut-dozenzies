import { useEffect, useState, useRef } from 'react';
import Box from './components/Box.jsx';
import { nanoid } from 'nanoid';
import donutData from './assets/donutData.js';
import Modal from './components/Modal';
import Score from './components/Score.jsx';

// pseudocode/steps for Donut Dozen-zies
// ✅ create donut state to hold array of 10 donuts
// ✅ display 12 random donuts in a grid using a box element
// ✅ create onClick event that swaps out the donuts
// ✅ make selected donuts hold between swaps
// ** ✅ create an isHeld prop
// ** ✅ create toggle for is held based on click (in box component)
// ** ✅ create conditional box coloring depending on isHeld
// ** ✅ make isHeld boxes remain when other boxes swap
// ✅ create win game feature
// ** ✅ create state for tracking win conditions
// ** ✅ create useEffect to update and watch win state
// ** ✅ track when all boxes are held & all donut images are the same
// ** ✅ change button copy from "swap" to "new game"
// ** ✅ create modal pop up with message when player wins (clicks last matching donut)
// ✅ create timer for game
// ** ✅ start timer with first donut click
// ** ✅ end timer with winning donut click
// ** ✅ paint score to winner message/modal
// create log of high score in local storage
// create multiplayer option
// ** one to four players
// ** single player game logs high score in local storage
// ** create "player X" badge for each player
// ** each player's score is held in local storage (maybe not) until new game is intiated
// ** final screen ranks players by low score results

function App() {
  // generate a random donut img src
  const randomDonut = (donutData) => {
    const randomIndex = Math.floor(Math.random() * donutData.length);
    return donutData[randomIndex];
  };

  // ** original generateNewDonut function
  // function generateNewDonut() {
  //   return {
  //     id: nanoid(),
  //     srcImg: randomDonut(donutData),
  //     isHeld: false,
  //   };
  // }

  // this function insures that a box does not receve an identical donut when swap is clicked
  function generateNewDonut(currentImage) {
    let newImage;
    do {
      newImage = randomDonut(donutData);
    } while (newImage === currentImage); // Ensure a different image
    return {
      id: nanoid(),
      srcImg: newImage,
      isHeld: false,
    };
  }
  

  // create an array of 12 donuts
  function allNewDonuts() {
    const newDonut = [];
    for (let i = 0; i < 12; i++) {
      // ** moved code below into it's own function -- generateNewDonuts
      // newDonut.push({
      //   id: nanoid(),
      //   srcImg: randomDonut(donutData),
      //   isHeld: false,
      // });
      newDonut.push(generateNewDonut());
    }
    return newDonut;
  }
  //paint the intitial screen render with random donuts, and store array in state
  const [donuts, setDonuts] = useState(allNewDonuts());

  //store win conditions in state
  const [dozenzies, setDozenzies] = useState(false);

  // useEffect to watch for win conditions
  useEffect(() => {
  //  console.log("Current donuts state:", donuts);
    if (
      donuts.every(donut => donut.srcImg === donuts[0].srcImg) && 
      donuts.every(donut => donut.isHeld === true)
    ) {
      // console.log("Condition met, setting dozenzies to true");
      setDozenzies(true)}
  }, [donuts])

  // console.log(`dozenzies:`, dozenzies)


  // function to change out donuts when swap button is clicked
  // ** original swapDonuts function
  // const swapDonuts = () => {
  //   setDonuts((prevDonuts) => {
  //     console.log('Current state of prevDonuts:', prevDonuts);
  //     return prevDonuts.map((donut) =>
  //       donut.isHeld ? donut : generateNewDonut()
  //     );
  //   });
  // };

  const swapDonuts = () => {
    setDonuts((prevDonuts) =>
      prevDonuts.map((donut) =>
        donut.isHeld ? donut : generateNewDonut(donut.srcImg) // Pass current image
      )
    );
  };
  

  // function to freeze/hold a donut between swap cyclces/rolls
  const holdDonut = (id) => {
    setDonuts((prevDonuts) =>
      prevDonuts.map((donut) =>
        donut.id === id ? { ...donut, isHeld: !donut.isHeld } : donut
      )
    );
  };

  const newGame = () => {
    setDozenzies(false);
    setDonuts(allNewDonuts);
    resetStopwatch()
  }

  const donutBoxes = donuts.map((donut) => (
    <Box
      key={donut.id}
      srcImg={donut.srcImg}
      holdDonut={(id) => {
        holdDonut(id); // Keep the hold functionality
        handleBoxClick(); // Start the timer on first click
      }}
      id={donut.id}
      isHeld={donut.isHeld}
    />
  ));

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    dozenzies && openModal()
  }, [dozenzies])


  // timer state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in milliseconds
  const startTimeRef = useRef(null); // Ref to hold the start timestamp
  const timerRef = useRef(null); // Ref to manage the interval timer
  const [hasClicked, setHasClicked] = useState(false); // use to start timer
  const [finalTime, setFinalTime] = useState(null); // final time to display on modal

   // ** Calculate the display values from elapsed time
  const getTimeComponents = (elapsed) => {
    const totalCentiseconds = Math.floor(elapsed / 10);
    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return { minutes, seconds, centiseconds };
  };
  
   // ** Start or stop the stopwatch
  const startTimer = () => {
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          const currentElapsed = Date.now() - startTimeRef.current;
          setElapsedTime((prev) => prev + currentElapsed);
          startTimeRef.current = Date.now();
        }, 10);

      setIsRunning(true);
    };

    const handleBoxClick = () => {
      if (!hasClicked) {
        startTimer(); // Start the timer
        setHasClicked(true); // Ensure this only triggers on the first click
      }
    }

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false)
    setHasClicked(false)
  }

  // stop timer
  useEffect(() => {
    if (dozenzies) {
      stopTimer();
      setFinalTime(elapsedTime);
    }
  }, [dozenzies]);


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

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
  // Get formatted time components
  const { minutes, seconds, centiseconds } = getTimeComponents(elapsedTime);

  // create high score tracker with local storage
  
  const highScore = () => {
    let storedScore = localStorage.getItem("score");
    if (storedScore === null || finalTime < storedScore) {
      console.log('New High Score! ', finalTime)
      localStorage.setItem("score", finalTime);
    } else {
      console.log('Your score: ', finalTime, "High Score: ", storedScore)
      }
    return storedScore
  }

  const clearHighScore = () => {
    localStorage.clear()
  }

  // console.log(highScore)

// let storedScore = localStorage.getItem("score");
// console.log(storedScore)


  return (
    <>
      <main>
        <section className="game--container">
          <div className="game--inner-container">
            <div className="game--title">
              <h1>Donut Dozen-zies</h1>
              <p>Imagine the game Tenzies... but with 12 donuts.</p>
              <p>
                Keep swapping donuts until you have a dozen identical donuts.
                Click on a donut to keep it from being swapped.
              </p>
            </div>
            <Score minutes={minutes} seconds={seconds} centiseconds={centiseconds} />
            <div className="box--container">
              <div className="donut--container">{donutBoxes}</div>
            </div>
            { !dozenzies && 
            <button onClick={() => { swapDonuts(); handleBoxClick(); }}>
              Swap
            </button>
            }
            { dozenzies && 
            <button onClick={() => newGame()}>
              New Game
            </button>
            }
          </div>
        </section>
        <div>
          {isModalOpen && <Modal onClose={() => setIsModalOpen(false)}>
            <img src="./donut_coffee.svg" alt="donut in coffee" className='modal--img' />
            <h2 id='modal--message'>Well Done!</h2>
            {finalTime !== null && (
              <h4>
                Your time:{" "}
                {`${formatTime(getTimeComponents(finalTime).minutes)}: ${formatTime(getTimeComponents(finalTime).seconds)}: ${formatTime(getTimeComponents(finalTime).centiseconds)}`}
              </h4>
            )}
            {highScore !== null && (
                <p>
                  Fastest Time:{" "}
                  {`${formatTime(getTimeComponents(highScore()).minutes)}: ${formatTime(getTimeComponents(highScore()).seconds)}: ${formatTime(getTimeComponents(highScore()).centiseconds)}`}
                </p>
              )
            }
            <button id="new-game--btn" onClick={() => {newGame(); closeModal()}}>New Game</button>
            <button id="reset--btn" onClick={() => {clearHighScore(); newGame(); closeModal() }}>Reset Fastest Time</button>
          </Modal>}
        </div>
      </main>
    </>
  );
}

export default App;


