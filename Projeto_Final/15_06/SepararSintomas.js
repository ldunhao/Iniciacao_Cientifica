const csv = require('csv-parser');
const fs = require('fs')

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let CountMortos = 0, CountVivos = 0

let CamposNomes = []
let PacientesTotal = [], PacientesTotalY = []
let QntdSintomasPreenchidos = Array(56).fill(0)
let PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []

async function getSintomas(data){
    // let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    let sintomas = []

    for(let i=0;i<linha.length-1;i++){
        sintomas.push(parseInt(linha[i]))
    }
    
    if(linha[linha.length-1] == "Vivo")PacientesVivos.push(sintomas), CountVivos++;
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

    for(var i=0;i<n;i++) X[i] = [-b].concat(X[i]);

    W = [1].concat(W)

    var l = 0
    var Y = new Array(n).fill(0)
    var tentativas = 0

    var ok = true;

    while (l == 0){
        tentativas++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += X[i][j] * W[j];
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
            return [ok,W]
        }
    }   

    return [ok,W,tentativas]
} 

function RandomArray(Vivos,Mortos,n){  // Escolhendo aleatóriamente os pacientes
    PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []

    let countPacientes = 0

    while(countPacientes < n/2){
        let idx = Math.floor(Math.random() * PacientesVivos.length)
        if(!PacientesVivosEscolhidos.includes(idx)){
            PacientesVivosEscolhidos.push(idx)
            PacientesTotal.push(PacientesVivos[idx])
            PacientesTotalY.push(1)
            countPacientes++
        } 
    }
        
    countPacientes = 0
    while(countPacientes < n/2){
        idx = Math.floor(Math.random() * PacientesMortos.length)
        if(!PacientesMortosEscolhidos.includes(idx)){
            PacientesMortosEscolhidos.push(idx)
            PacientesTotal.push(PacientesMortos[idx])
            PacientesTotalY.push(-1)
            countPacientes++
        }
    }
}

function RunPerceptron(n,t){
    PacientesTotal = [], PacientesTotalY = []
    // console.clear()
    
    RandomArray(PacientesVivos,PacientesMortos,n)

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<PacientesTotal[0].length;i++){
        W.push(1)
    }

    let tamanhoPacientes = PacientesTotal.length
    let ok, iteracoes

    let arr = Perceptron(PacientesTotal,tamanhoPacientes,W,PacientesTotalY,b,t)

    ok = arr[0]
    W = arr[1]
    iteracoes = arr[2]
    while(!ok){
        PacientesTotal = [], PacientesTotalY = []
        W = []

        RandomArray(PacientesVivos,PacientesMortos,n)

        for(let i=0;i<PacientesTotal[0].length;i++){
            W.push(1)
        }

        arr = Perceptron(PacientesTotal,tamanhoPacientes,W,PacientesTotalY,b,t)

        ok = arr[0]
        W = arr[1]
        iteracoes = arr[2]

        if(!ok) console.log("Não achou o Hiperplano")
    }

    console.log("\nO hiperplano foi achado em %d iterações", iteracoes)
    console.log(`Hiperplano = ${W}`)

    return iteracoes
}

function Run(z,n,t){
    console.log('Quantidade de mortos do banco = %d', CountMortos)
    console.log('Quantidade de vivos do banco = %d', CountVivos)

    let iteracoes_media = 0
    for(let i=0;i<z;i++){
        iteracoes_media += RunPerceptron(n,t)

        console.log(`Rodando o Perceptron pela ${i+1}° vez de ${z} vezes`)
    }
    console.log(`\n\nMédia de iterações para um n = ${n} e iteração máxima t = ${t}: ${iteracoes_media/z} iterações`)
}

var hrstart = process.hrtime()
fs.createReadStream('ChosenData.csv')
.pipe(csv({}))
.on('data', (data) => {  //Lógica aplicada a cada linha
    getSintomas(data)
})
.on('end', () => {   //Lógica aplicada quando chega no EOF

    Run(10,30,1000);

    //Printa quantos pacientes tem uma certa quantidade de campos Preenchidos
    // for(let i=0;i<QntdSintomasPreenchidos.length;i++){
    //     console.log("Tem %d pacientes com %d campos Preenchidos",QntdSintomasPreenchidos[i],i)
    // }
    // console.log(PacientesMortos.length+PacientesVivos.length)

    //Calculando o tempo de execução do código
    let hrend = process.hrtime(hrstart)
    console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
}
)