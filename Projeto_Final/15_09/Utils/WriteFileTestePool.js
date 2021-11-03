const fs = require('fs');

async function WriteFileTestePool(fileTitle, numHiperplanoPool, W, n, contObitos, contRemidos) {
    let blockName = `Hiperplano${numHiperplanoPool.toString()}`

    await fs.appendFileSync(`${fileTitle}.txt`, `${blockName}\n`, async function(err) {
        if(err) throw err;
        else console.log('Erro');
    })

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
    WriteFileTestePool
}
