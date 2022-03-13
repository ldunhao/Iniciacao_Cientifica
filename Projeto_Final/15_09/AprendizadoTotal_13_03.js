const csv = require('csv-parser');
const fs = require('fs')
const readLine = require("readline")

const { Run } = require('./Utils/Run')
const { TesteDeSanidade } = require('./Utils/TesteDeSanidade')
const { RandomArray } = require('./Utils/RandomArray')
const { WriteFileTestePool } = require('./Utils/WriteFileTestePool')
const { readFile } = require('./Utils/ReadFile')

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let PacientesMortos2021 = [], PacientesVivos2021 =[]
let PacientesMortos2020 = [], PacientesVivos2020 =[]
let CountMortos = 0, CountVivos = 0

let Contador = 0
let Xteste = [], YlinhaTeste = []
let numHiperplanoPool = 1

let contObitos = 0
let contRemidos = 0
let Arr_Hiperplanos = []

async function getSintomas(data){
    let linha = Object.values(data).toString().split(',')

    let sintomas = []

    for(let i=0;i<linha.length-1;i++){
        sintomas.push(parseInt(linha[i]))
    }
    
    if(linha[linha.length-1] == "Vivo") {
        if(++Contador <= 440915) {
            PacientesVivos2021.push(sintomas)
        } else {
            PacientesVivos2020.push(sintomas); 
        }
        PacientesVivos.push(sintomas), CountVivos++;
    }
    else {
        if(++Contador <= 440915) {
            PacientesMortos2021.push(sintomas)
        }else {
            PacientesMortos2020.push(sintomas)
        }
        PacientesMortos.push(sintomas), CountMortos++;
    }
}

var hrstart = process.hrtime()

async function Gerador(){
    await fs.createReadStream('BancoTratadoTotal.csv')
    .pipe(csv({}))
    .on('data', (data) => {  //Lógica aplicada a cada linha
        getSintomas(data)
    })
    .on('end', async () => {   //Lógica aplicada quando chega no EOF
        console.log('Quantidade de mortos do banco = %d', CountMortos)
        console.log('Quantidade de vivos do banco = %d', CountVivos)
        console.log('Quantidade de vivos do banco 2021 = %d', PacientesVivos2021.length)
        console.log('Quantidade de vivos do banco 2020 = %d', PacientesVivos2020.length)
        console.log('Quantidade de mortos do banco 2021 = %d', PacientesMortos2021.length)
        console.log('Quantidade de mortos do banco 2020 = %d', PacientesMortos2020.length)
        let ok = 1
        let cont = 0

        while(ok){
            Xteste = [], YlinhaTeste = []

            let p = 0.4
            contObitos = 0
            contRemidos = 0
            Arr_Hiperplanos = Run(1,30,10000,PacientesVivos,PacientesMortos);
    
            let W = Arr_Hiperplanos[Arr_Hiperplanos.length-1]
            // 338460
            let a = 600000
            let blockName = ""
            let arr = []

            const respRandomArray = RandomArray(a,Xteste,YlinhaTeste,PacientesVivos,PacientesMortos)
            Xteste = respRandomArray[0]
            YlinhaTeste = respRandomArray[1]
            
            const respTesteDeSanidade = TesteDeSanidade(W,Xteste,YlinhaTeste)
            contObitos = respTesteDeSanidade[0]
            contRemidos = respTesteDeSanidade[1]

            console.log(`\ncontObitos/a: ${contObitos/a}, contRemidos/a: ${contRemidos/a}`)
            console.log(++cont)

            if(contObitos/a >= 0.33 && contRemidos/a >= 0.31){
                blockName = await WriteFileTestePool("Hiperplanos/poolHPTotal_35_33",numHiperplanoPool,W,Xteste.length,contObitos,contRemidos,date)
                numHiperplanoPool++
            }
            if(blockName != "") {
                arr = await readFile("Hiperplanos/poolHPTotal_35_33",blockName)
            }
            
            if(arr.length != 0){
                let Wfile = arr[1].split(',')
                const tempoHiperplano = arr[arr.length - 1]
        
                for(let i=0;i<Wfile.length;i++) Wfile[i] = Number(Wfile[i])
        
                const respTesteDeSanidade = TesteDeSanidade(Wfile,Xteste,YlinhaTeste)
                contObitos = respTesteDeSanidade[0]
                contRemidos = respTesteDeSanidade[1]
        
                console.log(`W: ${W}`)
                console.log("Contador de mortos: %d", contObitos)
                console.log("Contador de remidos: %d", contRemidos)
                console.log("Soma: %d", contObitos+contRemidos)
                console.log("A: %d", a)
                console.log(`Tempo até achar o hiperplano: ${tempoHiperplano}`)
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

const date = Date.now()
Gerador()

module.exports = {
    Gerador: Gerador
}