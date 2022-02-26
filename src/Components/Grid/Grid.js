import React from 'react';
import classes from './Grid.module.css';
import Cell from './Cell/Cell';

export default function Grid({ cells }) {
  return (
    <div className={classes.Grid}>
      {
        cells.map((row, idx) => {
          return (<div className={classes.Row} key={`ROW_${idx}`}>
            {
              row.map((val, col) => <Cell colour={val} key={`ROW_${idx}_COL_${col}`}/>)
            }
          </div>)
        })
      }
    </div>
  )
}
