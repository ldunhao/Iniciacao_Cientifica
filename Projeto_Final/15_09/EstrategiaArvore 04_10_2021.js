const csv = require('csv-parser');
const fs = require('fs')
const readLine = require("readline")

const { writeFile } = require('./Utils/WriteFile')
const { readFile } = require('./Utils/ReadFile')

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



function conta(hiperplano,X,i){
    let H_i = 0
    for(let j=X[i].length; j>=0; j--){
        if(j==0) H_i += hiperplano[j]*(-1)
        else H_i += hiperplano[j]*X[i][j-1]
    }
    return H_i
}

function criar(tree, data){
  tree = new No
  tree.data = data
  return tree
}

async function getSintomas(data){
    // let campos = Object.keys(data).toString().split(',')
    let linha = Object.values(data).toString().split(',')

    let sintomas = []

    for(let i=0;i<linha.length-1;i++){
        sintomas.push(parseInt(linha[i]))
    }

    if(linha[linha.length-1] == "Vivo")BD.push(sintomas), CountVivos++, Saida.push(1);
    else BD.push(sintomas), CountMortos++, Saida.push(-1);
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
    let countEq = 0

    var ok = true;

    while (l == 0){
        countEq = 0
        tentativas++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += X[i][j] * W[j];
            Yteste[i] = soma
            Y[i] = sinal(soma)
        }

        for(i=0;i<n;i++){
          if(Y[i] == Ylinha[i]) countEq++
        }
        if(countEq >= 0.75*n){
          break
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

function RandomArrayP(n,X,Ylinha,BD,Resposta){  // Escolhendo aleatóriamente os pacientes
  let countVivosRandom = []
  let countMortosRandom = []
  for(let i=0;i<Resposta.length;i++){
    if(Resposta[i] == 1){
      countVivosRandom.push(i)
    }
    else {
      countMortosRandom.push(i)
    }
  }
  for(let i=0;i<n;i++){
    if(i<n/2){
      let a = Math.floor(Math.random()*countVivosRandom.length)
      X.push(BD[countVivosRandom[a]])
      Ylinha.push(1)
    }
    else{
      let a = Math.floor(Math.random()*countMortosRandom.length)
      X.push(BD[countMortosRandom[a]])
      Ylinha.push(-1)
    }
  }
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

function RunPerceptron(n,t,BD,Resposta){
    X = [], Ylinha = []
    // console.clear()

    RandomArrayP(n,X,Ylinha,BD,Resposta)
    //console.log(Ylinha)

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<X[0].length;i++){
        W.push(Math.random()+0.1)
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

        RandomArrayP(n,X,Ylinha,BD,Resposta)

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

function Run(z,n,t,BD,Resposta){
    // console.log('Quantidade de mortos do banco = %d', CountMortos)
    // console.log('Quantidade de vivos do banco = %d', CountVivos)

    let iteracoes_media = 0
    for(let i=0;i<z;i++){
        let arr = RunPerceptron(n,t,BD,Resposta)
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
        let aux = conta(W,X,i)
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



function gerarHP(BD,Resposta){
  let ok = 1
  let condicao = 0
  let countV = 0
  let countM = 0
  for(i=0;i<Resposta.length;i++){
    if(Resposta[i] == 1){
      countV++
    }
    else{
      countM++
    }
  }
  console.log('countV: ', countV)
  console.log('countM: ', countM)
  //console.log('Saida: ', Saida.length)
  if(countM < 15000 || countV < 15000){
    condicao = 1
  }
  while(ok){
    Xteste = [], YlinhaTeste = []

    contObitos = 0
    contRemidos = 0
    Run(1,1500,500000,BD,Resposta);
    // let W = Math.floor(Math.random() * Arr_Hiperplanos.length)
    // console.log("Cont total = %d\n", contTotal)
    let W = Arr_Hiperplanos[Arr_Hiperplanos.length-1]

    let a = BD.length
    let blockName = ""
    let arr = []
    //console.log(`pacientes vivos: ${PacientesVivos.length}, pacientes mortos: ${PacientesMortos.length}, X: ${X.length}`)
    TesteDeSanidade(W,BD,Resposta)
    /*console.log('CountO ',  contObitos)
    console.log('Obito: ',  contObitos/countM)
    console.log('Remido: ', contRemidos/countV)
    console.log('CountV: ', contRemidos)*/
    if(contObitos/countM >= 0.6 && contRemidos/countV >= 0.6){
        //return [W,(contObitos+contRemidos)/a]
        return [W,(contObitos+contRemidos)/a,condicao]
    }
  }
}

function GeraArvore(BancoDados,Resposta){
  let Arvore = new No
  let Arr = []
  let condicao = 0
  Arr = gerarHP(BancoDados,Resposta)
  let W = Arr[0]
  let t = Arr[1]
  condicao = Arr[2]
  Arvore.data = Arr[0]
  //console.log('t: ',t)
  //console.log('W: ', W)
  if(t < 0.95 && condicao == 0){//&& BancoDados.length > 1000
    let BDd = []
    let BDe = []
    let YlinhaD = []
    let YlinhaE = []
    for(let i=0;i<BancoDados.length;i++){
      if (conta(W,BancoDados,i) > 0) {
        BDd.push(BancoDados[i])
        YlinhaD.push(Resposta[i])
      }
      else{
        BDe.push(BancoDados[i])
        YlinhaE.push(Resposta[i])
      }
    }
    Arvore.right = GeraArvore(BDd,YlinhaD)
    Arvore.left = GeraArvore(BDe,YlinhaE)
    Arvore.data = W
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

function TreeTest(Tree, x, i){
  if(Tree.right == null && Tree.left == null){
    if(conta(Tree.data,x,i) > 0){
      return(1)
    }
    else{
      return(-1)
    }
  }
  else{
    if(conta(Tree.data,x,i) > 0){
      return(TreeTest(Tree.right,x,i))
    }
    else{
      return(TreeTest(Tree.left,x,i))
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
      console.log('Quantidade de mortos do banco = %d', CountMortos)
      console.log('Quantidade de vivos do banco = %d', CountVivos)
      //console.log(BD[1])
      //console.log(Saida[500])
      ArvoreHP = GeraArvore(BD,Saida)  //Lógica aplicada quando chega no EOF
      for(i=0;i<BD.length;i++){
        if(TreeTest(ArvoreHP,BD,i) == 1){
          if(Saida[i] == 1){
            acertosV++
          }
          else{
            errosV++
          }
        }
        else{
          if(Saida[i] == -1){
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
