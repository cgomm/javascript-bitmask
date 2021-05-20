// helper functions
const choose = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index]
}

const memoize = (fn) => {
    let cache  = {};
    return (...args) => {
        let n = args[0];
        if (n in cache) {
            return cache[n];
        } else {
            let result = fn(n);
            cache[n] = result;
            return result;
        }
    }
}

const getDOMElements = () => {
    resultElements = [];
    resultElements.push(document.getElementById("00"));
    resultElements.push(document.getElementById("01"));
    resultElements.push(document.getElementById("02"));
    resultElements.push(document.getElementById("10"));
    resultElements.push(document.getElementById("11"));
    resultElements.push(document.getElementById("12"));
    resultElements.push(document.getElementById("20"));
    resultElements.push(document.getElementById("21"));
    resultElements.push(document.getElementById("22"));
    return resultElements;
}

const editTextOfDOMElement = (e, text) => {
    e.innerHTML = text;
}

function printBoard(state){
    x_state= state&511;
    o_state= state>>9;
    mask = 1;
    for (cell of Array(9).keys()){
        if (x_state&mask){
            editTextOfDOMElement(boardFields[cell],"X");
        }
        if (o_state&mask){
            editTextOfDOMElement(boardFields[cell],"O");
        }
        mask = mask<<1;
    }
}

//test_state= set_bits([2,3,5,9+1,9+4,9+8])


boardFields=getDOMElements();
//printBoard(test_state)




function other(p){
    if(p==0){
        return 1;
    }
    return 0;
}


// main programm
const players = [0,1]
const start = 0

// TODO: test is needed
const value = memoize(
    (state, player) => {
        if (finished(state)) {
            return utility(state, player)
        }
        o = other(player)
        nextStates = next_states(state, player);
        result = [];
        for (const ns in nextStates) {
            result.push(-value(ns,o));
        }
        return Math.max(...result)
    }
)

const bestMove = (state, player) => { 
    console.log("bestmove");
    nextStates = next_states(state, player)
    console.log("got next states");
    bestVal = value(state, player)
    console.log("got values");
    bestMoves = []
    console.log("1");
    for(const s in nextStates) {
        if(-value(s, other(player)) == bestVal) {
            bestMoves.push(s)
        }
    }
    
    bestState = choose(bestMoves)
    return [bestVal, bestState]
}

// helper function: turn decimal into binary
function dec2bin(dec) {
    return (dec >> 0).toString(2);
}

// helper function: remove set of elements from set
function removeSetFromSet(originalSet, toBeRemovedSet) {
    toBeRemovedSet.forEach(Set.prototype.delete, originalSet);
}

function set_bits(bits){
    let result = 0;
    for (const b of bits){
        result |= (1 << b);
    }
    return result;
}

function set_bit(n){
    return 1 << n;
}

function empty(state){
    Free = new Set(Array(9).keys())

    let new_arr = Array.from(Array(9).keys()).filter(n => ((state & (1 << n)) != 0));
    removeSetFromSet(Free,new Set(new_arr));

    new_arr = Array.from(Array(9).keys()).filter(n => ((state & (1 << (9+n))) != 0));
    removeSetFromSet(Free,new Set(new_arr));

    return Free;
}

function next_states(state, player){
    Empty = empty(state);
    Result = [];
    for (n of Empty){
        next_state = state | set_bit(player * 9 + n);
        Result.push(next_state);
    }
    return Result;
}

All_Lines = [ set_bits([0,1,2]), set_bits([3,4,5]), set_bits([6,7,8]),
                set_bits([0,3,6]), set_bits([1,4,7]), set_bits([2,5,8]),
                set_bits([0,4,8]), set_bits([2,4,6]) ]

function utility(state, player){
    for (mask of All_Lines){
        if((state & mask) == mask){
            return 1 - 2 * player;
        }
        if(((state >> 9)& mask)==mask){
            return -1 +2 * player;
        }
    }
    if ((state&511)|(state>>9)!=511){
        return null;
    }
    return 0;
}

function finished(state){
    return utility(state,0)!=null;
}


//console.log(dec2bin(set_bits([1,3])));
//console.log(empty(9))
//console.log(next_states(1,1));
//console.log(All_Lines)
//console.log(finished(7))


function play_game(){
    state = start;
    while (1){
        console.log("iteration");
        firstPlayer = players[0];
        res= bestMove(state, firstPlayer);
        val=res[0];
        state =res[1];
        console.log("Value:",val);
        printBoard(state);
        if (finished(state)){
            console.log("player 0 finished");
            return;
        } 
        state= get_input(state);
        printBoard(state);
        if (finished(state)){
            console.log("player 1 finished");
            return;
        }
    }
}



function get_input(state){
    while (1){
        res= prompt("x,y of next move").split(",");
        row=res[0];
        col=res[1];
        mask = set_bit(9+row*3+col);
        if ((state&mask)==0){
            return state|mask;
        }else{
            console.log("wrong input");
        }
    }
}

play_game();