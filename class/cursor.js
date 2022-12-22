const Screen = require("./screen");

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.gridColor = 'black';
    this.cursorColor = 'yellow';

    this.resetSelections();

    this.resetLimits();
  }

  resetBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.gridColor);
  }

  setBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
  }

  resetSelections() {
    this.selection1 = null;
    this.selection2 = null;
  }
  resetLimits() {
    this.upLimit = 0;
    this.downLimit = this.numRows - 1;
    this.leftLimit = 0;
    this.rightLimit = this.numCols - 1;
  }

  //needs to change movement based on if selection is null or not
  up() {
    if (this.row > this.upLimit) {
      this.selectionColorCheck();
      this.row -= 1;
      this.setBackgroundColor();
      Screen.render();
    }   
  }

  down() {
    if (this.row < this.downLimit) {
      this.selectionColorCheck();
      this.row += 1;    
      this.setBackgroundColor();
      Screen.render();
    }
  }

  left() {
    if (this.col > this.leftLimit) {
      this.selectionColorCheck();
      this.col -= 1;
      this.setBackgroundColor();
      Screen.render()
    }
  }

  right() {
    if (this.col < this.rightLimit) {
      this.selectionColorCheck()
      this.col += 1;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  selectionColorCheck() {
    if(this.selection1){
      if(!(this.col === this.selection1.col && this.row === this.selection1.row)){
        this.resetBackgroundColor();
      }
    } else{
      this.resetBackgroundColor();
    }
  }

  select() {
    //checks if selection1 has already been made
    if (this.selection1 === null) {
      //stores first selection
      this.selection1 = {};
      this.selection1.row = this.row;
      this.selection1.col = this.col;

      //changes the cursor to blue to show selection
      this.cursorColor = 'blue'
      Screen.setBackgroundColor(this.row, this.col, this.cursorColor)

      //redefines cursor limits to prevent selection of space further than one away in each direction
      if (this.row > this.upLimit) {
        this.upLimit = this.row - 1;
      }

      if (this.row < this.downLimit) {
        this.downLimit = this.row + 1;
      }

      if (this.col < this.rightLimit) {
        this.rightLimit = this.col + 1;
      }

      if (this.col > this.leftLimit) {
        this.leftLimit = this.col - 1;
      }

    } else if(this._diagonalCheck()) { //checks if second selection is a orthogonal
      //sets selection2 if true
      this.selection2 = {};
      this.selection2.row = this.row;
      this.selection2.col = this.col;

      this.resetLimits(); //resets cursor limits to defaults

      //resets cursor color to yellow
      this.cursorColor = 'yellow';
      //resets color of selection square
      Screen.setBackgroundColor(this.selection1.row, this.selection1.col, 'black');
      const selections = [this.selection1, this.selection2]; //forms array to return before clearing
      this.resetSelections(); //clears both selections

      //resets current position to yellow
      this.setBackgroundColor(this.row, this.col, this.cursorColor);
      return selections; //returns an array of spaces to swap
    }
    
  }

  _diagonalCheck() {
    //returns true if selection is orthogonal to selection1
    //return false if selection is on a diagonal or equal to selection1
    let horizontalMove = this.row !== this.selection1.row;
    let verticalMove = this.col !== this.selection1.col;
    return this._exclusiveOR(horizontalMove, verticalMove)
  }

  _exclusiveOR(a, b) {
    //evaluates if a and b are exclusively true
    if (typeof a !== 'boolean' || typeof b !== 'boolean') {
        throw new TypeError('inputs must be booleans')
    }
    if (a && b) {
        return false;
    } else if (a && !b) {
        return true;
    } else if (!a && b) {
        return true;
    } else {
        return false;
    }
}

}

module.exports = Cursor;
