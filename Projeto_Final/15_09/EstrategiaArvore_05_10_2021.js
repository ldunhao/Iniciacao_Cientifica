const csv = require('csv-parser');
const fs = require('fs')

// Variáveis Globais
class No{
  construir(data,left=null,right=null){
    this.data = data
    this.left = esquerda
    this.right = direita
  }
}


let ArvoreHP = new No
let BD = [], Saida = []
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



function conta(hiperplano,BD,i){
    let H_i = 0
    for(let j=BD[i].length; j>=0; j--){
        if(j==0) H_i += hiperplano[j]*(-1)
        else H_i += hiperplano[j]*BD[i][j-1]
    }
    return H_i
}

async function getSintomas(data){
    // let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    let sintomas = []

    for(let i=0;i<linha.length-1;i++){
        sintomas.push(parseInt(linha[i]))
    }

    if(linha[linha.length-1] == "Vivo")BD.push(sintomas), CountVivos++, Ylinha.push(1);
    else BD.push(sintomas), CountMortos++, Ylinha.push(-1);
}

function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

function Perceptron(PacientesEscolhidos,n,W,YlinhaEscolhidos,b,t){
    var d = PacientesEscolhidos[0].length
    B = b
    for(var i=0;i<n;i++) PacientesEscolhidos[i] = [-b].concat(PacientesEscolhidos[i]);

    W = [1].concat(W)

    var l = 0
    var Y = new Array(n).fill(0)
    var Yteste = new Array(n).fill(0)
    var tentativas = 0
    let countEq = 0

    var ok = true;

    while (l == 0){
        countEq = 0
        tentativas++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += PacientesEscolhidos[i][j] * W[j];
            Yteste[i] = soma
            Y[i] = sinal(soma)
        }

        var i=0
        l=1

        while (true){
            if (Y[i] != YlinhaEscolhidos[i]){
                for(var j=0;j<=d;j++){
                    W[j] += YlinhaEscolhidos[i] * PacientesEscolhidos[i][j]
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


function RandomArrayP(n,BD,YlinhaBD){  // Escolhendo aleatóriamente os pacientes //n: número de pacientes usados para gerar o hiperplano.
  //X: É um vetor com n pacientes utilizados para gerar o hiperplano
  //Ylinha: É o vetor Evolução com n pacientes utilizados para gerar o hiperplano
  //BD: Banco de dados que se quer separar
  //Resposta: Evolução dos pacientes do BD
  let indiceVivo = []
  let indiceMorto = []
  let PacientesEscolhidos = []
  let YlinhaEscolhidos = []
  for(let i=0;i<YlinhaBD.length;i++){
    if(YlinhaBD[i] == 1){ //YlinhaBD[1], YlinhaBD[5], YlinhaBD[7]
      indiceVivo.push(i) //indiceVivo[0] = 1, indiceVivo[1] = 5, indiceVivo[2] = 7
    }
    else {
      indiceMorto.push(i)
    }
  }

  for(let i=0;i<n;i++){
    if(i<n/2){
      let indiceRandomVivo = Math.floor(Math.random()*indiceVivo.length)
      PacientesEscolhidos.push(BD[indiceVivo[indiceRandomVivo]])
      YlinhaEscolhidos.push(1)
      indiceVivo.splice(indiceRandomVivo,1)
    }
    else{
      let indiceRandomMorto = Math.floor(Math.random()*indiceMorto.length)
      PacientesEscolhidos.push(BD[indiceMorto[indiceRandomMorto]])
      YlinhaEscolhidos.push(-1)
      indiceMorto.splice(indiceRandomMorto,1)
    }
  }
  return([PacientesEscolhidos, YlinhaEscolhidos])
    /*while(countPacientes < Math.min(Math.floor(n/2),PacientesVivos.length)){
        let idx = Math.floor(Math.random() * PacientesVivos.length)
        if(!PacientesVivosEscolhidos.includes(idx)){
            PacientesVivosEscolhidos.push(idx)
            X.push(PacientesVivos[idx])
            Ylinha.push(1)
            countPacientes++
        }
    }

    countPacientes = 0
    while(countPacientes < Math.floor(n/2)){
        idx = Math.floor(Math.random() * PacientesMortos.length)
        if(!PacientesMortosEscolhidos.includes(idx)){
            PacientesMortosEscolhidos.push(idx)
            X.push(PacientesMortos[idx])
            Ylinha.push(-1)
            countPacientes++
        }
    }*/
}

function RunPerceptron(n,t,BD,YlinhaBD){
    let arrE = []
    let PacientesEscolhidos = []
    let YlinhaEscolhidos = []
    // console.clear()

    arrE = RandomArrayP(n,BD,YlinhaBD)
    PacientesEscolhidos = arrE[0]
    YlinhaEscolhidos = arrE[1]
    //console.log(PacientesEscolhidos[0].length)
    //console.log(YlinhaEscolhidos)

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<PacientesEscolhidos[0].length;i++){
        W.push(Math.random()+0.1)
    }

    let N = PacientesEscolhidos.length
    let ok, iteracoes

    let arr = Perceptron(PacientesEscolhidos,N,W,YlinhaEscolhidos,b,t)

    ok = arr[0]
    W = arr[1]
    iteracoes = arr[2]
    Yteste = arr[3]

    while(!ok){
        PacientesEscolhidos = [], YlinhaEscolhidos = []
        W = []

        arrE = RandomArrayP(n,BD,YlinhaBD)
        PacientesEscolhidos = arrE[0]
        YlinhaEscolhidos = arrE[1]

        for(let i=0;i<PacientesEscolhidos[0].length;i++){
            W.push(1)
        }

        arr = Perceptron(PacientesEscolhidos,N,W,YlinhaEscolhidos,b,t)

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

function Run(z,n,t,BD,YlinhaBD){
    // console.log('Quantidade de mortos do banco = %d', CountMortos)
    // console.log('Quantidade de vivos do banco = %d', CountVivos)

    let iteracoes_media = 0
    for(let i=0;i<z;i++){
        let arr = RunPerceptron(n,t,BD,YlinhaBD)
        iteracoes_media += arr[0]

        // console.log(`Rodando o Perceptron pela ${i+1}° vez de ${z} vezes`)
        Arr_Hiperplanos.push(arr[1])
    }
    // console.log(`\n\nMédia de iterações para um n = ${n} e iteração máxima t = ${t}: ${iteracoes_media/z} iterações`)
}

function TesteDeSanidade(W,BD,YlinhaBD) {
    let auxArr = []

    contObitos=0
    contRemidos=0

    for(let i=0;i<BD.length;i++){
        let aux = conta(W,BD,i)
        auxArr.push(aux)
    }


    for(let i=0; i<auxArr.length;i++){
        if(YlinhaBD[i] == -1 && sinal(auxArr[i]) == -1){
            contObitos++
        }
        if(YlinhaBD[i] == 1 && sinal(auxArr[i]) == 1){
            contRemidos++
        }
    }
}

var hrstart = process.hrtime()



function gerarHP(BD,YlinhaBD){ //Mudar Resposta para YlinhaBD
  let ok = 1
  //console.log('Saida: ', Saida.length)
  /*if(countM < 20 || countV < 20){
    condicao = 1
  }*/
  while(ok){
    Xteste = [], YlinhaTeste = []
    contObitos = 0
    contRemidos = 0
    let countV = 0
    let countM = 0

    for(i=0;i<YlinhaBD.length;i++){
      if(YlinhaBD[i] == 1){
        countV++
      }
      else{
        countM++
      }
    }//5 vivos, 50 mortos
    Run(1,Math.min(30,countV*2,countM*2),10000,BD,YlinhaBD);

    // let W = Math.floor(Math.random() * Arr_Hiperplanos.length)
    // console.log("Cont total = %d\n", contTotal)
    let W = Arr_Hiperplanos[Arr_Hiperplanos.length-1]

    let a = BD.length
    //let blockName = ""
    let arr = []
    //console.log(`pacientes vivos: ${PacientesVivos.length}, pacientes mortos: ${PacientesMortos.length}, X: ${X.length}`)
    TesteDeSanidade(W,BD,YlinhaBD)
    //console.log('CountO ',  contObitos)
    //console.log('Obito: ',  contObitos/countM)
    //console.log('Remido: ', contRemidos/countV)
    //console.log('CountV: ', contRemidos)
    if(contObitos/countM >= 0.6 && contRemidos/countV >= 0.6){
        //return [W,(contObitos+contRemidos)/a]
        /*console.log('Tamanho do BD: ', BD.length)
        console.log('quantidade de vivo: ', countV)
        console.log('quantidade de morto: ', countM)
        console.log()
        console.log('Acerto Vivo: ', contRemidos)
        console.log('Erro Vivo: ', (countV-contRemidos))
        console.log('Acerto Morto: ', contObitos)
        console.log('Erro Morto; ', (countM-contObitos))
        console.log()
        console.log('Acerto(%) de vivo: ', contRemidos/countV)
        console.log('Acerto(%) de morto: ', contObitos/countM)
        const name = prompt('What is your name?');
        console.log(`Hey there ${name}`);*/
        return [W,(contObitos+contRemidos)/a]
    }
  }
}

function GeraArvore(BD,YlinhaBD){ //BD[1] YlinhaBD[1]
  let Arvore = new No
  let Arr = []
  let countV = 0
  let countM = 0
  for(i=0;i<YlinhaBD.length;i++){
    if(YlinhaBD[i] == 1){
      countV++
    }
    else{
      countM++
    }
  }
  if(countV == 0){
    //console.log('dentro do if countV: ', countV)
    Arvore.data = -1
    Arvore.right = null
    Arvore.left = null
    return(Arvore)
  }
  if(countM == 0){
    //console.log('dentro do if countM: ', countM)
    Arvore.data = 1
    Arvore.right = null
    Arvore.left = null
    return(Arvore)
  }
  //console.log('countV: ', countV)
  //console.log('countM: ', countM)
  Arr = gerarHP(BD,YlinhaBD)
  let W = Arr[0]
  let t = Arr[1]
  Arvore.data = W
  //console.log('t: ',t)
  //console.log('W: ', W)
  if(t < 0.95){//&& BancoDados.length > 1000
    let BDd = []
    let BDe = []
    let YlinhaD = []
    let YlinhaE = []
    for(let i=0;i<BD.length;i++){
      if (conta(W,BD,i) > 0) {
        BDd.push(BD[i])
        YlinhaD.push(YlinhaBD[i])
      }
      else{
        BDe.push(BD[i])
        YlinhaE.push(YlinhaBD[i])
      }
    }
    Arvore.right = GeraArvore(BDd,YlinhaD)
    Arvore.left = GeraArvore(BDe,YlinhaE)
    //Arvore.data = W
    return Arvore
  }
  else{
    Arvore.right = null
    Arvore.left = null
    //console.log('ok')
    return Arvore
  }
}


function preOrder(tree) {
  console.log(tree.data)
  if(tree.left != null) preOrder(tree.left)
  if(tree.right != null) preOrder(tree.right)
}

function TreeTest(Tree, BD, i){
  if(Tree.right == null && Tree.left == null){
    if(Tree.data == 1 || Tree.data == -1){
      return(Tree.data)
    }
    else{
      return(conta(Tree.data,BD,i) > 0) ? 1 : -1
    }
  }
  else{
    if(conta(Tree.data,BD,i) > 0){
      return(TreeTest(Tree.right,BD,i))
    }
    else{
      return(TreeTest(Tree.left,BD,i))
    }
  }
}

async function GeradorBD(){
    BD = []
    Ylinha = []
    await fs.createReadStream('BancoTratado2021_16_08_21.csv')
    .pipe(csv({}))
    .on('data', (data) => {  //Lógica aplicada a cada linha
        getSintomas(data)
    })
    .on('end', async () => {
      let acertosV = 0
      let acertosM = 0
      let errosV = 0
      let errosM = 0
      //console.log('Quantidade de mortos do banco = %d', CountMortos)
      //console.log('Quantidade de vivos do banco = %d', CountVivos)
      //console.log(BD[1])
      //console.log(Saida[500])
      ArvoreHP = GeraArvore(BD,Ylinha)  //Lógica aplicada quando chega no EOF
      for(i=0;i<BD.length;i++){
        if(TreeTest(ArvoreHP,BD,i) == 1){
          if(Ylinha[i] == 1){
            acertosV++
          }
          else{
            errosV++
          }
        }
        else{
          if(Ylinha[i] == -1){
            acertosM++
          }
          else{
            errosM++
          }
        }
      }
      console.log(`AcertosV: ${Math.floor(acertosV*100/(acertosV+errosV))}%`)
      console.log(`AcertosM: ${Math.floor(acertosM*100/(acertosM+errosM))}%`)

      //preOrder(ArvoreHP)
    })

    // return WFinal;
}


GeradorBD()
