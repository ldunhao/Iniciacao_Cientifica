const parser = require('csv-parser');
const fs = require('fs');

async function writeFile(fileTitle, pacientes, W, n, contObitos, contRemidos) {
    let date = new Date()
    let blockName = `${date.getDate()}/${date.getMonth()+1}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}_${n}`

    await fs.appendFileSync(`${fileTitle}.txt`, `${blockName}\n`, async function(err) {
        if(err) throw err;
        else console.log('Erro');
    })
    
    for(let i=0;i<pacientes.length;i++){
        await fs.appendFileSync(`${fileTitle}.txt`, `${pacientes[i]}\n`, async function(err) {
            if(err) throw err;
            else console.log('Erro');
        })
    }

    await fs.appendFileSync(`${fileTitle}.txt`, `${W}\n`, async function(err) {
        if(err) throw err;
        else console.log('Erro');
    })
    
    await fs.appendFileSync(`${fileTitle}.txt`, `${contObitos}\n`, async function(err) {
        if(err) throw err;
        else console.log('Erro');
    })
    await fs.appendFileSync(`${fileTitle}.txt`, `${contRemidos}\n`, async function(err) {
        if(err) throw err;
        else console.log('Erro');
    })
    await fs.appendFileSync(`${fileTitle}.txt`, `${n}\n-----\n\n\n`, async function(err) {
        if(err) throw err;
        else console.log('Erro');
    })

    return blockName
}

module.exports = {
    writeFile
}
