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
let Xteste = [], YlinhaTeste = []
let WFinal = []

let contTotal = 0
let pacientes = []
let contObitos = 0
let contRemidos = 0
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

function RandomArray(n,X,Ylinha){  // Escolhendo aleatóriamente os pacientes
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
    
    RandomArray(n,X,Ylinha)

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

        RandomArray(n,X,Ylinha)

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


    // console.log("\nO hiperplano foi achado em %d iterações", iteracoes)
    // console.log(`Hiperplano = ${W}`)
    return [iteracoes,W]
}

function Run(z,n,t){
    // console.log('Quantidade de mortos do banco = %d', CountMortos)
    // console.log('Quantidade de vivos do banco = %d', CountVivos)

    let iteracoes_media = 0
    for(let i=0;i<z;i++){
        let arr = RunPerceptron(n,t)
        iteracoes_media += arr[0]

        // console.log(`Rodando o Perceptron pela ${i+1}° vez de ${z} vezes`)
        Arr_Hiperplanos.push(arr[1])
    }
    // console.log(`\n\nMédia de iterações para um n = ${n} e iteração máxima t = ${t}: ${iteracoes_media/z} iterações`)
}

function TesteDeSanidade(W,X,Ylinha) {
    let auxArr = []

    contObitos=0
    contRemidos=0

    for(let i=0;i<X.length;i++){
        let aux = 0
        for(let j=X[i].length-1; j>=0; j--){
            aux += W[j]*X[i][j]
        }
        auxArr.push(aux)
    }


    for(let i=0; i<auxArr.length;i++){
        if(Ylinha[i] == -1 && sinal(auxArr[i]) == -1){
            contObitos++
        }
        if(Ylinha[i] == 1 && sinal(auxArr[i]) == 1){
            contRemidos++
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
        console.log('Quantidade de mortos do banco = %d', CountMortos)
        console.log('Quantidade de vivos do banco = %d', CountVivos)
        let ok = 1
        let cont = 0

        while(ok){
            Xteste = [], YlinhaTeste = []

            let p = 0.40
            contObitos = 0
            contRemidos = 0
            Run(1,100,20000);
    
            // let W = Math.floor(Math.random() * Arr_Hiperplanos.length)
            // console.log("Cont total = %d\n", contTotal)
            let W = Arr_Hiperplanos[Arr_Hiperplanos.length-1]
        
            let a = 232000
            let blockName = ""
            let arr = []

            RandomArray(a,Xteste,YlinhaTeste)
            TesteDeSanidade(W,Xteste,YlinhaTeste)

            console.log(`\ncontObitos/a: ${contObitos/a}, contRemidos/a: ${contRemidos/a}`)

            console.log(++cont)
            if(contObitos/a >= 0.3 && contRemidos/a >= 0.3){
                blockName = await writeFile("HiperplanoEstrategia1",X,W,X.length,contObitos,contRemidos)
            }
            if(blockName != "") {
                arr = await readFile("HiperplanoEstrategia1",blockName,X.length)
            }
            
            if(arr.length != 0){
                const name = arr [0]
                let Wfile = arr[arr.length-4]
                const contObitosfile = arr[arr.length-3]
                const contRemidosfile = arr[arr.length-2]
                const N = arr[arr.length-1]
        
                let aux = Wfile.split(',')
                for(let i=0;i<aux.length;i++) aux[i] = Number(aux[i])
                
                for(let i=1;i<=N;i++) {
                    let aux = arr[i].split(',')
                    for(let i=0;i<aux.length;i++) aux[i] = Number(aux[i])
                    pacientes.push(aux)
                }
        
                TesteDeSanidade(aux,Xteste,YlinhaTeste)
        
                console.log(`W: ${W}`)
                console.log("Contador de mortos: %d", contObitos)
                console.log("Contador de remidos: %d", contRemidos)
                console.log("Soma: %d", contObitos+contRemidos)
                console.log("A: %d", a)
            }

            if(contObitos/a >= p && contRemidos/a >=p){
                console.log("Finalizado")
                break;
            }
        }
        

        //Calculando o tempo de execução do código
        let hrend = process.hrtime(hrstart)
        console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)

        // WFinal = W
    }
    )

    // return WFinal;
}

Gerador()

module.exports = {
    Gerador: Gerador
}
