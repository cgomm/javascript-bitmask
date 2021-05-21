////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Tic-Tac-Toe-Bitboard Functions ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

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
    let Free = new Set(Array(9).keys())

    let new_arr = Array.from(Array(9).keys()).filter(n => ((state & (1 << n)) != 0));
    removeSetFromSet(Free,new Set(new_arr));

    new_arr = Array.from(Array(9).keys()).filter(n => ((state & (1 << (9+n))) != 0));
    removeSetFromSet(Free,new Set(new_arr));

    return Free;
}

function next_states(state, player){
    let Empty = empty(state);
    let Result = [];
    for (n of Empty){
        let next_state = state | set_bit(player * 9 + n);
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
    if (((state&511)|(state>>9))!=511){
        return null;
    }
    return 0;
}

// s1 = set_bits([0, 2, 3, 6, 1+9,  4+9, 5+9])
// console.log("u1: ",utility(s1,0));

// s2 = set_bits([0, 2, 6, 8, 1+9, 4+9, 7+9])
// console.log("u2: ",utility(s2,0));

// s3 = set_bits([0, 2, 5, 6, 7, 1+9, 3+9, 4+9, 8+9])
// console.log("u3: ",utility(s3,0));

// s4 = set_bits([0, 2, 5, 6, 1+9, 3+9, 4+9]);
// console.log("u4: ",utility(s4,0));

function finished(state){
    return utility(state,0)!=null;
}


function find_winner(state){
    if (finished(state)){
        if (utility(state,1)==1){
            console.log("Player 0 won!!!!!!!")
        }else if (utility(state,1)==-1){
                console.log("Player 1 won!!!!!!!!")
        }else{
            console.log("untenschieden!!!!!!!")
        }
        return true
    return false
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Output Functions /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

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
    console.log("print")
    let x_state= state&511;
    let o_state= state>>9;
    let mask = 1;
    for (let cell of Array(9).keys()){
        if (x_state&mask){
            editTextOfDOMElement(boardFields[cell],"X");
        }
        if (o_state&mask){
            editTextOfDOMElement(boardFields[cell],"O");
        }
        mask = mask<<1;
    }
}



function get_move(state){
    while (1){
        let res= prompt("x,y of next move").split(",");
        let row=parseInt(res[0]);
        let col=parseInt(res[1]);
        let mask = set_bit(9+row*3+col);
        if ((state&mask)==0){
            return state|mask;
        }else{
            console.log("wrong input");
        }
    }
}


// helper function: turn decimal into binary
function dec2bin(dec) {
    return (dec >> 0).toString(2);
}


////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Minimax Functions /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// helper function: choose random element
const choose = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index]
}


let cache  = {};

const memoize = (fn) => {
    return (...args) => {
        let arg1 = args[0];
        let arg2 = args[1];
        if ([arg1,arg2] in cache) {
            //console.log("using mem func");
            return cache[[arg1,arg2]];
        } else {
            let result = fn(arg1,arg2);
            cache[[arg1,arg2]] = result;
            return result;
        }
    }
}

function other(p){
    if(p==0){
        return 1;
    }
    return 0;
}


let num_value_calls=0;

// TODO: test is needed
const value = memoize(
    (state, player) => {
        //console.log("value(",state,",",player,")")
        num_value_calls+=1;
        if (finished(state)) {
            //console.log("util(",state,",",player,"): ",utility(state, player))
            return utility(state, player)
        }
        let other_player = other(player)
        let ns = next_states(state, player);
        //console.log("ns: ",ns)
        let result = [];
        for (const s of ns) {
            //console.log(s)
            //console.log("player: ",player, " other: ",other_player);
            let new_val= value(s,other_player);
            //console.log(new_val)
            result.push(-new_val);
        }
        //console.log("result: ",result);
        return Math.max(...result)
    }
)

//console.log("result value: ",value(set_bits([0, 6, 2+9]),1));

const best_move = (state, player) => { 
    //console.log("bestmove");
    let ns = next_states(state, player)
    //console.log("got next states: ",ns);
    //console.log("value(",state,",",player,")")
    let bestVal = value(state, player)
    //console.log("got bestVal: ",bestVal);
    let bestMoves = []
    for(const s of ns) {
        let other_val= value(s, other(player));
        console.log("other val of:", s);
        console.log("other_val: ",other_val);
        if(-other_val == bestVal) {
            bestMoves.push(s)
        }
    }
    //console.log("best_moves:");
    //console.log(bestMoves);
    bestState = choose(bestMoves)
    return [bestVal, bestState]
}

//console.log(best_move(0,0));

function play_game(){
    state = start;
    while (1){
        firstPlayer = players[0];
        //console.log("calc best move");
        res= best_move(state, firstPlayer);
        //console.log("got best move");
        val=res[0];
        state =res[1];
        //console.log("Value:",val);
        //console.log("state: ",state)
        printBoard(state);
        if (finished(state)){
            find_winner(state);
            return;
        } 
        res= best_move(state, other(firstPlayer));
        //console.log("got best move");
        val=res[0];
        state =res[1];
        //state= get_move(state);
        printBoard(state);
        if (finished(state)){
            find_winner(state);
            return;
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Main Program /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

const players = [0,1]
const start = 0

boardFields=getDOMElements();

//play_game();