import React, { Component } from 'react';
import Grid from '../Grid/Grid';
import GameOver from '../GameOver/GameOver';
import classes from './Game.module.css';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const STARTING_X = GRID_WIDTH / 2 - 1;
const STARTING_Y = GRID_HEIGHT - 1;

const tetrominos = {
  i: [
    ['','','',''],
    ['i','i','i','i'],
    ['','','',''],
    ['','','',''],
  ],
  j: [
    ['j', '', ''],
    ['j', 'j', 'j'],
    ['', '', ''],
  ],
  l: [
    ['', '', 'l'],
    ['l', 'l', 'l'],
    ['', '', '', ],
  ],
  o: [
    ['o','o'],
    ['o','o']    
  ],
  s: [
    ['','s','s'],
    ['s','s', ''],
    ['', '', '', ]
  ],
  t: [
    ['', 't', '', ],
    ['t','t', 't'],
    ['','','']
  ],
  z: [
    ['z','z',''],
    ['','z', 'z'],
    ['', '', '', ]
  ],
}

export default class Game extends Component {
  state = {
    cells: new Array(GRID_HEIGHT).fill(0).map(() => new Array(GRID_WIDTH).fill('')),
    currentActiveBlock: null,
    currentX: GRID_WIDTH / 2 - 1,
    currentY: GRID_HEIGHT - 1,
    lost: false,
    intervalId: null,
    clearedRows: 0
  }

  componentDidMount() {
    window.addEventListener('keydown', this.keyPressHandler);

    this.startGameInterval();
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyPressHandler);
  }

  startGameInterval = () => {
    const emptyBoard = new Array(GRID_HEIGHT).fill(0).map(() => new Array(GRID_WIDTH).fill(''));

    this.setState({
      lost: false,
      cells: emptyBoard,
      currentActiveBlock: null,
      currentX: STARTING_X,
      currentY: STARTING_Y,
    }, () => this.gameInterval(800));
  }

  gameInterval = (interval = 800) => {
    if (this.state.lost === true) {
      clearTimeout(this.state.intervalId);
      this.setState({
        intervalId: null
      });
      return;
    }

    let nextIntervalTime = interval;
    if (!this.state.currentActiveBlock) {
      // adjust the speed progresson by changing this values here
      nextIntervalTime = interval < 250 ? 250 : interval - 20;
      this.enterNewBlock();
    } else {
      this.moveActiveBlockDown();
    }

    const intervalId = setTimeout(() => this.gameInterval(nextIntervalTime), interval);

    this.setState({
      intervalId
    });
  }

  stopGameInterval = () => {
    this.setState(prev => {
      clearTimeout(prev.intervalId);
      return {
        intervalId: null
      }
    });
  }

  moveActiveBlockDown = () => {
    // to ensure we don't run this without an active block
    if (!this.state.currentActiveBlock) return;
    this.setState((prev) => {
      let activeBlock = prev.currentActiveBlock.map(coords => [...coords]);

      // if the downward move would be invalid
      // then we go ahead and commit it's current position
      // then reset the state to have no active block
      if (!this.checkValidMove(prev.cells, activeBlock, 'down', prev.currentX, prev.currentY)) {
        // so then we commit the active block's position
        const {board, clearedRows} = this.commitActiveBlock(prev.cells, activeBlock, prev.currentX, prev.currentY);
        return {
          currentActiveBlock: null,
          currentX: STARTING_X,
          currentY: STARTING_Y,
          cells: board,
          clearedRows: prev.clearedRows + clearedRows
        }
      }

      // if we get here then the block is good to move
      // just adjust it's current position down 1
      return {
        currentY: prev.currentY - 1
      }
    });
  }

  /**
   * This function take the active block and the player position
   * and commits the block to the board and returns that new board state
   * It then checks for which rows were changed and calls checkRowsAndComplete on those rows
   * @param Array[Array] board        The current board state
   * @param Array[Array] activeBlock  The matrix of the active block
   * @param int xPos                  The X position of the player
   * @param int yPos                  The Y position of the player
   */
  commitActiveBlock = (board, activeBlock, xPos, yPos) => {
    // copy the board because that's just a shallow copy
    // of the references of the board
    let copyBoard = board.map(row => [...row]);

    // a variable to keep track of the rows that the comitted
    // piece will occupy so we can later check for completion
    const rows = {};

    // loop through the active block
    for (let row = 0; row < activeBlock.length; row++) {
      for (let col = 0; col < activeBlock[0].length; col++) {
        // check for only cells that is part of the tetromino
        if (activeBlock[row][col] !== '') {
          // now using the active player x & y position, we translate that into
          // the board position for where this piece should be
          const boardX = xPos + col;
          const boardY = yPos - row;
          copyBoard[boardY][boardX] = activeBlock[row][col];
          rows[boardY] = true;
        }
      }
    }

    // check to see based on the activeBlock's rows occupied
    // if we need to delete any rows (complete them and remove them)
    let output = this.checkRowsAndComplete(copyBoard, Object.keys(rows).sort((a, b) => a - b));

    return output;
  }

  
  /**
   * This function will wipe out the board and reset the player position
   * replaces the current board with a blank nested array
   * deletes the currently active block
   * reset the player position to top row and middle position
   */
  clearBoard = () => {
    const emptyBoard = new Array(GRID_HEIGHT).fill(0).map(() => new Array(GRID_WIDTH).fill(''));
    this.setState({ 
      cells: emptyBoard,
      currentActiveBlock: null,
      currentX: STARTING_X,
      currentY: STARTING_Y,
    });
  }

  // started conversion to using matrix positioning
  enterNewBlock = () => {
    // randomly generate a new block
    // pick 1 of 7 different types
    // block types I J L O S T Z
    const blockTypes = 'ijlostz';
    const randomBlock = blockTypes[Math.floor(Math.random() * 7)];
    // const block = blocks[randomBlock].map(block => [...block]);
    const block = tetrominos[randomBlock].map(block => [...block]);
    
    // check to see if we can place a block at the top
    this.setState(({ cells, currentX, currentY }) => {
      if (!this.checkValidMove(cells, block, '', currentX, currentY)) {
        return {
          intervalId: null,
          lost: true
        }      
      } else {
        return {
          currentActiveBlock: block,
          currentX: STARTING_X,
          currentY: STARTING_Y
        }
      }
    });
  }



  /**
   * Will attempt to move the block one position to the left.
   * Used in the keypress handler for the player controls
   */
  moveActiveBlockLeft = () => {
    this.setState(({cells, currentActiveBlock, currentX, currentY}) => {
      if (this.checkValidMove(cells, currentActiveBlock, 'left', currentX, currentY)) {
        return {
          currentX: currentX - 1
        }
      }
    })
  }

  /**
   * Will attempt to move the block one position to the right.
   * Used in the keypress handler for the player controls
   */
  moveActiveBlockRight = () => {
    this.setState(({cells, currentActiveBlock, currentX, currentY}) => {
      if (this.checkValidMove(cells, currentActiveBlock, 'right', currentX, currentY)) {
        return {
          currentX: currentX + 1
        }
      }
    })
  }

  /**
   * Used as a callback for the event listener for keystrokes
   * @param event e passed in automatically from the event listener
   */
  keyPressHandler = (e) => {
    if (!this.state.currentActiveBlock) return;
    switch (e.key) {
      case 'ArrowDown':
        this.moveActiveBlockDown();
        break;
      case 'ArrowRight':
        this.moveActiveBlockRight();
        break;
      case 'ArrowLeft':
        this.moveActiveBlockLeft();
        break;
      case 'x':
        this.rotateBlock('clockwise');
        break;
      case 'z':
        this.rotateBlock('counterclockwise');
        break;
      case ' ':
        this.hardDrop();
        break;
      default:
        console.log(e.key)
        break;
    }
  }

  /**
   * Function to check the passed in rows to see if they all have a block
   * Deletes any rows that all have a block because they've cleared a line
   * @param Array[Array] board  the current boardstate
   * @param Array[int] rows     rows that are to be checked, we expect this to be in ascending order from lowest index to heighest index
   */
  checkRowsAndComplete = (board, rows) => {
    const copyBoard = board.map(row => [...row]);
    // Array: keeps track of the rows that we'll need to delete
    // keep this here
    const rowsToDelete = [];

    // loop through the rows that need to be checked
    // row: the current row to check
    // rows: array of rows that need to be checked
    for (let i = 0; i < rows.length; i++) {
      // loop through each cell to check to see if the row will be kept
      // keepRow: accumulator value keeps track of if we should nuke the row or not
      //  if this ends up being true, then we keep the row, dont' delete it
      // cell: value of the cell that we're looking at
      const keepRow = copyBoard[rows[i]].reduce((keepRow, cell) => {
        // if keep is true, then we will keep the row
        // if it's false, then let's check the value of this cell
          // if the value of this cell is blank, then this is an incomplete row
          // we'll keep the current row
        return keepRow || cell === '' 
      }, false);

      if (!keepRow) {
        rowsToDelete.push(rows[i])
      }
    }

    // rowsToDelete will have the index of each row that we'll delete
    // these rows will be in ascending order
    // we loop backwards so that we can target the indicies without
    // having to account for shift in the grid provided
    // i: counting variable for the index of rowsToDelete that we're targeting
    for(let i = rowsToDelete.length - 1; i >= 0; i--) {
      copyBoard.splice(rowsToDelete[i], 1);
      copyBoard.push(new Array(GRID_WIDTH).fill(''));
    }

    return {board: copyBoard, clearedRows: rowsToDelete.length};
  }

  rotateBlock = (direction) => {
    // so do to a rotation we'll do a matrix rotation
    // then we have to check the new position
    // if the new position overlaps a piece or is out of bounds we'll have to
    // shift the piece up or to the left
    // because we're always keeping the top left corner in the same position,
    // the block will only gain width to the right or length to the bottom

    this.setState(({ cells, currentActiveBlock, currentX, currentY }) => {
      let activeBlock = currentActiveBlock.map(row => [...row]);
      
      // create a new matrix with the width and height reversed
      let rotatedBlock = new Array(activeBlock[0].length).fill().map(() => new Array(activeBlock.length));

      // now loop through the matrix and do the rotation
      // the first row becomes the last column,
      // the second row becomes the second to last column, and so on.
      if(direction === 'clockwise') {
        for (let row = 0; row < activeBlock.length; row++) {
          for (let col = 0; col < activeBlock[0].length; col++) {
            rotatedBlock[col][activeBlock.length - 1 - row] = activeBlock[row][col];
          }
        }
      } else if (direction === 'counterclockwise') {
        for (let row = 0; row < activeBlock.length; row++) {
          for (let col = 0; col < activeBlock[0].length; col++) {
            rotatedBlock[activeBlock[0].length - 1 - col][row] = activeBlock[row][col];
          }
        }
      }

      // if this rotation is valid, then we can go ahead and store the result
      if (this.checkBlockPositionValid(cells, rotatedBlock, currentX, currentY)) {
        return {
          currentActiveBlock: rotatedBlock
        }
      }
      // otherwise, don't do anything don't rotate at all
    });

  }

  /**
   * xPos and yPos are basically going to be where 0,0 of the block is going to be on the entire board grid.
   * This funciton has been adjusted for the new matrix system.
   * @param Array[Array] boardState   matrix of the current boardstate
   * @param Array[Array] activeBlock  matrix of the current active block
   * @param String direction          the direction of movement
   * @param int xPos                  the x position of the player
   * @param int yPos                  the y position of the player

   */
  checkValidMove = (board, activeBlock, direction, xPos, yPos) => {
    let xChange, yChange;

    switch(direction) {
      case 'left':
        xChange = -1;
        yChange = 0;
        break;
      case 'right':
        xChange = 1;
        yChange = 0;
        break;
      case 'down':
        xChange = 0;
        yChange = -1;
        break;
      default:
        xChange = 0;
        yChange = 0;
        break;
    }

    return this.checkBlockPositionValid(board, activeBlock, xPos + xChange, yPos + yChange);
  }

  checkBlockPositionValid = (board, activeBlock, xPos, yPos) => {
    for (let row = 0; row < activeBlock.length; row++) {
      for(let col = 0; col < activeBlock[0].length; col++) {
        // if the cell is an actual component of the tetromino
        if (activeBlock[row][col] !== '') {          
          // note: the board starts from row19, col0 in the top left, so we'll have to account for readjusting the position
          // of our block template.
          // the block template starts row0, col0 in the top left
          // so the coordinates on the active block maps to the board like this:
          // if we have the currentX and currentY then the board position would be
          // ROW: yPos - blockRowPos
          // COL: xPos + blockXPos

          // add the positional change, and check for invalid move, because if invalid, we can return false immediately
          // check to see if out of bounds to the left (totalXPos < 0)
          // check to see if out of bounds to the bottom (totalYPos < 0)
          // check to see if we collide or out of bounds to the right (value !== '' vs undefined if out of bounds)

          // how this math works: 
          // xPos is the player position (top left or 0,0 of the block grid)
          // col is the column that we're currently checking
          // xChange is the change that we're testing for to see if it's a valid move
          const totalXPosition = xPos + col;
          const totalYPosition = yPos - row;

          if (totalXPosition < 0 || totalYPosition < 0 || board[totalYPosition][totalXPosition] !== '') {
            return false;
          }
        }
      }
    }
    return true;
  }

  hardDrop = () => {
    this.setState(({ cells, currentActiveBlock, currentX, currentY, clearedRows }) => {
      let yPos = currentY;
      while(this.checkValidMove(cells, currentActiveBlock, 'down', currentX, yPos)) {
        yPos--;
      }
      const output = this.commitActiveBlock(cells, currentActiveBlock, currentX, yPos);

      return {
        cells: output.board,
        currentActiveBlock: null,
        currentX: STARTING_X,
        currentY: STARTING_Y,
        clearedRows: clearedRows + output.clearedRows
      }
    });
  }

  render() {
    // combine the active block into the grid for displaying
    const grid = this.state.cells.map(row => [...row]);
    const activeBlock = this.state.currentActiveBlock;
    
    // confirm that we have an active block
    if (activeBlock) {
      const playerX = this.state.currentX;
      const playerY = this.state.currentY;
      // loop through our active block
      for (let row = 0; row < activeBlock.length; row++) {
        for(let col = 0; col < activeBlock[row].length; col++) {
          // for only cells that are part of the block
          if (activeBlock[row][col]) {
            // set the grid to the color of our block
            grid[playerY - row][playerX + col] = activeBlock[row][col];
          }
        }
      }
    }
    
    return (
      <div className={classes.Game}>
        {this.state.lost ? <GameOver clearedRows={this.state.clearedRows} startGame={this.startGameInterval}/> : null}
        <Grid cells={grid} />
      </div>
    )
  }
}
