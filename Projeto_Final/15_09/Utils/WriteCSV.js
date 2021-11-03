let fs = require('fs');
const firstline = require('firstline')


async function getFirstLine(){
    var data = await firstline('MiniBanco.csv') //ExData.csv
    var campos = data.split(';') //,

    for(var i=0;i<campos.length;i++){
        campos[i] = campos[i].replace(/"|\r/g, '')
        //console.log([campos[i],i])
    }

    let RemoveItems = [40,54,56]

    let camposadd = [11,13,16,17,19,27,65,66,69,76,79,80,83,85,87,89,90,91,93,95,96,97,98,99,100,101,102,103,104,105,107,109,114,120,124,125,126,127,128,131,133,134,135,136,137,138,139,140,141,142,143,145,148]
    
    let Fields = []

    for(var i=28;i<58;i++){
        if(!RemoveItems.includes(i)) Fields.push(campos[i]);
    }

    for(var i=11;i<149;i++){
        if(camposadd.includes(i)) Fields.push(campos[i])
    }

    return Fields
}

async function WriteCSV(Data,Ymortos,Yvivos) {
    let campos = await getFirstLine()
    ///*
    for(let i=0; i<campos.length ;i++){
        if(i!=campos.length-1){
            await fs.appendFileSync('BancoExpandido2021.csv',`${campos[i]},`,function(err) { //ChosenData.csv
                if(err) throw err;
                else console.log('Salvou!');
            })
        }else {
            await fs.appendFileSync('BancoExpandido2021.csv',`${campos[i]}\n`,function(err) { //ChosenData.csv
                if(err) throw err;
                else console.log('Salvou!');
            })
        }
        
    }
    let countMortos = 0
    let countVivos = 0
    for(let i=0;i<Data.length;i++){
        for(let j=0;j<Data[i].length;j++){   
            await fs.appendFileSync('BancoExpandido2021.csv',`${Data[i][j]},`,function(err){ //ChosenData.csv
                if(err) throw err;
                else console.log('Salvou!');
            })
        }
        if(i<Ymortos){
            await fs.appendFileSync('BancoExpandido2021.csv',"Morto\n",function(err) { //ChosenData.csv
                if(err) throw err;
                else console.log('Salvou!');
            })
        }else{
            await fs.appendFileSync('BancoExpandido2021.csv',"Vivo\n",function(err) { //ChosenData.csv
                if(err) throw err;
                else console.log('Salvou!');
            })
        }
        
    } //*/
}

module.exports = {
    WriteCSV: WriteCSV
}
