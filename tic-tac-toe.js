const players = [0,1]
const start = 0

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
console.log(finished(7))