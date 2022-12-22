const { expect } = require('chai');
const { checkForMatches } = require('../class/bejeweled.js');

const chai = require('chai')
spies = require('chai-spies');

chai.use(spies);

const Bejeweled = require("../class/bejeweled.js");

const symbols = ['🍋' , '🥝', '🍓', '🥥', '🍇', '🍊', '🍒'];
//seven different colors for initialization
describe ('Bejeweled', function () {

  describe('Board Creation', function (){
    // Add tests for setting up a basic board
    it('should initialize a grid of random objects given a length and height', function (){
      let grid = Bejeweled.makeGrid(8, 8);
      expect(grid.length).to.equal(8);
      expect(grid[0].length).to.equal(8);
      let count = 0;
      grid.forEach(row => {
        row.forEach(space => {
          if (symbols.includes(space)) {
            count += 1;
          }
        })
      })

      expect(count).to.equal(8 * 8);

    })

    it('should not have any matches on creation', function () {
      let grid = Bejeweled.makeGrid(8, 8);
      let matches = Bejeweled.checkForMatches(grid);
      expect(matches).to.be.false;
    })

  })


  describe('Bejeweled.refill(grid)', function () {

    let grid;
    beforeEach(function() {
      grid = [
        ['🥝','🥥','🥝'],
        ['🍒', '🍋', '🥥'],
        [' ', '🍋', '🍒'],
        [' ', '🍓', ' '],
        [' ', ' ', '🍇'],
        [' ', '🍊', '🍊']
      ]
    })

    it('Bejeweled.refill() should move pieces down to fill blank squares', function (){

      Bejeweled.refill(grid);
      expect(grid[5]).to.be.deep.equal(['🍒','🍊','🍊']);
      expect(grid[4]).to.include('🍓').and.include('🍇');
      expect(grid[3]).to.include('🍋').and.include('🍒');
      expect(grid[2]).to.include('🍋').and.include('🥥');
    })

    it('should fill blanks', function () {
      Bejeweled.refill(grid);

      function findBlank (grid) {
        for(let row = 0; row < grid.length; row++) {
          for (let col = 0; col < grid[0].length; col++){
            if (grid[row][col] === ' '){
              return true;
            }
          }
        }
        return false;
      }

      expect(findBlank(grid)).to.be.false;

    })

    it('should not have any matches after filling', function(){
      Bejeweled.refill(grid);

      expect(Bejeweled.checkForMatches(grid)).to.be.false;
    })
  })

  describe('Bejeweled.checkForMatches(grid)', function () {
    it('should find matches horizontally of 3 or more', function(){
      let grid = [
        ['🍒', '🍋', '🥥'],
        ['🥝', '🍋', '🍒'],
        ['🍒', '🍓', '🥥'],
        ['🍇', '🍇', '🍇'],
        ['🥝', '🍊', '🍊']
      ]
  
      expect(Bejeweled.checkForMatches(grid)).to.be.deep.equal([{row: 3, start: 0, end: 2, symbol: '🍇'}]);
    })
  
    it('should find matches vertically of 3 or more', function (){
      let grid = [
        ['🍒', '🍋', '🥥'],
        ['🥥', '🍋', '🍒'],
        ['🥝', '🍓', '🥥'],
        ['🥝', '🍊', '🍇'],
        ['🥝', '🍇', '🍊']
      ]
  
      expect(Bejeweled.checkForMatches(grid)).to.be.deep.equal([{col: 0, start: 2, end: 4, symbol: '🥝'}]);
    })
  })

  describe('Bejeweled.swap(grid, selection)', function (){
    let grid;
    beforeEach(function() {
      grid = [
        ['🍒', '🍋', '🥥'],
        ['🥝', '🍋', '🍒'],
        ['🍒', '🍓', '🥥'],
        ['🥝', '🍊', '🍇'],
        ['🥝', '🍇', '🍊']
      ]
    })

    it('should swap pieces when provided a grid and selection in the form of [{row: col:}, {row:,col:}]', function (){
      Bejeweled.swap(grid, [{row:1, col: 0}, {row: 2, col: 0}]);
      expect(grid).to.be.deep.equal([
        ['🍒', '🍋', '🥥'],
        ['🍒', '🍋', '🍒'],
        ['🥝', '🍓', '🥥'],
        ['🥝', '🍊', '🍇'],
        ['🥝', '🍇', '🍊']
      ])
    })

    it('should not swap if it does not make a match', function() {
      Bejeweled.swap(grid, [{row:1, col: 0}, {row: 1, col: 1}]);
      expect(grid).to.be.deep.equal([
        ['🍒', '🍋', '🥥'],
        ['🥝', '🍋', '🍒'],
        ['🍒', '🍓', '🥥'],
        ['🥝', '🍊', '🍇'],
        ['🥝', '🍇', '🍊']
      ])
    })

  })

  describe('Bejeweled.swapAndClear(grid, selection)', function(){

    it('should find and clear matches after a swap', function (){
      let grid = [
        ['🍒', '🍋', '🥥'],
        ['🥝', '🍋', '🍒'],
        ['🥝', '🍓', '🥥'],
        ['🍇', '🍊', '🍇'],
        ['🥝', '🍇', '🍊']
      ]
  
      Bejeweled.swapAndClear(grid, [{row: 4, col: 0}, {row: 3, col: 0}])
      expect(grid[4][0]).to.equal('🍇');
      expect(grid[3][0]).to.equal('🍒');
    })
  
    // Add tests for swapAndClears that set up combos
    it('should match combos', function (){
      let grid = [
        ['🥥', '🍓', '🍇'],
        ['🍒', '🍋', '🥥'],
        ['🥝', '🍋', '🍒'],
        ['🥝', '🍓', '🥥'],
        ['🍇', '🍊', '🍇'],
        ['🥝', '🍇', '🍊']
      ]

      Bejeweled.swapAndClear(grid, [{row:4, col: 1}, {row: 5, col: 1}]);
      expect(grid[5][0]).to.equal('🍒');
      expect(grid[4][1]).to.equal('🍓');
  
    })

    it('should call the Bejeweled.refill() method to fill in the board', function () {

      let grid = [
        ['🍒', '🍋', '🥥'],
        ['🥝', '🍋', '🍒'],
        ['🥝', '🍓', '🥥'],
        ['🍇', '🍊', '🍇'],
        ['🥝', '🍇', '🍊']
      ]

      const spy = chai.spy(Bejeweled.refill);
      Bejeweled.swapAndClear(grid, [{row:3, col: 1}, {row: 4, col: 1}]);
      expect(spy).to.be.called;
    })

  })

 

  // Add tests to check if there are no possible valid moves
  it('should detect if there are no validMoves', function(){
    let grid = [
      ['🍒', '🍋', '🥥'],
      ['🥝', '🍋', '🍒'],
      ['🍇', '🍓', '🥥'],
    ]


    let validMove = Bejeweled.checkForMoves(grid);
    expect(validMove).to.be.false;

    grid = [
      ['🥝', '🍓', '🥥'],
      ['🍇', '🍊', '🍇'],
      ['🥝', '🍇', '🍊']
    ]

    validMove = Bejeweled.checkForMoves(grid);
    expect(validMove).to.be.true;
  })

});

