const { expect } = require('chai');

const Bejeweled = require("../class/bejeweled.js");


//seven different colors for initialization
describe ('Bejeweled', function () {
  const symbols = ['🍋' , '🥝', '🍓', '🥥', '🍇', '🍊', '🍒'];

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


  describe('Bejeweled.shift(grid)', function () {

    let grid;
    beforeEach(function() {
      grid = [
        ['🍒', '🍋', '🥥'],
        [' ', '🍋', '🍒'],
        [' ', '🍓', ' '],
        [' ', ' ', '🍇'],
        [' ', '🍊', '🍊']
      ]
    })

    it('Bejeweled.shift() should move pieces down to fill blank squares', function (){

      Bejeweled.shift(grid);
      expect(grid[4]).to.be.deep.equal(['🍒','🍊','🍊']);
      expect(grid[3]).to.include('🍓').and.include('🍇');
      expect(grid[2]).to.include('🍋').and.include('🍒');
      expect(grid[1]).to.include('🍋').and.include('🥥');
    })

    it('should fill blanks', function () {
      Bejeweled.shift(grid);

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
  })



  // Add tests for a valid swap that matches 3
  it('should find matches horizontally of 3 or more', function(){
    let grid = [
      ['🍒', '🍋', '🥥'],
      ['🥝', '🍋', '🍒'],
      ['🍒', '🍓', '🥥'],
      ['🍇', '🍇', '🍇'],
      ['🥝', '🍊', '🍊']
    ]

    expect(Bejeweled.checkForMatches(grid)).to.be.true;
  })

  it('should find matches vertically of 3 or more', function (){
    let grid = [
      ['🍒', '🍋', '🥥'],
      ['🥥', '🍋', '🍒'],
      ['🥝', '🍓', '🥥'],
      ['🥝', '🍊', '🍇'],
      ['🥝', '🍇', '🍊']
    ]

    expect(Bejeweled.checkForMatches(grid)).to.be.true;
  })
  it('should find and clear matches after a swap', function (){
    let grid = [
      ['🍒', '🍋', '🥥'],
      ['🥝', '🍋', '🍒'],
      ['🥝', '🍓', '🥥'],
      ['🍇', '🍊', '🍇'],
      ['🥝', '🍇', '🍊']
    ]

    Bejeweled.swap({row: 4, col: 0}, {row: 3, col: 0})
    expect(grid[4][0]).to.equal('🍇');
    expect(grid[3][0]).to.equal('🍒');
  })

  // Add tests for swaps that set up combos
  it('should match combos', function (){
    let grid = [
      ['🍒', '🍋', '🥥'],
      ['🥝', '🍋', '🍒'],
      ['🥝', '🍓', '🥥'],
      ['🍇', '🍊', '🍇'],
      ['🥝', '🍇', '🍊']
    ]

    Bejeweled.swap({row:3, col: 1}, {row: 4, col: 1});

    expect(grid[4][0]).to.equal('🍒');
    expect(grid[3][1]).to.equal('🍓');

  })

  // Add tests to check if there are no possible valid moves
  it('should detect if there are no validMoves', function(){
    let grid = [
      ['🍒', '🍋', '🥥'],
      ['🥝', '🍋', '🍒'],
      ['🍇', '🍓', '🥥'],
      ['🥥', '🍊', '🍇'],
      ['🥝', '🍇', '🍊']
    ]

    let validMove = Bejeweled.checkForMoves(grid);
    expect(validMove).to.be.false;

    grid = [
      ['🍒', '🍋', '🥥'],
      ['🥝', '🍋', '🍒'],
      ['🥝', '🍓', '🥥'],
      ['🍇', '🍊', '🍇'],
      ['🥝', '🍇', '🍊']
    ]

    validMove = Bejeweled.checkForMoves(grid);
    expect(validMove).to.be.true;
  })

});

