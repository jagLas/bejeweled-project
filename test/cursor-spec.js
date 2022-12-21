const { expect } = require('chai');

const Cursor = require("../class/cursor.js");
const Screen = require("../class/screen.js");

describe ('Cursor', function () {

  let cursor;

  beforeEach(function() {
    cursor = new Cursor(3, 3);
  });


  it('initializes for a 3x3 grid', function () {
    expect(cursor.row).to.equal(0);
    expect(cursor.col).to.equal(0);
  });

  it('correctly processes down inputs', function () {

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 0]);
  });

  it('correctly processes up inputs', function () {

    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([1, 0]);

    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

  it('processes right inputs', function () {

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 2]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 2]);
  });

  it('processes left inputs', function () {

    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);

    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 1]);

    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([0, 0]);
  });

});

describe('Criteria for cursor to select spaces for swaps', function (){
  let cursor;
  
  beforeEach(function() {
    cursor = new Cursor(8,8);
  })

  it('should have properties for selection1 and selection2 set to empty object', function (){
    
    expect(cursor.selection1).to.be.null;
    expect(cursor.selection1).to.be.null;
    expect(cursor.selection2).to.be.null;
    expect(cursor.selection2).to.be.null;
  })

  it('should be able to select first space and second space and return an array of the two', function (){

    cursor.select();
    expect([cursor.selection1.row, cursor.selection1.col]).to.deep.equal([0, 0]);
    cursor.right();
    let result = cursor.select();
    expect(result).to.deep.equal([{row:0, col: 0}, {row: 0, col: 1}]);

  })

  it('should reset the selections after returning the array', function () {
    cursor.select();
    cursor.right();
    cursor.select();
    expect(cursor.selection1).to.be.null;
    expect(cursor.selection2).to.be.null;
  })

  it('should not move more than 1 away from initial selection', function (){

    cursor.row = 2;
    cursor.col = 2;
    cursor.select();
    cursor.right();
    cursor.right();
    cursor.left();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 2]);

    cursor = new Cursor(8, 8);

    cursor.row = 2;
    cursor.col = 2;
    cursor.select();
    cursor.left();
    cursor.left();
    cursor.right();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 2]);

    cursor = new Cursor(8, 8);

    cursor.row = 2;
    cursor.col = 2;
    cursor.select();
    cursor.up();
    cursor.up();
    cursor.down();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 2]);

    cursor = new Cursor(8, 8);

    cursor.row = 2;
    cursor.col = 2;
    cursor.select();
    cursor.down();
    cursor.down();
    cursor.up();
    expect([cursor.row, cursor.col]).to.deep.equal([2, 2]);

    })

    it('should not restrict cursor movement after two selections', function () {
      cursor.row = 2;
      cursor.col = 2;
      cursor.select();
      cursor.right();
      cursor.select();
      cursor.right();
      cursor.right();
      cursor.down();
      cursor.down();
      expect(cursor.col).to.be.equal(5);
      expect(cursor.row).to.be.equal(4);
    })

    it('should not accept diagonal selections', function() {
      cursor.row = 2;
      cursor.col = 2;
      cursor.select();
      cursor.up();
      cursor.right();
      cursor.select();
      expect(cursor.selection1).to.be.exist;
      expect(cursor.selection2).to.be.null;
    })
})

