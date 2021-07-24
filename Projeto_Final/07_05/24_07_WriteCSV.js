let fs = require('fs');
const firstline = require('firstline')


async function getFirstLine(){
    var data = await firstline('ExData.csv')
    var campos = data.split(',')

    for(var i=0;i<campos.length;i++){
        campos[i] = campos[i].replace(/"|\r/g, '')
    }
    let RemoveItems = [39,40,42,54,55,56]

    let camposadd = [65,69,76,79,80,89,90,95,96,97,98,99,100,101,102,103,104,105,120,124,125,131,134,135,136,137,138,139,140,141,142,143,145]
    
    let Fields = []

    for(var i=28;i<58;i++){
        if(!RemoveItems.includes(i)) Fields.push(campos[i]);
    }

    for(var i=58;i<146;i++){
        if(camposadd.includes(i)) Fields.push(campos[i])
    }

    return Fields
}

async function WriteCSV(Data,Ymortos,Yvivos) {
    let campos = await getFirstLine()
    for(let i=0; i<campos.length ;i++){
        if(i!=campos.length-1){
            await fs.appendFileSync('teste.csv',`${campos[i]},`,function(err) {
                if(err) throw err;
                else console.log('Salvou!');
            })
        }else {
            await fs.appendFileSync('teste.csv',`${campos[i]}\n`,function(err) {
                if(err) throw err;
                else console.log('Salvou!');
            })
        }
        
    }
    let countMortos = 0
    let countVivos = 0
    for(let i=0;i<Data.length;i++){
        for(let j=0;j<Data[i].length;j++){   
            await fs.appendFileSync('teste.csv',`${Data[i][j]},`,function(err){
                if(err) throw err;
                else console.log('Salvou!');
            })
        }
        if(i<Ymortos){
            await fs.appendFileSync('teste.csv',"Morto\n",function(err) {
                if(err) throw err;
                else console.log('Salvou!');
            })
        }else{
            await fs.appendFileSync('teste.csv',"Vivo\n",function(err) {
                if(err) throw err;
                else console.log('Salvou!');
            })
        }
    }
}

module.exports = {
    WriteCSV: WriteCSV
}
