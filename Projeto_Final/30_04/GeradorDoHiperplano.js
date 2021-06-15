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

    for(var i=43;i<57;i++){
        if(linha[i] == '') doençasNull++
    }

    // if(linha[42] == 'S'){
    //     for(var i=42;i<54;i++){
    //         console.log(`${campos[i]}: ${linha[i]}`)
    //     }
    // }
    // console.log()


    if(doençasNull <= 10){
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

        // if(tentativas % 1000000 == 0) console.log(W)

        if(tentativas == 2000){
            console.log("Não achou um hiperplano")
            ok = false
            return [ok,W,tentativas]
        }
    }   

    console.log('cont = %d', tentativas)
    return [ok,W,tentativas]
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
    let X = []
    let n = mortosCount+vivosCount
    let Y = []
    let W = []
    var b = 1
    
    for(let i = 0;i<22;i++){
        W.push(1)
    }
    for(let i=0;i<vivosCount;i++){
        X.push(vivos[i])
        Y.push(1)
    }
    for(let i=0;i<mortosCount;i++){
        X.push(mortos[i])       
        Y.push(-1)
    }

    let randomVivos = []
    let randomMortos = []

    let RandomY = []

    for(let i = 0; i<30; i++){
        randomVivos.push(vivos[Math.floor(Math.random() * vivos.length)])
        RandomY.push(1)
    }

    
    for(let i = 0; i<30; i++){
        randomMortos.push(mortos[Math.floor(Math.random() * mortos.length)])
        RandomY.push(-1)
    }

    console.log(RandomY.length)
    console.log(randomMortos.length+randomVivos.length)

    
    console.log('mortosCount = %d', mortosCount)
    console.log('vivosCount = %d', vivosCount)

    // for(let i = 0; i<X.length; i++){
    //     console.log("\nDado %d",i)
    //     console.log(`Y[${i}] = ${Y[i]}`)
    //     console.log(X[i])
    //     console.log("")
    // }

    let RandomX = randomVivos.concat(randomMortos)
    console.log("Tamanho de RandomX = %d", RandomX.length)
    n = RandomX.length

    // console.log(RandomX)
    // console.log('Mortos')
    // console.log(randomMortos)
    // console.log('Vivos')
    // console.log(randomVivos)
    // console.log('\n')
    // console.log('\nX.length = %d',X.length)
    // console.log('Y.length = %d', Y.length)
    // console.log('X[0].length = %d', X[0].length)


    // console.log(`\nAqui`)
    
    let ok
    [ok,W] = Perceptron(RandomX,n,W,RandomY,b)
    
    console.log("Não Achou", ok)

    while(!ok){
        randomVivos = []
        randomMortos = []
        RandomY = []
    
        for(let i = 0; i<30; i++){
            randomVivos.push(vivos[Math.floor(Math.random() * vivos.length)])
            RandomY.push(1)
        }
    
        for(let i = 0; i<30; i++){
            randomMortos.push(mortos[Math.floor(Math.random() * mortos.length)])
            RandomY.push(-1)
        }

        RandomX = randomVivos.concat(randomMortos)
        n = RandomX.length

        // console.log(RandomX)

        ok = Perceptron(RandomX,n,W,RandomY,b)[0]
        W = Perceptron(RandomX,n,W,RandomY,b)[1]

        console.log("Não Achou", ok)
    }
    // console.log(`\nTerminou o Perceptron`)
    console.log(`W = ${W}`)
    // console.log('W.length = %d\n', W.length)

    // for(let i=0;i<X.length;i++){
    //     let aux = 0
    //     for(let j=21; j>0; j--){
    //         aux += -(W[j]*X[i][j])

    //     }
    //     // console.log(aux)
    //     aux = (aux + W[0]*b)/W[22]

    //     console.log(`i = ${i}; aux = ${aux}; X[i] = ${X[i]}`)

    //     if(aux > X[i][22]) console.log('O paciente está morto')
    //     else console.log('O paciente está vivo')
    // }

    //Calculando o tempo de execução do código
    hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
}
)