const { Classificador } = require('./Classificador');
const { Gerador } = require('./Gerador')

async function call(){
    await Gerador().then(data => {
        console.log(typeof(data))
        console.log(`final: ${data}`)
    })
}
call()