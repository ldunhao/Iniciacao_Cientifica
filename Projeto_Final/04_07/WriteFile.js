const parser = require('csv-parser');
const fs = require('fs');

async function writeFile(fileTitle, pacientes, W, n) {
    let date = new Date()
    let blockName = `${date.getDate()}/${date.getMonth()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}_${n}`

    await fs.appendFileSync(`${fileTitle}.txt`, `${blockName}\n`, async function(err) {
        if(err) throw err;
        else console.log('Acho que foi hein brow!');
    })
    
    for(let i=0;i<pacientes.length;i++){
        await fs.appendFileSync(`${fileTitle}.txt`, `${pacientes[i]}\n`, async function(err) {
            if(err) throw err;
            else console.log('Acho que foi hein brow!');
        })
    }
    
    await fs.appendFileSync(`${fileTitle}.txt`, `${W}\n`, async function(err) {
        if(err) throw err;
        else console.log('Acho que foi hein brow!');
    })
    await fs.appendFileSync(`${fileTitle}.txt`, `${n}\n-----\n\n\n`, async function(err) {
        if(err) throw err;
        else console.log('Acho que foi hein brow!');
    })
}

module.exports = {
    writeFile
}
