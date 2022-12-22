const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  constructor() {
    
    this.playerTurn = "O";

    // Initialize this
    this.grid = this.makeGrid();

    this.cursor = new Cursor(8, 8);

    Screen.initialize(8, 8);
    Screen.setGridlines(false);

    this.cursor.setBackgroundColor();
    Screen.render();

  }

  static validSymbols = ['🍋' , '🥝', '🍓', '🥥', '🍇', '🍊', '🍒'];
  static getRandomSymbol(){
    return this.validSymbols[Math.floor(Math.random() * this.validSymbols.length)];
  }

  static makeGrid(){
    const gameGrid = [];
    for (let row = 0; row < 8; row++) {
      const newRow = [];
      for (let col = 0; col < 8; col++) {
        newRow.push(this.getRandomSymbol());
      }
      gameGrid.push(newRow);
    }

    Bejeweled.refill(gameGrid);

    return gameGrid;
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
    const verticalMatches = [];
    grid.forEach((col, colNum) => {
      debugger
      const verticalMatch = this.breakRows(col);
      // console.log(verticalMatch)
     
      verticalMatch.forEach(match => match.col = colNum)

      if(verticalMatch.length > 0){
        verticalMatches.push(...verticalMatch);
      }
    })

    return verticalMatches;
  }

  static swapAndClear(grid, selection){
    this.swap(grid, selection);

    let matches = this.checkForMatches(grid);

    matches.forEach(match => {
      // console.log(match)
      this.clear(grid, match);
    })

    this.refill(grid);
  }

  static clear(grid, section) {
    // console.log(grid)
    // console.log('clearing')
    // console.log(section)
    let keys = Object.keys(section);

    //clears vertical matches
    if (keys.includes('col')) {
      for (let row = section.start; row <= section.end; row++){
        // console.log(grid)
        // console.log(row)
        // console.log(section.col)
        // console.log(grid[row][section.col])
        grid[row][section.col] = ' ';
      }
    }

    //clears horizontal matches
    if (keys.includes('row')){
      for (let col = section.start; col <= section.end; col++){
        grid[section.row][col] = ' ';
      }
    }
    // console.log(grid);
  }

  static swap(grid, selection) {
    let selection1 = selection[0];
    let selection2 = selection[1];

    selection1.symbol = grid[selection1.row][selection1.col];
    selection2.symbol = grid[selection2.row][selection2.col]

    grid[selection1.row][selection1.col] = selection2.symbol;
    grid[selection2.row][selection2.col] = selection1.symbol;

    if(this.checkForMatches(grid)) {
      return true;
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

    // console.log('refilled')
    // console.log(grid)

    //check if there is another match
    let matches = this.checkForMatches(grid);

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

  static checkForMoves(grid){

    //checks all rows
    for (let row = 0; row < grid.length; row++) {
      //in each column except the last
      for (let col = 0; col < grid[0].length - 1; col++) {
        //binds the function to swap for the current space and the one to its right
        let test = this.swap.bind(this, grid, [{row: row, col: col}, {row: row, col: col + 1}]);
        if(test()){ //swaps and returns true if valid
          test(); //swaps them back
          return true; //returns true
        }
      }
    }

    //checks all columns
    for (let col = 0; col < grid[0].length; col++) {
      //in each row except the last
      for (let row = 0; row < grid.length - 1; row++) {
        //binds the function to swap the current space with the one below it
        let test = this.swap.bind(this, grid, [{row: row, col: col}, {row: row + 1, col: col}]);
        if(test()) { //swaps and returns true if valid
          test(); //swaps them back
          return true; //returns true
        }
      }
    }

    return false;
  }

  static breakRows (row) {

    function equalArray(a, b) {
      return a.every((el,index) => {
        return el === b[index];
      });
    }

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

    // console.log(subRows)
    const matches = subRows.filter(subRow => subRow.length >= 3)
    // console.log(matches)

    const info = matches.map(match => {
      let start;
      let matchLength = match.length
      for (let i = 0; i < row.length - 2; i++){
        let testArray = [];
        for  (let j = i; j < matchLength + i; j++) {
          testArray.push(row[j]);
        }
        // console.log(testArray)
        if (equalArray(testArray, match)){
          start = i;
          return {start: start, end: start + matchLength - 1, symbol: match[0]};
        }
      }
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
  ['🍊', '🥝', '🍊',  '🍊'],
  ['🍋', '🍒', '🍋', '🥝'],
  ['🥝', '🍋', '🍒', '🍒'],
  ['🍒', '🍓', '🥥', '🍊'],
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
  ['🍋', '🍒', '🥝'],
  ['🍓', '🥥', '🥝'],
  ['🍒', '🍊', '🍇'],
  ['🍇', '🍊', '🥝']
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

let grid8 = [
  [ '🥝', '🍊', '🍇' ],
  [ '🥥', '🍓', '🍇' ],
  [ '🍒', '🍋', '🥥' ],
  [ '🥝', '🍋', '🍒' ],
  [ '🥝', '🍓', '🥥' ],
  [ '🥝', '🍊', '🍊' ]
]
// console.log(grid8)
// Bejeweled.refill(grid8)
// console.log(grid8)

// console.log(grid3)
// console.log(Bejeweled.checkForMoves(grid3));
// console.log(grid3)

module.exports = Bejeweled;
