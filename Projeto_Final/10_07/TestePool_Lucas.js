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

let AcertoV = 0, ErroV = 0
let AcertoM = 0, ErroM = 0

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

function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

var hrstart = process.hrtime()

function TestePool(){
    fs.createReadStream('MiniBanco.csv')
    .pipe(csv({}))
    .on('data', (data) => {  //Lógica aplicada a cada linha
        getSintomas(data)
    })
    .on('end', async () => {   //Lógica aplicada quando chega no EOF
        console.log('Quantidade de mortos do banco = %d', CountMortos)
        console.log('Quantidade de vivos do banco = %d\n\n', CountVivos)

        let a = 20
        RandomArray(a)

        for(let i = 0; i<X.length; i++){
            let arrH_i = []
            let vivo = 0, morto = 0
            for(let Hpidx = 1; Hpidx<=9;Hpidx++){
                let arr = await readFile('9_HiperplanoEstrategia1',`Hiperplano${Hpidx}`,X.length)
                let hiperplano = arr[1]
                
                hiperplano = hiperplano.split(',')

                for(let i=0;i<hiperplano.length-1;i++){
                    hiperplano[i] = parseInt(hiperplano[i])
                }

                // Início do calculo de H(i)
                for(let j=X[i].length-1; j>=0; j--){
                    H_i += hiperplano[j]*X[i][j]
                }
                arrH_i.push(H_i)
                // Fim do calculo de H(i)

                if(H_i > 0) vivo++
                else morto++
            }
            
            if((vivo/9) >= (1/2)){
                if(Ylinha[i] == 1) AcertoV++
                else ErroV++
            }else {
                if(Ylinha[i] == -1) AcertoM++
                else ErroM++
            }
        }

        console.log("AcertoV = ", AcertoV )
        console.log("ErroV = ", ErroV )
        console.log("AcertoM = ", AcertoM )
        console.log("ErroM = ", ErroM )
        //Calculando o tempo de execução do código
        let hrend = process.hrtime(hrstart)
        console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
    }
    )

    return [AcertoV,ErroV,AcertoM,ErroM]
}

TestePool()
module.exports = {
    TestePool
}
