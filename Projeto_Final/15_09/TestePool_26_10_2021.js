const csv = require('csv-parser');
const fs = require('fs')
const readLine = require("readline")


//const { writeFile } = require('./WriteFile')
const { RandomArray } = require('./Utils/RandomArray')
const { RandomArrayTotal } = require('./Utils/RandomArrayTotal')
const { readFile } = require('./Utils/ReadFile')
const { Conta } = require('./Utils/Conta')

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let CountMortos = 0, CountVivos = 0

let X = [], Ylinha = []

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

var hrstart = process.hrtime()

function TestePool(){
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

        const respRandomArray = RandomArrayTotal(X,Ylinha,PacientesVivos,PacientesMortos)
        X = respRandomArray[0]
        Ylinha = respRandomArray[1]

        let Hpidx = 1
        let qtdHiperplanos = 19
        for(let i = 0; i<X.length; i++){
            let arrH_i = []
            let vivo = 0, morto = 0
            //Hpidx == qtd hiperplanos
            
            for(Hpidx = 1; Hpidx<=qtdHiperplanos;Hpidx++){
                let arr = await readFile('Hiperplanos/poolHP2021_35_33',`Hiperplano${Hpidx}`,X.length)
                let hiperplano = arr[1]
                hiperplano = hiperplano.split(',')

                for(let k=0;k<hiperplano.length-1;k++){
                    hiperplano[k] = parseInt(hiperplano[k])
                }

                // Início Calcula H(i)

                let H_i = Conta(hiperplano,X,i)
                arrH_i.push(H_i)

                // Fim Calcula H(i)

                if(H_i > 0) vivo++
                else morto++
            }

            let contMH_i=0,contVH_i=0
            for (let j=0;j<arrH_i.length;j++){
                if(arrH_i[j]<0) contMH_i++
                else contVH_i++
            }

            Hpidx--
            if((vivo/Hpidx) >= (1/2)){
                if(Ylinha[i] == 1) AcertoV++
                else ErroV++
            }else {
                if(Ylinha[i] == -1) AcertoM++
                else ErroM++
            }
        }
        console.log("Qtd. de hiperplanos = ",qtdHiperplanos)
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