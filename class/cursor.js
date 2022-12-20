const Screen = require("./screen");

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.gridColor = 'black';
    this.cursorColor = 'yellow';

    this.selection1 = null;
    this.selection2 = null;

  }

  resetBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.gridColor);
  }

  setBackgroundColor() {
    Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
  }

  up() {
    if (this.row > 0) {
      this.resetBackgroundColor();
      this.row -= 1;
      this.setBackgroundColor();
      Screen.render();
    }   
  }

  down() {
    if (this.row < this.numRows - 1 ) {
      this.resetBackgroundColor();
      this.row += 1;    
      this.setBackgroundColor();
      Screen.render();
    }
  }

  left() {
    if (this.col > 0) {
      this.resetBackgroundColor();
      this.col -= 1;
      this.setBackgroundColor();
      Screen.render()
    }
  }

  right() {
    if (this.col < this.numCols - 1) {
      this.resetBackgroundColor();
      this.col += 1;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  select() {
    if (this.selection1 === null) {
      this.selection1 = {};
      this.selection1.row = this.row;
      this.selection1.col = this.col;

    } else if(false) {

    } else {
      this.selection2 = {};
      this.selection2.row = this.row;
      this.selection2.col = this.col;
    }


  }
}

// cursor = new Cursor(3, 3);
// debugger
// cursor.select();
// console.log(cursor.selection1)

// cursor.right();
// console.log(cursor)
// cursor.select();

// console.log(cursor.selection2)



module.exports = Cursor;
