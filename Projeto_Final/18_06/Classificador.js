for(let i=0;i<X.length;i++){
    let aux = 0
    for(let j=X[i].length-2; j>0; j--){
        aux += -(W[j]*X[i][j])
        //console.log("O valor do aux: %d",aux)
        //break
    }

    /*
   console.log(X[i].length)
   console.log(W[X[i].length-1])
   console.log()
   
   console.log("W[0]: %d",W[0])
   console.log("B: %d",B)
   console.log("X[i].length: %d",X[i].length)
   console.log("W[X[i].length-1]: %d",W[X[i].length-1])
   */
   aux = (aux + W[0]*B)/W[X[i].length-1]
   
   console.log("\nAux = %d", aux);
   if(aux <= Ylinha[i]){
       console.log(`${Ylinha[i]}`)
       console.log("Morto")
   }else {
       console.log(`${Ylinha[i]}`)
       console.log("Vivo")
   }
}