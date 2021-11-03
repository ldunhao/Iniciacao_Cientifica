const readLine = require("readline")
const fs = require('fs')

async function readFile(fileName, blockName) {
    const arr = [];
    let ok = 0
    
    const fileStream = fs.createReadStream(`${fileName}.txt`)
    
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })
    
    for await(const line of rl){
        if(line.includes(blockName)){
            ok = 1
        }
        if (line.includes('-----') && ok) {
            ok = 0
        }
        if(ok){
            arr.push(line)
        }
    }
    
    return arr
}

module.exports = {
    readFile
}