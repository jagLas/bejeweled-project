const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  constructor() {

    this.playerTurn = "O";

    // Initialize this
    this.grid = [];

    this.cursor = new Cursor(8, 8);

    Screen.initialize(8, 8);
    Screen.setGridlines(false);

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  static checkForMatches(grid) {
    let rotatedGrid = this.rotateGrid(grid);
    const matches = [];
    grid.forEach((row, rowNum) => {
      let col = this._checkRowForThree(row);
      
      if(col === false) {

      } else {
        matches.push({row: rowNum, col: col, symbol: row[col]})
      }

    })
    return matches;
  }

  static _checkRowForThree(row) {
    //returns the starting column for a match of three in a row
    for (let col = 0; col < row.length; col++) {

      const symbol = row[col];
      let threeSlice = row.slice(col, col + 3);
      
      //stops it from false positive when it gets to second to last row
      if(threeSlice.length === 2){
          return false;
      }
      //returns the col number when three in a row found
      if (threeSlice.every( value => value === symbol)) {
      return col;
      }
    }
  }

  static breakRows (row) {
    let subRows = [];
    let subRow = [];
    for (let col = 0; col < row.length; col++){
      let symbol = row[col];
      if(row[col] !== row[col + 1]) {
        subRow.push(symbol);
        subRows.push(subRow);
        subRow = [];
      } else {
        subRow.push(symbol);
      }
    }
    return subRows.filter(subRow => subRow.length >= 3);
  }
  
  static rotateGrid(grid) {
    const cols = [];
    const numRows = grid.length;
    const numCols = grid[0].length;

    for (let col = 0; col < numCols; col ++) {
      let column = [];

      for (let row = 0; row < numRows; row++) {
        column.push(grid[row][col]);
      }

      cols.push(column);
    }

    return cols;
  }

}


let grid = [
  ['🍒', '🍋', '🥥'],
  ['🥝', '🍋', '🍒'],
  ['🍒', '🍓', '🥥'],
  ['🍇', '🍇', '🍇'],
  ['🥝', '🍊', '🍊']
]
debugger

console.log(Bejeweled.rotateGrid(grid))
// console.log(['🍇', '🍇', '🍇','🍊', '🍊', '🍊','🍊', '🍒'].indexOf('🍊', '🍊', '🍊', '🍊'))
// console.log(Bejeweled.breakRows(['🍇', '🍇', '🍇','🍊', '🍊', '🍊','🍊', '🍒']))


// console.log(Bejeweled.checkForMatches(grid));

module.exports = Bejeweled;
