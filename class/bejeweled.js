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

  static validSymbols = ['🍋' , '🥝', '🍓', '🥥', '🍇', '🍊', '🍒'];

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

  static swapAndClear(grid, selection){
    this.swap(grid, selection);

    let matches = this.checkForMatches(grid);

    matches.forEach(match => {
      this.clear(grid, match);
    })

    this.refill(grid);
  }

  static clear(grid, section) {
    let keys = Object.keys(section);

    //clears vertical matches
    if (keys.includes('col')) {
      for (let row = section.start; row <= section.end; row++){
        grid[row][section.col] = ' ';
      }
    }

    //clears horizontal matches
    if (keys.includes('row')){
      for (let col = section.start; col <= section.end; col++){
        grid[section.row][col] = ' ';
      }
    }
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

  static refill(grid){

    let rotatedGrid = this.rotateGrid(grid);
    rotatedGrid.forEach(col =>{
      this.refillRow(col);
    })

    rotatedGrid = this.rotateGrid(rotatedGrid);

    //mutates the original grid to match the filled one
    for (let i = 0; i < rotatedGrid.length; i++){
      grid.shift();
      grid.push(rotatedGrid[i])
    }

    //check if there is another match
    let matches = this.checkForMatches(grid)

    if(matches){
      matches.forEach(match => {
        this.clear(grid, match);
        this.refill(grid);
      })
    }
  }

  static refillRow(col) {
    const originalLength = col.length

    while(col.includes(' ')) {
      col.forEach((symbol, index) => {
        if(symbol === ' ') {
          col.splice(index, 1);
        }
      })
    }

    while(col.length < originalLength) {
      let randomSymbol = this.validSymbols[Math.floor(Math.random() * this.validSymbols.length)];
      col.unshift(randomSymbol)
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

let grid4 = [
  ['🍋', '🍒', '🍋'],
  ['🥝', '🍋', '🍒'],
  ['🍒', '🍓', '🥥'],
  ['🍇','🍊' , '🍇'],
  ['🥝', '🍇', '🍊']
]

let grid5 = [
  [ '🍒', '🍋', '🥥' ],
  [ '🍒', '🍋', '🍒' ],
  [ ' ', '🍓', '🥥' ],
  [ ' ', '🍊', '🍇' ],
  [ ' ', '🍇', '🍊' ]
]

let grid6 = [
  [ '🍋', '🍒', '🍋' ],
  [ '🥝', '🍋', '🍒' ],
  [ '🍒', '🍓', '🥥' ],
  [ ' ', ' ', ' ' ],
  [ '🥝', '🍊', '🍊' ]
]

let grid7 = [
  ['🍒', '🍋', '🥥'],
  ['🥝', '🍋', '🍒'],
  ['🥝', '🍓', '🥥'],
  ['🍇', '🍊', '🍇'],
  ['🥝', '🍇', '🍊']
]

// console.log(grid7)

// Bejeweled.swapAndClear(grid7, [{row: 3, col: 1}, {row: 4, col: 1}])
// console.log(grid7)
// console.log(Bejeweled.refill(grid5));
// Bejeweled.refill(grid6);
// console.log(grid5)
// console.log(grid6)
// Bejeweled.swapAndClear(grid3, [{row:1, col: 0}, {row: 2, col: 0}]);
// console.log(grid3)


// Bejeweled.swapAndClear(grid4, [{row: 4, col: 1}, {row: 3, col: 1}])
// console.log(grid4)



// Bejeweled.clear(grid2, { start: 2, end: 4, symbol: '🥝', col: 0 });
// console.log(grid2);


// Bejeweled.clear(grid, { start: 0, end: 2, symbol: '🥝', row: 3 });
// console.log(grid);

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
