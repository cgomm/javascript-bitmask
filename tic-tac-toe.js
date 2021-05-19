const helper = require('./helper-functions')

const players = [0,1]
const start = 0

// TODO: test is needed
const value = memoize(
    (state, player) => {
        if finished(state) {
            return utility(state, player)
        }
        o = other(player)
        nextStates = nextState(state, player);
        result = [];
        for (const ns in nextStates) {
            result.push(-value(ns,o));
        }
        return Math.max(...result)
    }
)





const bestMove = (state, player) => { 
    nextStates = nextStates(state, player)
    bestVal = value(state, player)
    bestMoves = []
    for(const s in nextStates) {
        if(-value(s, other(player)) == bestVal) {
            bestMoves.push(s)
        }
    }
    bestState = choose(bestMoves)
    return bestVal, bestState
}

console.log(factorial(5))
console.log(factorial(6))

// helper function: turn decimal into binary
function dec2bin(dec) {
    return (dec >> 0).toString(2);
}

function set_bits(bits){
    let result = 0;
    for (const b of bits){
        result =result | (1 << b);
    }
    return result
}

// console.log(dec2bin(set_bits([1,3])));