const players = [0,1]
const start = 0

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

console.log(dec2bin(set_bits([1,3])));