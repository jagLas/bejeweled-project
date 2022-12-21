//Example 1
// 🥝 🍓 🥥 
// 🍇 🍊 🍇 
// 🥝 🍇 🍊

// when middle orange and grape switch becomes

// 🥝 🍓 🥥 
// 🍇 🍇 🍇 
// 🥝 🍊 🍊

//then

// 🥝 🍓 🥥  
// 🥝 🍊 🍊


//a new row drops onto the top and forms a new match
// 🥝 🍋 🍊 
// 🥝 🍓 🥥
// 🥝 🍊 🍊

//    🍋 🍊
//    🍓 🥥
//    🍊 🍊

//new items fall in place again

// 🍓 🍋 🍊
// 🍇 🍓 🥥
// 🍋 🍊 🍊

//options for each piece
// console.log('🍋 🥝 🍓 🥥 🍇 🍊 🍒')

// function exclusiveOR(a, b) {
//     if (typeof a !== 'boolean' || typeof b !== 'boolean') {
//         throw new TypeError('inputs must be booleans')
//     }
//     if (a && b) {
//         return false;
//     } else if (a && !b) {
//         return true;
//     } else if (!a && b) {
//         return true;
//     } else {
//         return false;
//     }
// }

// console.log(exclusiveOR(true, false)) //true
// console.log(exclusiveOR(false, false)) //false
// console.log(exclusiveOR(false, true)) //true
// console.log(exclusiveOR(true, true)) //false
// console.log(exclusiveOR(false, 'dog'))

let test = 0;
let testRes = test !== 0;
// console.log(testRes);

function _checkRowForThree(row) {

    for (let col = 0; col < row.length; col++) {
        const symbol = row[col];
        let threeSlice = row.slice(col, col + 3);
        console.log(threeSlice)
        if(threeSlice.length === 1){
            return false;
        }
        if (threeSlice.every( value => value === symbol)) {
        return col;
        }
    }
}

debugger
console.log(_checkRowForThree([2,4,1,3,3,1,1,1]))