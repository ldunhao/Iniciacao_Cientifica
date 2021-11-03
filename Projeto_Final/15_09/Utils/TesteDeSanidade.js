const { Conta } = require('./Conta')
const { Sinal } = require('./Perceptron')

function TesteDeSanidade(W,X,Ylinha) {
    let auxArr = []

    contObitos=0
    contRemidos=0

    for(let i=0;i<X.length;i++){
        let aux = Conta(W,X,i)
        auxArr.push(aux)
    }


    for(let i=0; i<auxArr.length;i++){
        if(Ylinha[i] == -1 && Sinal(auxArr[i]) == -1){
            contObitos++
        }
        if(Ylinha[i] == 1 && Sinal(auxArr[i]) == 1){
            contRemidos++
        }
    }

    return [contObitos,contRemidos]
}

module.exports = {
    TesteDeSanidade
}