let RemoveItems = [40,54,55,56] //
    
let vetorcampos = []

let camposadd = [10,11,13,16,17,19,22,26,27,65,66,69,70,76,77,78,79,80,83,85,87,89,90,109,111,114,116,124,125,126,127,128,131,133,148,151,152,153]

//Sintomas que o paciente vai 

for(var i=28;i<58;i++){
    if(!RemoveItems.includes(i)) {
        vetorcampos.push(i);
    }
}

for(var i=10;i<154;i++){
    if(camposadd.includes(i)) {
        vetorcampos.push(i)
    }
}

console.log(vetorcampos.length)