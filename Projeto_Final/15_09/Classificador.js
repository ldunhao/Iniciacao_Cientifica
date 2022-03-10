const csv = require('csv-parser');
const fs = require('fs')
const readLine = require("readline")


const { writeFile } = require('./WriteFile')
const { readFile } = require('./ReadFile')

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let CountMortos = 0, CountVivos = 0

let CamposNomes = []
let X = [], Ylinha = []
let QntdSintomasPreenchidos = Array(56).fill(0)
let PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []
let B = 0

let contObitos = 0
let contRemidos = 0
let pacientes = []
let Yteste = []
let Arr_Hiperplanos = []

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
        if(Ylinha[i] == -1 && sinal(auxArr[i]) == -1){
            contObitos++
        }
        if(Ylinha[i] == 1 && sinal(auxArr[i]) == 1){
            contRemidos++
        }
    }
}

function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

var hrstart = process.hrtime()

function Classificador(){
    fs.createReadStream('BancoTratado2020_29_08_21.csv')
    .pipe(csv({}))
    .on('data', (data) => {  //Lógica aplicada a cada linha
        getSintomas(data)
    })
    .on('end', async () => {   //Lógica aplicada quando chega no EOF
        console.log('Quantidade de mortos do banco = %d', CountMortos)
        console.log('Quantidade de vivos do banco = %d\n\n', CountVivos)
        //338460_21
        //268290_20
        let a = 268290
        RandomArray(a)

        let arr = await readFile("HiperplanoEstrategia1",'21/8_16:27:50_100',X.length)

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

        TesteDeSanidade(aux)

        console.log("Contador de mortos: %d", contObitos)
        console.log("Contador de remidos: %d", contRemidos)
        console.log("Soma: %d", contObitos+contRemidos)
        console.log("A: %d", a)

        //Calculando o tempo de execução do código
        let hrend = process.hrtime(hrstart)
        console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
    }
    )
}

Classificador()
module.exports = {
    Classificador
}