for(let i=0;i<X.length;i++){
    let aux = 0
    for(let j=21; j>0; j--){
        aux += -(W[j]*X[i][j])

    }
    // console.log(aux)
    aux = (aux + W[0]*b)/W[22]

    console.log(`i = ${i}; aux = ${aux}; X[i] = ${X[i]}`)

    if(aux > X[i][22]) console.log('O paciente está morto')
    else console.log('O paciente está vivo')
}