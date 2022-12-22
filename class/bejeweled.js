const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  constructor() {
    
    this.playerTurn = "O";

    // Initialize this
    this.grid = Bejeweled.makeGrid();

    this.cursor = new Cursor(8, 8);
    this.matches = 0;

    Screen.initialize(8, 8);
    Screen.grid = this.grid;
    Screen.setGridlines(false);

    Screen.addCommand('up', 'moves cursor up', Bejeweled.upCommand.bind(this));
    Screen.addCommand('down', 'moves cursor down', Bejeweled.downCommand.bind(this));
    Screen.addCommand('left', 'moves cursor left', Bejeweled.leftCommand.bind(this));
    Screen.addCommand('right', 'moves cursor right', Bejeweled.rightCommand.bind(this));
    Screen.addCommand('space', 'selects piece for swap', Bejeweled.selectCommand.bind(this));

    this.cursor.setBackgroundColor();
    Screen.render();

  }

  static matches = 0;

  static combos = 0;

  //commands
  static upCommand(){
    this.cursor.up();
  }

  static leftCommand() {
    this.cursor.left();
  }

  static rightCommand() {
    this.cursor.right();
  }

  static downCommand() {
    this.cursor.down();
  }

  static selectCommand() {
    let selections = this.cursor.select();
    if(selections) {
      Bejeweled.swapAndClear(Screen.grid, selections);
    }
    let totalScore = Math.round(Bejeweled.matches * (Bejeweled.combos * .25 + 1));
    Screen.setMessage(`Matches: ${Bejeweled.matches} Combos: ${Bejeweled.combos} Total Score: ${totalScore}`)
    Screen.render();
  }

  //available 'gems' for the game
  static validSymbols = ['🍋' , '🥝', '🍓', '🥥', '🍇', '🍊', '🍒'];

  static getRandomSymbol(){
    //generates a random symbol from valid options
    return this.validSymbols[Math.floor(Math.random() * this.validSymbols.length)];
  }

  //makes an 8x8 grid of randomized symbols
  static makeGrid(){
    const gameGrid = [];
    for (let row = 0; row < 8; row++) {
      const newRow = [];
      for (let col = 0; col < 8; col++) {
        newRow.push(this.getRandomSymbol());
      }
      gameGrid.push(newRow);
    }

    //calls refill to clear any matches and refill
    Bejeweled.refill(gameGrid);

    Bejeweled.matches = 0;
    Bejeweled.combos = 0;
    Screen.setMessage(`Matches; ${Bejeweled.matches} Combos: ${Bejeweled.combos}`)
    return gameGrid;
  }

  //checks a grid for any matches on the board
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

  //finds horizontal matches and puts in an array
  static checkForHorizontalMatches(grid) {

    const horizontalMatches = [];
    grid.forEach((row, rowNum) => {

      //checks the row for a match
      const horizontalMatch = this.findMatch(row);

      //sets the row in which the match was found
      horizontalMatch.forEach(match => match.row = rowNum)

      //if match found, is pushed to the return array
      if(horizontalMatch.length > 0){
        horizontalMatches.push(...horizontalMatch);
      }
    })

    return horizontalMatches;
  }

  static checkForVerticalMatches(grid) {
    //rotates grid so columns function as rows
    grid = this.rotateGrid(grid);

    //finds Vertical matches and pushes to return array
    const verticalMatches = [];
    grid.forEach((col, colNum) => {
      //checks the column for matches
      const verticalMatch = this.findMatch(col);

      //sets the column where it was found
      verticalMatch.forEach(match => match.col = colNum)

      //pushes to return array if found
      if(verticalMatch.length > 0){
        verticalMatches.push(...verticalMatch);
      }
    })

    return verticalMatches;
  }

  //swaps, checks for matches and clearing if necessary, then refilling grid.
  static swapAndClear(grid, selection){
    this.swap(grid, selection);

    let matches = this.checkForMatches(grid);

    if (matches){
      if(matches.length > 1) {
        Bejeweled.combos += 1;
      }

      matches.forEach(match => {
        this.clear(grid, match);
      })
    }


    this.refill(grid);
  }

  static clear(grid, section) {
    let keys = Object.keys(section);

    //clears vertical matches
    if (keys.includes('col')) {
      for (let row = section.start; row <= section.end; row++){
        grid[row][section.col] = ' ';
      }
      Bejeweled.matches += 1;
    }

    //clears horizontal matches
    if (keys.includes('row')){
      for (let col = section.start; col <= section.end; col++){
        grid[section.row][col] = ' ';
      }
      Bejeweled.matches += 1;
    }

    
  }

  //swaps position of two gems. selection must be in the form of [{row: a, col:b}, {row: c, col: d}]
  static swap(grid, selection) {
    //breaks array into two selections
    let selection1 = selection[0];
    let selection2 = selection[1];

    //identifies the symbol at each selection
    selection1.symbol = grid[selection1.row][selection1.col];
    selection2.symbol = grid[selection2.row][selection2.col]

    //swaps the symbols at each
    grid[selection1.row][selection1.col] = selection2.symbol;
    grid[selection2.row][selection2.col] = selection1.symbol;

    //verifies it makes a match
    if(this.checkForMatches(grid)) {
      return true; //returns true for other functions and keeps swapped
    } else {
      //resets their position if no matches found
      grid[selection1.row][selection1.col] = selection1.symbol;
      grid[selection2.row][selection2.col] = selection2.symbol;
    }
  }

  static refill(grid){
    //rotates the grid and refills each column (now a row)
    let rotatedGrid = this.rotateGrid(grid);
    rotatedGrid.forEach(col =>{
      this.refillCol(col);
    })

    //rotates it back to correct orientation
    rotatedGrid = this.rotateGrid(rotatedGrid);

    //mutates the original grid to match the filled one
    for (let i = 0; i < rotatedGrid.length; i++){
      grid.shift();
      grid.push(rotatedGrid[i])
    }


    //check if there is another match
    let matches = this.checkForMatches(grid);

    //if a match is found, will clear the match and recurse
    if(matches){
      matches.forEach(match => {
        Bejeweled.combos += 1;
        this.clear(grid, match);
        this.refill(grid);
      })
    }
  }

  //refills each col
  static refillCol(col) {
    const originalLength = col.length

    //deletes each instance of a blank
    while(col.includes(' ')) {
      col.forEach((symbol, index) => {
        if(symbol === ' ') {
          col.splice(index, 1);
        }
      })
    }

    //adds a random symbol to the top
    while(col.length < originalLength) {
      col.unshift(this.getRandomSymbol())
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

  static findMatch (row) {

    //creates helper to check equality of array
    function equalArray(a, b) {
      return a.every((el,index) => {
        return el === b[index];
      });
    }

    //breaks the column into sub rows ofconsecutive symbols
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

    //filters the subrows into ones that are greater than 3
    const matches = subRows.filter(subRow => subRow.length >= 3)

    //creates metadata of start, end and symbol to an object
    const info = matches.map(match => {
      let start;
      let matchLength = match.length
      for (let i = 0; i < row.length - 2; i++){
        let testArray = [];
        for  (let j = i; j < matchLength + i; j++) {
          testArray.push(row[j]);
        }

        if (equalArray(testArray, match)){
          start = i;
          return {start: start, end: start + matchLength - 1, symbol: match[0]};
        }
      }
    })

    //returns object with match information: example {start: 1, end: 3, symbol: '🥝'}
    return info;
  }
  
  //rotates grid so that functions that work on rows can be applied to columns
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

module.exports = Bejeweled;
