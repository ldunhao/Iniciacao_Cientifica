const csv = require('csv-parser');
const fs = require('fs')
const { WriteCSV } = require('./WriteCSV');

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let CountMortos = 0, CountVivos = 0

let CamposNomes = []
let PacientesTotal = [], PacientesTotalY = []
let QntdSintomasPreenchidos = Array(56).fill(0)

async function getSintomas(data){
    let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    // Separação dos campos que aplicaremos no Perceptron
    for(var i=0;i<campos.length;i++){
        campos[i] = campos[i].replace(/"|\r/g, '')
    }
    
    let RemoveItems = [39,40,42,54,55,56]
    
    let vetorcampos = []
    
    let camposadd = [65,69,76,79,89,90,95,96,97,98,99,100,101,102,103,104,105,120,131,134,135,136,137,138,139,140,141,142,143,145]
    
    //Sintomas que o paciente vai ter
    for(var i=28;i<58;i++){
        if(!RemoveItems.includes(i)) vetorcampos.push(i);
    }

    for(var i=58;i<146;i++){
        if(camposadd.includes(i)) vetorcampos.push(i)
    }
    //------------------------------------------------------------

    

    let CountCamposPreenchidos = 0
    for(let i=0;i<vetorcampos.length;i++){
        if(linha[vetorcampos[i]] != '') CountCamposPreenchidos++ 
    }

    QntdSintomasPreenchidos[CountCamposPreenchidos]++

    let sintomas = []
    
    if(CountCamposPreenchidos >= 25){

        if(linha[110] == '1'){ //Se o paciente estiver vivo
            for(var i=0;i<vetorcampos.length;i++){
                if(vetorcampos[i] == 79){
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,0)
                    else if(linha[vetorcampos[i]] == '2') sintomas.push(0,1)
                    else if(linha[vetorcampos[i]] == '3') sintomas.push(0,0)
                    else sintomas.push(1,1) //Quando o campo vier vazio
                }else {
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1)
                    else sintomas.push(0)
                }
            }
            CountVivos++
            PacientesVivos.push(sintomas)
        }
        else if(linha[110] == '2'){ //Se o paciente estiver morto
            for(var i=0;i<vetorcampos.length;i++){
                if(vetorcampos[i] == 79){
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,0)
                    else if(linha[vetorcampos[i]] == '2') sintomas.push(0,1)
                    else if(linha[vetorcampos[i]] == '3') sintomas.push(0,0)
                    else sintomas.push(1,1) //Quando o campo vier vazio
                }else {
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1)
                    else sintomas.push(0)
                }
            }
            
            CountMortos++
            PacientesMortos.push(sintomas)
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

function RandomArray(Vivos,Mortos){  // Escolhendo aleatóriamente os pacientes
    let PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []

    let countPacientes = 0

    while(countPacientes < 5){
        let idx = Math.floor(Math.random() * PacientesVivos.length)
        if(!PacientesVivosEscolhidos.includes(idx)){
            PacientesVivosEscolhidos.push(idx)
            PacientesTotal.push(PacientesVivos[idx])
            PacientesTotalY.push(1)
            countPacientes++
        } 
    }
        
    countPacientes = 0
    while(countPacientes < 5){
        idx = Math.floor(Math.random() * PacientesMortos.length)
        if(!PacientesMortosEscolhidos.includes(idx)){
            PacientesMortosEscolhidos.push(idx)
            PacientesTotal.push(PacientesMortos[idx])
            PacientesTotalY.push(-1)
            countPacientes++
        }
    }
}

function RunPerceptron(){
    // console.clear()
    console.log('mortosCount = %d', CountMortos)
    console.log('vivosCount = %d', CountVivos)
    
    RandomArray(PacientesVivos,PacientesMortos)

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<PacientesTotal[0].length;i++){
        W.push(1)
    }

    let tamanhoPacientes = PacientesTotal.length
    let ok, iteracoes

    let arr = Perceptron(PacientesTotal,tamanhoPacientes,W,PacientesTotalY,b,10000)

    ok = arr[0]
    W = arr[1]
    iteracoes = arr[2]

    while(!ok){
        PacientesTotal = [], PacientesTotalY = []
        W = []

        RandomArray(PacientesVivos,PacientesMortos)

        for(let i=0;i<PacientesTotal[0].length;i++){
            W.push(1)
        }

        arr = Perceptron(PacientesTotal,tamanhoPacientes,W,PacientesTotalY,b,10000)

        ok = arr[0]
        W = arr[1]
        iteracoes = arr[2]

        if(!ok) console.log("Não achou o Hiperplano")
    }

    console.log("\nO hiperplano foi achado em %d iterações", iteracoes)
    console.log(`W = ${W}`)
    console.log(`Tamanho de W = ${W.length}`)
}

var hrstart = process.hrtime()
fs.createReadStream('Data.csv')
.pipe(csv({}))
.on('data', (data) => {  //Lógica aplicada a cada linha
    getSintomas(data)
})
.on('end', () => {   //Lógica aplicada quando chega no EOF
    // RunPerceptron()

    //Printa quantos pacientes tem uma certa quantidade de campos Preenchidos
    // for(let i=0;i<QntdSintomasPreenchidos.length;i++){
    //     console.log("Tem %d pacientes com %d campos Preenchidos",QntdSintomasPreenchidos[i],i)
    // }
    // console.log(PacientesMortos.length+PacientesVivos.length)
    WriteCSV(PacientesMortos.concat(PacientesVivos),PacientesMortos.length,PacientesVivos.length);

    //Calculando o tempo de execução do código
    let hrend = process.hrtime(hrstart)
    console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
}
)