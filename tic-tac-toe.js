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


////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Output Functions /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

const getDOMElements = () => {
    resultElements = [];
    for (let i of Array(3).keys()){
        for (let j of  Array(3).keys()){
            resultElements.push(document.getElementById(i.toString()+j.toString()));
            document.getElementById( i.toString()+j.toString() ).onclick = ()=>{player_move(i.toString()+","+j.toString())}
        }
    }
    return resultElements;
}

const editTextOfDOMElement = (e, text) => {
    e.innerHTML = text;
}

function printBoard(state){
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

function printStatus(msg){
    status_field = document.getElementById("status-field")
    editTextOfDOMElement(status_field, msg) 
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

const value = memoize(
    (state, player) => {
        num_value_calls+=1;
        if (finished(state)) {
            return utility(state, player)
        }
        let other_player = other(player)
        let ns = next_states(state, player);
        let result = [];
        for (const s of ns) {
            let new_val= value(s,other_player);
            result.push(-new_val);
        }
        return Math.max(...result)
    }
)


const best_move = (state, player) => { 
    let ns = next_states(state, player)
    let bestVal = value(state, player)
    let bestMoves = []
    for(const s of ns) {
        let other_val= value(s, other(player));
        if(-other_val == bestVal) {
            bestMoves.push(s)
        }
    }
    bestState = choose(bestMoves)
    return [bestVal, bestState]
}


function ki_move(){

        res= best_move(state, players[0]);
        val=res[0];
        state =res[1];
        console.log("KI made move - new state: " , dec2bin(state));
        printBoard(state);

        if (finished(state)){
            find_winner(state);
            return;
        } 
        printStatus("KI made move - it't your turn!")
}


function player_move(field) {
    if (!game_finished){
        let res = field.split(",");

        let row=parseInt(res[0]);
        let col=parseInt(res[1]);
        
        let mask = set_bit(9+row*3+col);
        if ( ( (state&mask)==0 ) && ( ((state<<9)&mask)==0 ) ){
            state = state|mask;
            console.log("Player made move - new state: " , dec2bin(state));
            printBoard(state);
        
            if (finished(state)){
                find_winner(state);
                return;
            }
            printStatus("Player made move - KI, it's your turn!")
            ki_move();
        }else{
            printStatus("Wrong input... Try again!");
        }
    }
    
}


function find_winner(state){
    if (finished(state)){
        if (utility(state,0)==1){
            printStatus("Player X won!")
            
        }else if (utility(state,0)==-1){
            printStatus("Player O won!")
        }else{
            printStatus("Untenschieden!")
        }
        game_finished=true;
        return true
    return false
    }
}

function reset_game(){
    state= start;
    game_finished = false;
    for(e of boardFields){
        editTextOfDOMElement(e,"");
    }
    
    if(Math.floor(Math.random()*2)){
        ki_move()
    }else{
        printStatus("You make the first move!");
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Main Program /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


const players = [0,1]
const start = 0
let state = start;
let game_finished = false;

let boardFields = getDOMElements();

if(Math.floor(Math.random()*2)){
    ki_move()
}else{
    printStatus("You make the first move!");
}