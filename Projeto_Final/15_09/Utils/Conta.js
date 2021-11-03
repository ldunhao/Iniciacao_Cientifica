function Conta(hiperplano,X,i){
    let H_i = 0 
    for(let j=X[i].length; j>=0; j--){
        if(j==0) H_i += hiperplano[j]*(-1)
        else H_i += hiperplano[j]*X[i][j-1]
    }
    return H_i
}

module.exports = {
    Conta
}