import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [gameOver, setGameOver] = useState(true);
  const [birdPosition, setBirdPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const gameScreenRef = useRef();

  useEffect(() => {
    if (!gameOver) {
      const gameScreen = gameScreenRef.current.getBoundingClientRect();
      const birdScreenPos = birdPosition - gameScreen.top;
      const gravity = 0.5;

      const birdFall = setInterval(() => {
        const topObstacle = obstacles[0];
        if (
          birdScreenPos > gameScreen.height ||
          (topObstacle &&
            birdScreenPos < topObstacle.bottom &&
            topObstacle.left < 80 &&
            topObstacle.right > 20)
        ) {
          clearInterval(birdFall);
          setGameOver(true);
        } else {
          setBirdPosition((prevPos) => prevPos + gravity);
        }
      }, 20);

      const moveObstacles = setInterval(() => {
        setObstacles((prevObstacles) => {
          const newObstacles = prevObstacles.map((obstacle) => {
            const newObstacle = { ...obstacle };
            newObstacle.left -= 1;
            return newObstacle;
          });

          if (newObstacles[0]?.left === 80) {
            setScore((prevScore) => prevScore + 1);
            newObstacles.shift();
          }

          if (newObstacles[newObstacles.length - 1]?.left === 40) {
            newObstacles.push(generateObstacle());
          }

          return newObstacles;
        });
      }, 20);

      return () => {
        clearInterval(birdFall);
        clearInterval(moveObstacles);
      };
    }
  }, [gameOver, birdPosition, obstacles]);

  const startGame = () => {
    setGameOver(false);
    setBirdPosition(50);
    setObstacles([generateObstacle()]);
    setScore(0);
  };

  const generateObstacle = () => {
    const obstacleHeight = Math.random() * 200 + 100;
    return {
      left: window.innerWidth,
      height: obstacleHeight,
      bottom: obstacleHeight + 150,
      right: 80,
    };
  };

  const handleKeyPress = (event) => {
    if (event.key === " ") {
      setBirdPosition((prevPos) => prevPos - 60);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="app">
      <div
        className={`game-screen ${gameOver ? "game-over" : ""}`}
        ref={gameScreenRef}>
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle"
            style={{
              left: obstacle.left,
              height: obstacle.height,
              bottom: obstacle.bottom,
              right: obstacle.right,
            }}
          />
        ))}
        <div
          className={`bird ${gameOver ? "bird-fall" : ""}`}
          style={{ bottom: birdPosition }}
        />
      </div>
      {gameOver ? (
        <div className="game-over-screen">
          <h1>Game Over</h1>
          <p>Your Score: {score}</p>
          <button onClick={startGame}>Restart</button>
        </div>
      ) : (
        <div className="score">Score: {score}</div>
      )}
    </div>
  );
};

export default App;
