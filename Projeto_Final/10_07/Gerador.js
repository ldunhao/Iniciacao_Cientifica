const csv = require('csv-parser');
const fs = require('fs')
const readLine = require("readline")


const { writeFile } = require('./WriteFile')
const { readFile } = require('./ReadFile')

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let CountMortos = 0, CountVivos = 0

let X = [], Ylinha = []
let PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []
let B = 0

let WFinal = []

let contTotal = 0

let Arr_Hiperplanos = []

async function getSintomas(data){
    // let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    let sintomas = []

    for(let i=0;i<linha.length-1;i++){
        sintomas.push(parseInt(linha[i]))
    }
    
    if(linha[linha.length-1] == "1")PacientesVivos.push(sintomas), CountVivos++;
    else PacientesMortos.push(sintomas), CountMortos++;
}

function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

function Perceptron(X,n,W,Ylinha,b,t){
    var d = X[0].length
    B = b
    for(var i=0;i<n;i++) X[i] = [-b].concat(X[i]);

    W = [1].concat(W)

    var l = 0
    var Y = new Array(n).fill(0)
    var Yteste = new Array(n).fill(0)
    var tentativas = 0

    var ok = true;

    while (l == 0){
        tentativas++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += X[i][j] * W[j];
            Yteste[i] = soma
            Y[i] = sinal(soma)
        }

        var i=0 
        l=1

        while (true){
            if (Y[i] != Ylinha[i]){
                for(var j=0;j<=d;j++){
                    W[j] += Ylinha[i] * X[i][j]
                }
                l=0
            }
            else {
                i += 1
            }
            
            if(i>=n || l==0){
                break
            }
        }

        
        if(tentativas == t){
            ok = false
            return [ok,W,tentativas,Yteste]
        }
    }   
    contTotal += tentativas
    return [ok,W,tentativas,Yteste]
} 

function RandomArray(n){  // Escolhendo aleatóriamente os pacientes
    PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []

    let countPacientes = 0

    while(countPacientes < n/2){
        let idx = Math.floor(Math.random() * PacientesVivos.length)
        if(!PacientesVivosEscolhidos.includes(idx)){
            PacientesVivosEscolhidos.push(idx)
            X.push(PacientesVivos[idx])
            Ylinha.push(1)
            countPacientes++
        } 
    }
        
    countPacientes = 0
    while(countPacientes < n/2){
        idx = Math.floor(Math.random() * PacientesMortos.length)
        if(!PacientesMortosEscolhidos.includes(idx)){
            PacientesMortosEscolhidos.push(idx)
            X.push(PacientesMortos[idx])
            Ylinha.push(-1)
            countPacientes++
        }
    }
}

function RunPerceptron(n,t){
    X = [], Ylinha = []
    // console.clear()
    
    RandomArray(n)

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<X[0].length;i++){
        W.push(1)
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

        RandomArray(n)

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


    console.log("\nO hiperplano foi achado em %d iterações", iteracoes)
    console.log(`Hiperplano = ${W}`)
    return [iteracoes,W]
}

function Run(z,n,t){
    console.log('Quantidade de mortos do banco = %d', CountMortos)
    console.log('Quantidade de vivos do banco = %d', CountVivos)

    let iteracoes_media = 0
    for(let i=0;i<z;i++){
        let arr = RunPerceptron(n,t)
        iteracoes_media += arr[0]

        console.log(`Rodando o Perceptron pela ${i+1}° vez de ${z} vezes`)
        Arr_Hiperplanos.push(arr[1])
    }
    console.log(`\n\nMédia de iterações para um n = ${n} e iteração máxima t = ${t}: ${iteracoes_media/z} iterações`)
}

function TesteDeSanidade(W) {
    let auxArr = []
    for(let i=0;i<X.length;i++){
        let aux = 0
        for(let j=X[i].length-1; j>=0; j--){
            aux += W[j]*X[i][j]
        }
        auxArr.push(aux)
    }

    for(let i=0; i<auxArr.length;i++){

        if(sinal(auxArr[i]) == -1){
            console.log(`Ylinha[i] = ${Ylinha[i]} => sinal de auxArr[i] = ${sinal(auxArr[i])}`)
            console.log("Morto")
        }else {
            console.log(`Ylinha[i] = ${Ylinha[i]} => sinal de auxArr[i] = ${sinal(auxArr[i])}`)
            console.log("Vivo")
        }
    }
}

var hrstart = process.hrtime()

async function Gerador(){
    await fs.createReadStream('ChosenData.csv')
    .pipe(csv({}))
    .on('data', (data) => {  //Lógica aplicada a cada linha
        getSintomas(data)
    })
    .on('end', async () => {   //Lógica aplicada quando chega no EOF
    
        Run(1,100,10000);
    
        // let W = Math.floor(Math.random() * Arr_Hiperplanos.length)
        console.log("Cont total = %d\n", contTotal)
        W = Arr_Hiperplanos[0]
    
        writeFile("HiperplanoParam",X,W,X.length)
    
        //Calculando o tempo de execução do código
        let hrend = process.hrtime(hrstart)
        console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)

        WFinal = W
    }
    )

    return WFinal;
}

Gerador()

module.exports = {
    Gerador: Gerador
}
