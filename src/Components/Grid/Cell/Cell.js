import React from 'react';
import classes from './Cell.module.css';

function Cell({ colour, click }) {
  const style = {};
  switch(colour) {
    case 'z':
      style.backgroundColor = 'rgb(243, 42, 42)';
      style.borderTop = 'rgb(199, 33, 33) 5px solid';
      style.borderBottom = 'rgb(199, 33, 33) 5px solid';
      style.borderLeft = 'rgb(199, 33, 33) 5px solid';
      style.borderRight = 'rgb(199, 33, 33) 5px solid';
      break;
    case 's':
      style.backgroundColor = 'rgb(18, 197, 27)';
      style.borderTop = 'rgb(15, 148, 21) 5px solid';
      style.borderBottom = 'rgb(15, 148, 21) 5px solid';
      style.borderLeft = 'rgb(15, 148, 21) 5px solid';
      style.borderRight = 'rgb(15, 148, 21) 5px solid';
      break;
    case 'l':
      style.backgroundColor = 'rgb(34, 24, 177)';
      style.borderTop = 'rgb(28, 20, 143) 5px solid';
      style.borderBottom = 'rgb(28, 20, 143) 5px solid';
      style.borderLeft = 'rgb(28, 20, 143) 5px solid';
      style.borderRight = 'rgb(28, 20, 143) 5px solid';
      break;
    case 't':
      style.backgroundColor = 'rgb(177, 32, 206)';
      style.borderTop = 'rgb(140, 26, 163) 5px solid';
      style.borderBottom = 'rgb(140, 26, 163) 5px solid';
      style.borderLeft = 'rgb(140, 26, 163) 5px solid';
      style.borderRight = 'rgb(140, 26, 163) 5px solid';
      break;
    case 'i':
      style.backgroundColor = 'rgb(54, 206, 211)';
      style.borderTop = 'rgb(41, 157, 161) 5px solid';
      style.borderBottom = 'rgb(41, 157, 161) 5px solid';
      style.borderLeft = 'rgb(41, 157, 161) 5px solid';
      style.borderRight = 'rgb(41, 157, 161) 5px solid';
      break;
    case 'o':
      style.backgroundColor = 'rgb(204, 223, 40)';
      style.borderTop = 'rgb(167, 182, 35) 5px solid';
      style.borderBottom = 'rgb(167, 182, 35) 5px solid';
      style.borderLeft = 'rgb(167, 182, 35) 5px solid';
      style.borderRight = 'rgb(167, 182, 35) 5px solid';
      break;
    case 'j':
      style.backgroundColor = 'orange';
      style.borderTop = 'rgb(235, 134, 41) 5px solid';
      style.borderBottom = 'rgb(235, 134, 41) 5px solid';
      style.borderLeft = 'rgb(235, 134, 41) 5px solid';
      style.borderRight = 'rgb(235, 134, 41) 5px solid';
      break;   
    default:
      break;
  }

  return (
    <div className={classes.CellWrapper}>
    <div className={classes.Cell} style={style}/>
    </div>
  )
}

export default React.memo(Cell);