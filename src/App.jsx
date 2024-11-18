import { useEffect, useState } from 'react';
import Box from './components/Box.jsx';
import { nanoid } from 'nanoid';
import donutData from './assets/donutData.js';
import Modal from './components/Modal';

// pseudocode for Donut Dozen-zies
// ✅ create donut state to hold array of 10 donuts
// ✅ display 12 random donuts in a grid using a box element
// ✅ create onClick event that swaps out the donuts
// ✅ make selected donuts hold between swaps
// ** ✅ create an isHeld prop
// ** ✅ create toggle for is held based on click (in box component)
// ** ✅ create conditional box coloring depending on isHeld
// ** ✅ make isHeld boxes remain when other boxes swap
// create win game feature
// ** ✅ create state for tracking win conditions
// ** ✅ create useEffect to update and watch win state
// ** ✅ track when all boxes are held & all donut images are the same
// ** change button copy from "swap" to "new game"
// ** ✅ create modal pop up with message when player wins (clicks last matching donut)
// create timer for game
// ** start timer with first donut click
// ** end timer with winning donut click
// ** paint score to winner message/modal
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

  function generateNewDonut() {
    return {
      id: nanoid(),
      srcImg: randomDonut(donutData),
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

  console.log(`dozenzies:`, dozenzies)


  // function to change out donuts when swap button is clicked
  const swapDonuts = () => {
    setDonuts((prevDonuts) => {
      console.log('Current state of prevDonuts:', prevDonuts);
      return prevDonuts.map((donut) =>
        donut.isHeld ? donut : generateNewDonut()
      );
    });
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
  }

  const donutBoxes = donuts.map((donut) => (
    <Box
      key={donut.id}
      srcImg={donut.srcImg}
      holdDonut={holdDonut}
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
            <div className="box--container">
              <div className="donut--container">{donutBoxes}</div>
            </div>
            { !dozenzies && 
            <button onClick={swapDonuts}>
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
            <h2>Well Done!</h2>
          </Modal>}
        </div>
      </main>
    </>
  );
}

export default App;


