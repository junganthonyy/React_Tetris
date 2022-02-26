import React from 'react';
import classes from './GameOver.module.css';

export default function GameOver(props) {
  const blockTypes = 'ijlostz';
  const gameOverGrid = new Array(13).fill().map(() => new Array(20));
  const randomBlock = blockTypes[Math.floor(Math.random() * 7)];

  gameOverGrid[1][1] = randomBlock;
  

  return (
    <div className={classes.GameOver}>
      <div className={classes.Title}>GAMEOVER</div>
      <div className={classes.Message}>
        You cleared {props.clearedRows} rows!
      </div>
      <button onClick={() => {props.startGame()}} className={classes.Button}>Play Again?</button>
    </div>
  )
}
