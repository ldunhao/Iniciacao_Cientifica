const { RunPerceptron } = require('./RunPerceptron')

function Run(z,n,t,PacientesVivos,PacientesMortos){
    let iteracoes_media = 0
    let Arr_Hiperplanos = []

    for(let i=0;i<z;i++){
        let arr = RunPerceptron(n,t,PacientesVivos,PacientesMortos)
        iteracoes_media += arr[0]

        // console.log(`Rodando o Perceptron pela ${i+1}° vez de ${z} vezes`)
        Arr_Hiperplanos.push(arr[1])
    }
    // console.log(`\n\nMédia de iterações para um n = ${n} e iteração máxima t = ${t}: ${iteracoes_media/z} iterações`)

    return Arr_Hiperplanos
}

module.exports = {
    Run
}