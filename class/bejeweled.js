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
    const matches = [];
    const horizontalMatches = this.checkForHorizontalMatches(grid);
    const verticalMatches = this.checkForVerticalMatches(grid);
    matches.push(...horizontalMatches, ...verticalMatches);

    if (matches.length > 0){
      return matches;
    } else {
      return false;
    }
    

  }

  static checkForHorizontalMatches(grid) {
    //finds horizontal matches and puts in an array
    const horizontalMatches = [];
    grid.forEach((row, rowNum) => {

      const horizontalMatch = this.breakRows(row);

      horizontalMatch.forEach(match => match.row = rowNum)

      if(horizontalMatch.length > 0){
        horizontalMatches.push(...horizontalMatch);
      }
    })

    return horizontalMatches;
  }

  static checkForVerticalMatches(grid) {
    grid = this.rotateGrid(grid);
    //finds Vertical matches and puts in an array
    const VerticalMatches = [];
    grid.forEach((col, colNum) => {

      const VerticalMatch = this.breakRows(col);

      VerticalMatch.forEach(match => match.col = colNum)

      if(VerticalMatch.length > 0){
        VerticalMatches.push(...VerticalMatch);
      }
    })

    return VerticalMatches;
  }

  static swap(grid, selection) {
    let selection1 = selection[0];
    let selection2 = selection[1];

    selection1.symbol = grid[selection1.row][selection1.col];
    selection2.symbol = grid[selection2.row][selection2.col]

    grid[selection1.row][selection1.col] = selection2.symbol;
    grid[selection2.row][selection2.col] = selection1.symbol;

    if(this.checkForMatches(grid)) {
      return;
    } else {
      grid[selection1.row][selection1.col] = selection1.symbol;
      grid[selection2.row][selection2.col] = selection2.symbol;
    }

  }

  //could refactor below for a check four to see if a swap is legal
  // static _checkRowForThree(row) {
  //   //returns the starting column for a match of three in a row
  //   for (let col = 0; col < row.length; col++) {

  //     const symbol = row[col];
  //     let threeSlice = row.slice(col, col + 3);
      
  //     //stops it from false positive when it gets to second to last row
  //     if(threeSlice.length === 2){
  //         return false;
  //     }
  //     //returns the col number when three in a row found
  //     if (threeSlice.every( value => value === symbol)) {
  //     return col;
  //     }
  //   }
  // }

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

    const matches = subRows.filter(subRow => subRow.length >= 3)
    const info = matches.map(subRow => {
      const start = row.indexOf(...subRow)
      return {start: start, end: start + subRow.length - 1, symbol: subRow[0]};
    })

    return info;
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
  ['🍋', '🍒', '🍋'],
  ['🥝', '🍋', '🍒'],
  ['🍒', '🍓', '🥥'],
  ['🍇', '🍇', '🍇'],
  ['🥝', '🍊', '🍊']
]

let grid2 = [
  ['🍒', '🍋', '🥥'],
  ['🥥', '🍋', '🍒'],
  ['🥝', '🍓', '🥥'],
  ['🥝', '🍊', '🍇'],
  ['🥝', '🍇', '🍊']
]

let grid3 = [
  ['🍒', '🍋', '🥥'],
  ['🥝', '🍋', '🍒'],
  ['🍒', '🍓', '🥥'],
  ['🥝', '🍊', '🍇'],
  ['🥝', '🍇', '🍊']
]

debugger
// Bejeweled.swap(grid3, [{row:1, col: 0}, {row: 1, col: 1}]);
// console.log(grid3)
// console.log(Bejeweled.checkForMatches(grid));
// console.log(Bejeweled.checkForMatches(grid2));
// console.log(['🍇', '🍇', '🍇','🍊', '🍊', '🍊','🍊', '🍒'].indexOf('🍊', '🍊', '🍊', '🍊'))
// console.log(Bejeweled.breakRows(['🍇', '🍇', '🍇','🍊', '🍊', '🍊','🍊', '🍒']))
// console.log(Bejeweled.breakRows(['🍇', '🍇', '🍒','🍊', '🍒', '🍊','🍊', '🍒']))

// console.log(Bejeweled.checkForHorizontalMatches(grid));
// console.log(grid)
// console.log(Bejeweled.checkForVerticalMatches(grid2));
// console.log(grid2)

module.exports = Bejeweled;
