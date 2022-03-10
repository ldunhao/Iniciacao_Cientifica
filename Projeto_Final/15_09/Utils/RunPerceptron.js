const { RandomArray } = require('./RandomArray')
const { Perceptron } = require('./Perceptron')

function RunPerceptron(n,t,PacientesVivos,PacientesMortos){
    X = [], Ylinha = []
    
    const respRandomArray = RandomArray(n,X,Ylinha,PacientesVivos,PacientesMortos)
    X = respRandomArray[0]
    Ylinha = respRandomArray[1]

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<X[0].length;i++){
        W.push(Math.random()+0.1)
    }

    let N = X.length
    let ok, iteracoes

    let arr = Perceptron(X,N,W,Ylinha,b,t)

    ok = arr[0]
    W = arr[1]
    iteracoes = arr[2]
    Yteste = arr[3]

    while(!ok){
        X = [], Ylinha = []
        W = []

        const respRandomArray = RandomArray(n,X,Ylinha,PacientesVivos,PacientesMortos)
        X = respRandomArray[0]
        Ylinha = respRandomArray[1]

        for(let i=0;i<X[0].length;i++){
            W.push(1)
        }

        arr = Perceptron(X,N,W,Ylinha,b,t)

        ok = arr[0]
        W = arr[1]
        iteracoes = arr[2]
        Yteste = arr[3]

        if(!ok) console.log("Não achou o Hiperplano")
    }

    return [iteracoes,W]
}

module.exports = {
    RunPerceptron
}