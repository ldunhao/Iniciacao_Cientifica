const csv = require('csv-parser')
const fs = require('fs')
const firstline = require('firstline')

// Função para separar os sintomas e fatores de risco de cada paciente
function getDeadAndAlive(data){
    let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    doençasNull = 0
    count = 0

    let sintomas = []
    let fatoresRisco = []
    
    for(var i=31;i<39;i++){
        if(linha[i] == '') doençasNull++
    }

    // if(linha[42] == 'S'){
    //     for(var i=42;i<54;i++){
    //         console.log(`${campos[i]}: ${linha[i]}`)
    //     }
    // }
    // console.log()


    if(doençasNull != 8){
        if(linha[110]=='2'){
            for(var i=31;i<39;i++){
                if(linha[i] == '1') sintomas.push(1)
                else sintomas.push(0)
            }
    
            // Adicionando os fatores de risco em um vetor de booleanos: 1 se tem o fator de risco, 0 se não tem o fator de risco
            for(var i=43;i<57;i++){
                if(linha[i] == '1') fatoresRisco.push(1)
                else fatoresRisco.push(0)
            }
    
            mortosCount++
            let paciente = sintomas.concat(fatoresRisco)
            mortos.push(paciente)
        }else if(linha[110]=='1') {
            for(var i=31;i<39;i++){
                if(linha[i] == '1') sintomas.push(1)
                else sintomas.push(0)
            }
    
            // Adicionando os fatores de risco em um vetor de booleanos: 1 se tem o fator de risco, 0 se não tem o fator de risco
            for(var i=43;i<57;i++){
                if(linha[i] == '1') fatoresRisco.push(1)
                else fatoresRisco.push(0)
            }
    
            vivosCount++
            let paciente = sintomas.concat(fatoresRisco)
            vivos.push(paciente)
        }
    }
}

// Função para separar os campos do arquivo
async function getFirstLine(){
    var data = await firstline('ExData.csv')
    var campos = data.split(',')

    for(var i=0;i<campos.length;i++){
        campos[i] = campos[i].replace(/"|\r/g, '')
    }

    let dt = []
    let id = []
    let co = []
    let pcr = []
    let sintomas = []
    let rest = []

    console.log(campos.length)
    for(var i=0;i<campos.length;i++){
        if(campos[i].includes('DT_')) dt.push([campos[i], i]);
        else if(campos[i].includes('ID_')) id.push([campos[i], i]);
        else if(campos[i].includes('CO_')) co.push([campos[i], i]);
        else if(campos[i].includes('PCR_')) pcr.push([campos[i], i]);
        else if(!campos[i].includes('_')) sintomas.push([campos[i], i]);
        else rest.push([campos[i], i])
    }

    console.log(rest)

    //Printando os Sintomas
    for(var i=31;i<42;i++){
        console.log([campos[i], i])
    }
    console.log()
}
// getFirstLine()


// ################################## Parte do Perceptron ##################################
function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

function Perceptron(X,n,W,Ylinha,b){
    var d = X[0].length

    for(var i=0;i<n;i++) X[i] = [-b].concat(X[i]);

    W = [1].concat(W)
    var l = 0
    var Y = new Array(n).fill(0)
    var cont = 0


    while (l == 0){
        cont++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += X[i][j] * W[j];
            Y[i] = sinal(soma)
        }

        var i=0, l=1;

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

        // if(cont % 1000000 == 0) console.log(W)
    }   

    // console.log('cont = %d', cont)
    return W
} 
// #########################################################################################

let count = 0
let mortosCount = 0; vivosCount = 0; indefinido = 0
let mortos = []; vivos = []
let doençasNull = 0

var hrstart = process.hrtime()
fs.createReadStream('ExData.csv')
.pipe(csv({}))
.on('data', (data) => {  //Lógica aplicada a cada linha
    getDeadAndAlive(data)
})
.on('end', () => {   //Lógica aplicada quando chega no EOF

    Waux = [[-25],[-6],[-12],[4],[-10],[-3],[2],[-5],[14],[-10],[1],[1],[1],[1],[-24],[25],[1],[6],[-11],[1],[1],[5],[1]]

    let X = []
    let n = mortosCount+vivosCount
    let Y = []
    let W = []
    var b = 1
    
    let randomVivos = []
    let randomMortos = []

    for(let i = 0; i<300; i++){
        randomVivos.push(vivos[Math.floor(Math.random() * vivos.length)])
    }
    
    for(let i = 0; i<300; i++){
        randomMortos.push(mortos[Math.floor(Math.random() * mortos.length)])
    }


    for(let i = 0;i<22;i++){
        W.push(1)
    }
    for(let i=0;i<randomVivos.length;i++){
        X.push(randomVivos[i] = [1].concat(randomVivos[i]))
        Y.push(1)
    }
    for(let i=0;i<randomMortos.length;i++){
        X.push(randomMortos[i] = [1].concat(randomMortos[i]))       
        Y.push(-1)
    }

    // console.log('Mortos')
    // console.log(randomMortos)
    // console.log('Vivos')
    // console.log(randomVivos)
    console.log('\n')
    // console.log('\nX.length = %d',X.length)
    // console.log('Y.length = %d', Y.length)
    // console.log('X[0].length = %d', X[0].length)
    // console.log('mortosCount = %d', mortosCount)
    // console.log('vivosCount = %d', vivosCount)


    // console.log(`\nAqui`)
    // W = Perceptron(X,n,W,Y,b)
    // console.log(`\nTerminou o Perceptron`)
    // console.log(`W = ${W}`)
    // console.log('W.length = %d\n', W.length)

    let MortosCorretos=0
    let VivosCorretos=0


    for(let i=0;i<X.length;i++){
        let aux = 0
        for(let j=21; j>0; j--){
            aux += -(Waux[j]*X[i][j])

        }
        // console.log(aux)
        aux = (aux + Waux[0]*b)/Waux[22]

        
        // console.log('\n')
        // console.log(`i = ${i}; aux = ${aux}; X[i] = ${X[i]}`)
        // if(aux > X[i][22]) console.log('O sistema define o paciente como morto')
        // else console.log('O sistema define o paciente como vivo')
        
        

        if(Y[i] == '-1'){
            console.log('Mortos')
            console.log(`X[${i}] = ${X[i]}`)
            console.log(`X[${i}][22] = ${X[i][22]}`)

            if(aux > X[i][22]) MortosCorretos++
        }else {
            console.log('Vivo')
            console.log(`X[${i}] = ${X[i]}`)
            console.log(`X[${i}][22] = ${X[i][22]}`)
            if (aux < X[i][22]) VivosCorretos++
        }
        // if(aux > X[i][22] && Y[i] == '-1') console.log('O especialista define morto')
        // else if (aux < X[i][22] && Y[i] == '1') console.log('O especialista define vivo')
    }

    console.log('Vivos = %d; Vivos Corretos = %d', randomVivos.length, VivosCorretos)
    console.log('Mortos = %d; Mortos Corretos = %d', randomMortos.length, MortosCorretos)

    //Calculando o tempo de execução do código
    hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
}
)

// i = 0; aux = -6; X[i] = -1,1,1,0,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0 //O paciente está vivo
// i = 1; aux = -3; X[i] = -1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 //O paciente está vivo
// i = 2; aux = -2; X[i] = -1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 //O paciente está vivo
// i = 3; aux = -2; X[i] = -1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 //O paciente está vivo
// i = 4; aux = -1; X[i] = -1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 //O paciente está vivo
// i = 5; aux = 3; X[i] = -1,1,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0 //O paciente está morto
// i = 6; aux = 2; X[i] = -1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0 //O paciente está morto


// Pegar 80% dos pacientes válidos(possui sintomas) e aplicar no Perceptron para achar o hiperplano
// Após isso, usar os outros 20% na equação do hiperplano.
// Ver qual o percentual de acerto dos 20% restantes.
// Rodar um certo num de vezes, cada vez com os 80% diferentes(randomicos)
