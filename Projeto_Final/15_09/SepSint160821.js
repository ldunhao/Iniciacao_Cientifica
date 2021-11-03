function checarData(data) {
    return data instanceof Date && !isNaN(data);
}
function GetDiffDaysInBinary(d1,d2){

    if (d1!='' && d2!=''){
        d1 = d1.replace(/"|\r/g, '')
        d2 = d2.replace(/"|\r/g, '')
        var getFormatd1 = d1.split('/')
        var getFormatd2 = d2.split('/')

        
        var date1 = new Date(getFormatd1[2], getFormatd1[1]-1, getFormatd1[0])
        var date2 = new Date(getFormatd2[2], getFormatd2[1]-1, getFormatd2[0])
        
        if(checarData(date1) && checarData(date2)){
            var millisecondsToDays = 1000 * 3600 * 24
  
            var diffMiliseconds = date2.getTime() - date1.getTime()
            var diffDays = diffMiliseconds/millisecondsToDays
        
            if(diffDays >= 128) return "1111111"
            else {
                var diffDays = diffDays.toString(2)
  
                while (diffDays.length < 7) {
                    diffDays = '0' + diffDays
                }
  
            return diffDays
            }
        }else return "0000000"
    } else return "0000000"
  }

const csv = require('csv-parser');
const fs = require('fs')
const { WriteCSV } = require('./WriteCSV');

// Variáveis Globais
let PacientesMortos = [], PacientesVivos = []
let CountMortos = 0, CountVivos = 0

let CamposNomes = []
let PacientesTotal = [], PacientesTotalY = []
let QntdSintomasPreenchidos = Array(56).fill(0)

async function getSintomas(data){
    let campos = Object.keys(data).toString().split(';')
    let linha = Object.values(data).toString().split(';')
    
    // Separação dos campos que aplicaremos no Perceptron
    for(var i=0;i<campos.length;i++){
        campos[i] = campos[i].replace(/"|\r/g, '')
    }
    
    let RemoveItems = [40,54,55,56] //
    
    let vetorcampos = []
    
    let camposadd = [10,11,13,16,17,19,22,26,27,65,66,69,70,76,77,78,79,80,83,85,87,89,90,109,111,114,116,124,125,126,127,128,131,133,148,151,152,153]
    
    //Sintomas que o paciente vai 
    
    for(var i=28;i<58;i++){
        if(!RemoveItems.includes(i)) {
            vetorcampos.push(i);
        }
    }

    for(var i=10;i<154;i++){
        if(camposadd.includes(i)) {
            vetorcampos.push(i)
        }
    }
    //------------------------------------------------------------

    

    let CountCamposPreenchidos = 0
    for(let i=0;i<vetorcampos.length;i++){
        if(linha[vetorcampos[i]] != '') CountCamposPreenchidos++ 
    }
    
    QntdSintomasPreenchidos[CountCamposPreenchidos]++

    let sintomas = []
    
    if(CountCamposPreenchidos >= 25 && linha[87] =='1'){

        if(linha[110] == '1'){ //Se o paciente estiver vivo
            //sintomas.push("A")
            //111-70 (DT_EVOLUCA-DT_INTERNA)
            let a = GetDiffDaysInBinary(linha[70],linha[111])
            sintomas.push(Array.from(a).map(idx => parseInt(idx)))
            //sintomas.push("B")
            //78-77 (DT_SAIDUTI-DT_ENTUTI)
            let b = GetDiffDaysInBinary(linha[77],linha[78])
            sintomas.push(Array.from(b).map(idx => parseInt(idx)))
            
            for(var i=0;i<vetorcampos.length;i++){
                if (vetorcampos[i] == 13){ //NU_IDADE_N
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(parseInt(linha[vetorcampos[i]]) < 10) sintomas.push(0,0,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 20) sintomas.push(0,0,1,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 30) sintomas.push(0,0,1,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 40) sintomas.push(0,1,0,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 50) sintomas.push(0,1,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 60) sintomas.push(0,1,1,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 70) sintomas.push(0,1,1,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 80) sintomas.push(1,0,0,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 90) sintomas.push(1,0,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 100) sintomas.push(1,0,1,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 110) sintomas.push(1,0,1,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 120) sintomas.push(1,1,0,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 130) sintomas.push(1,1,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 140) sintomas.push(1,1,1,0)
                    else sintomas.push(1,1,1,1)//140 a 150 anos
                }else if(vetorcampos[i] == 10){ //CO_UNI_NOT
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] != ''){
                        var tmp = parseInt(linha[vetorcampos[i]])

                        tmp = tmp.toString(2)

                        while (tmp.length < 24) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }else{
                        tmp =''
                        while (tmp.length < 24) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }

                }else if(vetorcampos[i] == 26){ //CO_MUN_RES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] != ''){
                        var tmp = parseInt(linha[vetorcampos[i]])

                        tmp = tmp.toString(2)

                        while (tmp.length < 20) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }else{
                        tmp =''
                        while (tmp.length < 20) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }

                }else if(vetorcampos[i] == 16){ //CS_GESTANT
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='6') sintomas.push(0,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 17){ //CS_RACA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(1,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 19){ //CS_ESCOL_N
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '0') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='1') sintomas.push(1,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 22){ //SG_UF
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == 'RO') sintomas.push(0,0,0,0,1)
                    else if(linha[vetorcampos[i]] == 'AC') sintomas.push(0,0,0,1,0)
                    else if(linha[vetorcampos[i]] == 'AM') sintomas.push(0,0,0,1,1)
                    else if(linha[vetorcampos[i]] == 'RR') sintomas.push(0,0,1,0,0)
                    else if(linha[vetorcampos[i]] == 'PA') sintomas.push(0,0,1,0,1)
                    else if(linha[vetorcampos[i]] == 'AP') sintomas.push(0,0,1,1,0)
                    else if(linha[vetorcampos[i]] == 'TO') sintomas.push(0,0,1,1,1)
                    else if(linha[vetorcampos[i]] == 'MA') sintomas.push(0,1,0,0,0)
                    else if(linha[vetorcampos[i]] == 'PI') sintomas.push(0,1,0,0,1)
                    else if(linha[vetorcampos[i]] == 'CE') sintomas.push(0,1,0,1,0)
                    else if(linha[vetorcampos[i]] == 'RN') sintomas.push(0,1,0,1,1)
                    else if(linha[vetorcampos[i]] == 'PB') sintomas.push(0,1,1,0,0)
                    else if(linha[vetorcampos[i]] == 'PE') sintomas.push(0,1,1,0,1)
                    else if(linha[vetorcampos[i]] == 'AL') sintomas.push(0,1,1,1,0)
                    else if(linha[vetorcampos[i]] == 'SE') sintomas.push(0,1,1,1,1)
                    else if(linha[vetorcampos[i]] == 'BA') sintomas.push(1,0,0,0,0)
                    else if(linha[vetorcampos[i]] == 'MG') sintomas.push(1,0,0,0,1)
                    else if(linha[vetorcampos[i]] == 'ES') sintomas.push(1,0,0,1,0)
                    else if(linha[vetorcampos[i]] == 'RJ') sintomas.push(1,0,0,1,1)
                    else if(linha[vetorcampos[i]] == 'SP') sintomas.push(1,0,1,0,0)
                    else if(linha[vetorcampos[i]] == 'PR') sintomas.push(1,0,1,0,1)
                    else if(linha[vetorcampos[i]] == 'SC') sintomas.push(1,0,1,1,0)
                    else if(linha[vetorcampos[i]] == 'RS') sintomas.push(1,0,1,1,1)
                    else if(linha[vetorcampos[i]] == 'MS') sintomas.push(1,1,0,0,0)
                    else if(linha[vetorcampos[i]] == 'MT') sintomas.push(1,1,0,0,1)
                    else if(linha[vetorcampos[i]] == 'GO') sintomas.push(1,1,0,1,0)
                    else if(linha[vetorcampos[i]] == 'DF') sintomas.push(1,1,0,1,1)
                    else sintomas.push(0,0,0,0,0)
                }else if(vetorcampos[i] == 85){ //TP_AMOSTRA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if (linha[vetorcampos[i]] == '1') sintomas.push(1,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,1,0)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 116){ //CO_PS_VGM
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '004') sintomas.push(0,0,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='248') sintomas.push(0,0,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='008') sintomas.push(0,0,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='012') sintomas.push(0,0,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='016') sintomas.push(0,0,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='020') sintomas.push(0,0,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='024') sintomas.push(0,0,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='660') sintomas.push(0,0,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='010') sintomas.push(0,0,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='028') sintomas.push(0,0,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='032') sintomas.push(0,0,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='051') sintomas.push(0,0,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='533') sintomas.push(0,0,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='036') sintomas.push(0,0,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='040') sintomas.push(0,0,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='031') sintomas.push(0,0,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='044') sintomas.push(0,0,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='048') sintomas.push(0,0,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='050') sintomas.push(0,0,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='052') sintomas.push(0,0,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='112') sintomas.push(0,0,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='056') sintomas.push(0,0,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='084') sintomas.push(0,0,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='204') sintomas.push(0,0,0,1,1,1,1,1)//
                    else if(linha[vetorcampos[i]] =='060') sintomas.push(0,0,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='064') sintomas.push(0,0,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='068') sintomas.push(0,0,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='535') sintomas.push(0,0,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='070') sintomas.push(0,0,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='072') sintomas.push(0,0,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='074') sintomas.push(0,0,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='076') sintomas.push(0,0,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='086') sintomas.push(0,0,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='092') sintomas.push(0,0,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='096') sintomas.push(0,0,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='100') sintomas.push(0,0,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='854') sintomas.push(0,0,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='108') sintomas.push(0,0,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='132') sintomas.push(0,0,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='116') sintomas.push(0,0,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='120') sintomas.push(0,0,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='124') sintomas.push(0,0,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='136') sintomas.push(0,0,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='140') sintomas.push(0,0,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='148') sintomas.push(0,0,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='152') sintomas.push(0,0,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='156') sintomas.push(0,0,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='344') sintomas.push(0,0,1,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='446') sintomas.push(0,0,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='162') sintomas.push(0,0,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='166') sintomas.push(0,0,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='170') sintomas.push(0,0,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='174') sintomas.push(0,0,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='178') sintomas.push(0,0,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='184') sintomas.push(0,0,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='188') sintomas.push(0,0,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='384') sintomas.push(0,1,0,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='191') sintomas.push(0,1,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='192') sintomas.push(0,1,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='531') sintomas.push(0,1,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='196') sintomas.push(0,1,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='203') sintomas.push(0,1,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='408') sintomas.push(0,1,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='180') sintomas.push(0,1,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='208') sintomas.push(0,1,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='262') sintomas.push(0,1,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='212') sintomas.push(0,1,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='214') sintomas.push(0,1,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='218') sintomas.push(0,1,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='818') sintomas.push(0,1,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='222') sintomas.push(0,1,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='226') sintomas.push(0,1,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='232') sintomas.push(0,1,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='233') sintomas.push(0,1,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='748') sintomas.push(0,1,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='231') sintomas.push(0,1,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='238') sintomas.push(0,1,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='234') sintomas.push(0,1,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='242') sintomas.push(0,1,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='246') sintomas.push(0,1,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='250') sintomas.push(0,1,0,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='254') sintomas.push(0,1,0,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='258') sintomas.push(0,1,0,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='260') sintomas.push(0,1,0,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='266') sintomas.push(0,1,0,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='270') sintomas.push(0,1,0,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='268') sintomas.push(0,1,0,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='276') sintomas.push(0,1,0,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='288') sintomas.push(0,1,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='292') sintomas.push(0,1,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='300') sintomas.push(0,1,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='304') sintomas.push(0,1,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='308') sintomas.push(0,1,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='312') sintomas.push(0,1,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='316') sintomas.push(0,1,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='320') sintomas.push(0,1,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='831') sintomas.push(0,1,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='324') sintomas.push(0,1,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='624') sintomas.push(0,1,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='328') sintomas.push(0,1,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='332') sintomas.push(0,1,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='334') sintomas.push(0,1,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='336') sintomas.push(0,1,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='340') sintomas.push(0,1,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='348') sintomas.push(0,1,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='352') sintomas.push(0,1,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='356') sintomas.push(0,1,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='360') sintomas.push(0,1,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='364') sintomas.push(0,1,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='368') sintomas.push(0,1,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='372') sintomas.push(0,1,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='833') sintomas.push(0,1,1,1,0,1,1.1)
                    else if(linha[vetorcampos[i]] =='376') sintomas.push(0,1,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='380') sintomas.push(0,1,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='388') sintomas.push(0,1,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='392') sintomas.push(0,1,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='832') sintomas.push(0,1,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='400') sintomas.push(0,1,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='398') sintomas.push(0,1,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='404') sintomas.push(0,1,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='296') sintomas.push(1,0,0,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='414') sintomas.push(1,0,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='417') sintomas.push(1,0,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='418') sintomas.push(1,0,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='428') sintomas.push(1,0,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='422') sintomas.push(1,0,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='426') sintomas.push(1,0,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='430') sintomas.push(1,0,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='434') sintomas.push(1,0,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='438') sintomas.push(1,0,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='440') sintomas.push(1,0,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='442') sintomas.push(1,0,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='450') sintomas.push(1,0,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='454') sintomas.push(1,0,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='458') sintomas.push(1,0,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='462') sintomas.push(1,0,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='466') sintomas.push(1,0,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='470') sintomas.push(1,0,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='584') sintomas.push(1,0,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='474') sintomas.push(1,0,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='478') sintomas.push(1,0,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='480') sintomas.push(1,0,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='175') sintomas.push(1,0,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='484') sintomas.push(1,0,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='583') sintomas.push(1,0,0,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='492') sintomas.push(1,0,0,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='496') sintomas.push(1,0,0,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='499') sintomas.push(1,0,0,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='500') sintomas.push(1,0,0,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='504') sintomas.push(1,0,0,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='508') sintomas.push(1,0,0,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='104') sintomas.push(1,0,0,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='516') sintomas.push(1,0,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='520') sintomas.push(1,0,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='524') sintomas.push(1,0,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='528') sintomas.push(1,0,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='540') sintomas.push(1,0,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='554') sintomas.push(1,0,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='558') sintomas.push(1,0,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='562') sintomas.push(1,0,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='566') sintomas.push(1,0,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='570') sintomas.push(1,0,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='574') sintomas.push(1,0,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='807') sintomas.push(1,0,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='580') sintomas.push(1,0,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='578') sintomas.push(1,0,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='512') sintomas.push(1,0,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='586') sintomas.push(1,0,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='585') sintomas.push(1,0,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='591') sintomas.push(1,0,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='598') sintomas.push(1,0,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='600') sintomas.push(1,0,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='604') sintomas.push(1,0,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='608') sintomas.push(1,0,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='612') sintomas.push(1,0,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='616') sintomas.push(1,0,1,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='620') sintomas.push(1,0,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='630') sintomas.push(1,0,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='634') sintomas.push(1,0,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='410') sintomas.push(1,0,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='498') sintomas.push(1,0,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='638') sintomas.push(1,0,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='642') sintomas.push(1,0,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='643') sintomas.push(1,0,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='646') sintomas.push(1,1,0,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='652') sintomas.push(1,1,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='654') sintomas.push(1,1,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='659') sintomas.push(1,1,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='662') sintomas.push(1,1,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='663') sintomas.push(1,1,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='666') sintomas.push(1,1,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='670') sintomas.push(1,1,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='882') sintomas.push(1,1,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='674') sintomas.push(1,1,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='678') sintomas.push(1,1,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='680') sintomas.push(1,1,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='682') sintomas.push(1,1,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='686') sintomas.push(1,1,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='688') sintomas.push(1,1,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='690') sintomas.push(1,1,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='694') sintomas.push(1,1,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='702') sintomas.push(1,1,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='534') sintomas.push(1,1,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='703') sintomas.push(1,1,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='705') sintomas.push(1,1,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='090') sintomas.push(1,1,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='706') sintomas.push(1,1,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='710') sintomas.push(1,1,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='239') sintomas.push(1,1,0,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='728') sintomas.push(1,1,0,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='724') sintomas.push(1,1,0,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='144') sintomas.push(1,1,0,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='275') sintomas.push(1,1,0,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='729') sintomas.push(1,1,0,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='740') sintomas.push(1,1,0,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='744') sintomas.push(1,1,0,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='752') sintomas.push(1,1,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='756') sintomas.push(1,1,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='760') sintomas.push(1,1,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='762') sintomas.push(1,1,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='764') sintomas.push(1,1,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='626') sintomas.push(1,1,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='768') sintomas.push(1,1,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='772') sintomas.push(1,1,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='776') sintomas.push(1,1,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='780') sintomas.push(1,1,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='788') sintomas.push(1,1,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='792') sintomas.push(1,1,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='795') sintomas.push(1,1,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='796') sintomas.push(1,1,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='798') sintomas.push(1,1,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='800') sintomas.push(1,1,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='804') sintomas.push(1,1,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='784') sintomas.push(1,1,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='826') sintomas.push(1,1,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='834') sintomas.push(1,1,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='581') sintomas.push(1,1,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='840') sintomas.push(1,1,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='850') sintomas.push(1,1,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='858') sintomas.push(1,1,1,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='860') sintomas.push(1,1,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='548') sintomas.push(1,1,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='862') sintomas.push(1,1,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='704') sintomas.push(1,1,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='876') sintomas.push(1,1,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='732') sintomas.push(1,1,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='887') sintomas.push(1,1,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='894') sintomas.push(1,1,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='716') sintomas.push(0,0,0,1,1,0,0,0)
                    else sintomas.push(0,0,0,0,0,0,0,0)
                }else if(vetorcampos[i] == 128){ //TOMO_RES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if (linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='6') sintomas.push(0,0,0,1,0,0)
                    else sintomas.push(0,0,0,0,0,0)
                }else if(vetorcampos[i] == 133){ //RES_AN
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,1,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 79){ //SUPORT_VEN
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] == '2') sintomas.push(0,0,0,0,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] == '3') sintomas.push(0,0,0,0,0,0,0,0,0,1)
                    else sintomas.push(0,0,0,0,0,0,0,0,0,0) //Quando o campo vier vazio
                }else if(vetorcampos[i] == 80){ //RAIOX_RES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] == '2') sintomas.push(1,1,1)
                    else if(linha[vetorcampos[i]] == '3') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] == '4') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] == '5') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] == '6') sintomas.push(1,0,0)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 109){ //CRITERIO
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,0,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,1,0,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1,0)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(1,1,1,1)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 148){ //TP_SOR
                    //sintomas.push("D",vetorcampos[i],"E")
                    if (linha[vetorcampos[i]] == '1') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 27){ //CS_ZONA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,0)
                    else sintomas.push(0,0)
                }else if(vetorcampos[i] == 36) { //SATURACAO
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 47) { //ASMA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 48) { //DIABETES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 50) { //PNEUMOPATI
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 53) { //OBESIDADE
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 151) { //RES_IGG, RES_IGM, RES_IGA
                    if(linha[vetorcampos[i]] == '1' || linha[vetorcampos[i+1]] == '1' || linha[vetorcampos[i+2]] == '1'){
                        sintomas.push(0,0,0,0)
                    }else sintomas.push(1,1,1,1)
                }else {
                    if(vetorcampos[i] != 70 && vetorcampos[i] != 77 && vetorcampos[i] != 78 && vetorcampos[i] != 111 && vetorcampos[i] != 87 && vetorcampos[i] != 152 && vetorcampos[i] != 153){
                        //sintomas.push("D")
                        //sintomas.push(vetorcampos[i],"E")
                        if(linha[vetorcampos[i]] == '1') sintomas.push(1,1)
                        else if(linha[vetorcampos[i]] == '2') sintomas.push(1,0)
                        else sintomas.push(0,0)
                        //sintomas.push("F")
                    }
                }
            }
            CountVivos++
            PacientesVivos.push(sintomas)
        }
        else if(linha[110] == '2'){ //Se o paciente estiver morto
            //sintomas.push("A")
            //111-70 (DT_EVOLUCA-DT_INTERNA)
            let a = GetDiffDaysInBinary(linha[70],linha[111])
            sintomas.push(Array.from(a).map(idx => parseInt(idx)))
            //sintomas.push("B")
            //78-77 (DT_SAIDUTI-DT_ENTUTI)
            let b = GetDiffDaysInBinary(linha[77],linha[78])
            sintomas.push(Array.from(b).map(idx => parseInt(idx)))

            for(var i=0;i<vetorcampos.length;i++){
                if (vetorcampos[i] == 13){ //NU_IDADE_N
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(parseInt(linha[vetorcampos[i]]) < 10) sintomas.push(0,0,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 20) sintomas.push(0,0,1,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 30) sintomas.push(0,0,1,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 40) sintomas.push(0,1,0,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 50) sintomas.push(0,1,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 60) sintomas.push(0,1,1,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 70) sintomas.push(0,1,1,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 80) sintomas.push(1,0,0,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 90) sintomas.push(1,0,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 100) sintomas.push(1,0,1,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 110) sintomas.push(1,0,1,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 120) sintomas.push(1,1,0,0)
                    else if (parseInt(linha[vetorcampos[i]]) < 130) sintomas.push(1,1,0,1)
                    else if (parseInt(linha[vetorcampos[i]]) < 140) sintomas.push(1,1,1,0)
                    else sintomas.push(1,1,1,1)//140 a 150 anos
                }else if(vetorcampos[i] == 10){ //CO_UNI_NOT
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] != ''){
                        var tmp = parseInt(linha[vetorcampos[i]])

                        tmp = tmp.toString(2)

                        while (tmp.length < 24) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }else{
                        tmp =''
                        while (tmp.length < 24) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }

                }else if(vetorcampos[i] == 26){ //CO_MUN_RES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] != ''){
                        var tmp = parseInt(linha[vetorcampos[i]])

                        tmp = tmp.toString(2)

                        while (tmp.length < 20) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }else{
                        tmp =''
                        while (tmp.length < 20) {
                            tmp = '0' + tmp
                        }
                        sintomas.push(Array.from(tmp).map(idx => parseInt(idx)))
                    }

                }else if(vetorcampos[i] == 16){ //CS_GESTANT
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='6') sintomas.push(0,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 17){ //CS_RACA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(1,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 19){ //CS_ESCOL_N
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '0') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='1') sintomas.push(1,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 22){ //SG_UF
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == 'RO') sintomas.push(0,0,0,0,1)
                    else if(linha[vetorcampos[i]] == 'AC') sintomas.push(0,0,0,1,0)
                    else if(linha[vetorcampos[i]] == 'AM') sintomas.push(0,0,0,1,1)
                    else if(linha[vetorcampos[i]] == 'RR') sintomas.push(0,0,1,0,0)
                    else if(linha[vetorcampos[i]] == 'PA') sintomas.push(0,0,1,0,1)
                    else if(linha[vetorcampos[i]] == 'AP') sintomas.push(0,0,1,1,0)
                    else if(linha[vetorcampos[i]] == 'TO') sintomas.push(0,0,1,1,1)
                    else if(linha[vetorcampos[i]] == 'MA') sintomas.push(0,1,0,0,0)
                    else if(linha[vetorcampos[i]] == 'PI') sintomas.push(0,1,0,0,1)
                    else if(linha[vetorcampos[i]] == 'CE') sintomas.push(0,1,0,1,0)
                    else if(linha[vetorcampos[i]] == 'RN') sintomas.push(0,1,0,1,1)
                    else if(linha[vetorcampos[i]] == 'PB') sintomas.push(0,1,1,0,0)
                    else if(linha[vetorcampos[i]] == 'PE') sintomas.push(0,1,1,0,1)
                    else if(linha[vetorcampos[i]] == 'AL') sintomas.push(0,1,1,1,0)
                    else if(linha[vetorcampos[i]] == 'SE') sintomas.push(0,1,1,1,1)
                    else if(linha[vetorcampos[i]] == 'BA') sintomas.push(1,0,0,0,0)
                    else if(linha[vetorcampos[i]] == 'MG') sintomas.push(1,0,0,0,1)
                    else if(linha[vetorcampos[i]] == 'ES') sintomas.push(1,0,0,1,0)
                    else if(linha[vetorcampos[i]] == 'RJ') sintomas.push(1,0,0,1,1)
                    else if(linha[vetorcampos[i]] == 'SP') sintomas.push(1,0,1,0,0)
                    else if(linha[vetorcampos[i]] == 'PR') sintomas.push(1,0,1,0,1)
                    else if(linha[vetorcampos[i]] == 'SC') sintomas.push(1,0,1,1,0)
                    else if(linha[vetorcampos[i]] == 'RS') sintomas.push(1,0,1,1,1)
                    else if(linha[vetorcampos[i]] == 'MS') sintomas.push(1,1,0,0,0)
                    else if(linha[vetorcampos[i]] == 'MT') sintomas.push(1,1,0,0,1)
                    else if(linha[vetorcampos[i]] == 'GO') sintomas.push(1,1,0,1,0)
                    else if(linha[vetorcampos[i]] == 'DF') sintomas.push(1,1,0,1,1)
                    else sintomas.push(0,0,0,0,0)
                }else if(vetorcampos[i] == 85){ //TP_AMOSTRA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if (linha[vetorcampos[i]] == '1') sintomas.push(1,0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,1,0)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 116){ //CO_PS_VGM
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '004') sintomas.push(0,0,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='248') sintomas.push(0,0,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='008') sintomas.push(0,0,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='012') sintomas.push(0,0,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='016') sintomas.push(0,0,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='020') sintomas.push(0,0,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='024') sintomas.push(0,0,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='660') sintomas.push(0,0,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='010') sintomas.push(0,0,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='028') sintomas.push(0,0,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='032') sintomas.push(0,0,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='051') sintomas.push(0,0,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='533') sintomas.push(0,0,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='036') sintomas.push(0,0,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='040') sintomas.push(0,0,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='031') sintomas.push(0,0,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='044') sintomas.push(0,0,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='048') sintomas.push(0,0,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='050') sintomas.push(0,0,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='052') sintomas.push(0,0,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='112') sintomas.push(0,0,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='056') sintomas.push(0,0,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='084') sintomas.push(0,0,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='204') sintomas.push(0,0,0,1,1,1,1,1)//
                    else if(linha[vetorcampos[i]] =='060') sintomas.push(0,0,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='064') sintomas.push(0,0,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='068') sintomas.push(0,0,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='535') sintomas.push(0,0,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='070') sintomas.push(0,0,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='072') sintomas.push(0,0,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='074') sintomas.push(0,0,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='076') sintomas.push(0,0,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='086') sintomas.push(0,0,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='092') sintomas.push(0,0,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='096') sintomas.push(0,0,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='100') sintomas.push(0,0,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='854') sintomas.push(0,0,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='108') sintomas.push(0,0,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='132') sintomas.push(0,0,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='116') sintomas.push(0,0,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='120') sintomas.push(0,0,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='124') sintomas.push(0,0,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='136') sintomas.push(0,0,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='140') sintomas.push(0,0,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='148') sintomas.push(0,0,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='152') sintomas.push(0,0,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='156') sintomas.push(0,0,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='344') sintomas.push(0,0,1,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='446') sintomas.push(0,0,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='162') sintomas.push(0,0,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='166') sintomas.push(0,0,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='170') sintomas.push(0,0,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='174') sintomas.push(0,0,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='178') sintomas.push(0,0,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='184') sintomas.push(0,0,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='188') sintomas.push(0,0,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='384') sintomas.push(0,1,0,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='191') sintomas.push(0,1,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='192') sintomas.push(0,1,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='531') sintomas.push(0,1,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='196') sintomas.push(0,1,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='203') sintomas.push(0,1,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='408') sintomas.push(0,1,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='180') sintomas.push(0,1,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='208') sintomas.push(0,1,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='262') sintomas.push(0,1,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='212') sintomas.push(0,1,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='214') sintomas.push(0,1,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='218') sintomas.push(0,1,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='818') sintomas.push(0,1,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='222') sintomas.push(0,1,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='226') sintomas.push(0,1,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='232') sintomas.push(0,1,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='233') sintomas.push(0,1,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='748') sintomas.push(0,1,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='231') sintomas.push(0,1,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='238') sintomas.push(0,1,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='234') sintomas.push(0,1,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='242') sintomas.push(0,1,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='246') sintomas.push(0,1,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='250') sintomas.push(0,1,0,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='254') sintomas.push(0,1,0,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='258') sintomas.push(0,1,0,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='260') sintomas.push(0,1,0,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='266') sintomas.push(0,1,0,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='270') sintomas.push(0,1,0,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='268') sintomas.push(0,1,0,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='276') sintomas.push(0,1,0,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='288') sintomas.push(0,1,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='292') sintomas.push(0,1,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='300') sintomas.push(0,1,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='304') sintomas.push(0,1,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='308') sintomas.push(0,1,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='312') sintomas.push(0,1,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='316') sintomas.push(0,1,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='320') sintomas.push(0,1,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='831') sintomas.push(0,1,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='324') sintomas.push(0,1,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='624') sintomas.push(0,1,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='328') sintomas.push(0,1,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='332') sintomas.push(0,1,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='334') sintomas.push(0,1,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='336') sintomas.push(0,1,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='340') sintomas.push(0,1,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='348') sintomas.push(0,1,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='352') sintomas.push(0,1,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='356') sintomas.push(0,1,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='360') sintomas.push(0,1,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='364') sintomas.push(0,1,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='368') sintomas.push(0,1,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='372') sintomas.push(0,1,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='833') sintomas.push(0,1,1,1,0,1,1.1)
                    else if(linha[vetorcampos[i]] =='376') sintomas.push(0,1,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='380') sintomas.push(0,1,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='388') sintomas.push(0,1,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='392') sintomas.push(0,1,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='832') sintomas.push(0,1,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='400') sintomas.push(0,1,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='398') sintomas.push(0,1,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='404') sintomas.push(0,1,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='296') sintomas.push(1,0,0,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='414') sintomas.push(1,0,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='417') sintomas.push(1,0,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='418') sintomas.push(1,0,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='428') sintomas.push(1,0,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='422') sintomas.push(1,0,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='426') sintomas.push(1,0,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='430') sintomas.push(1,0,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='434') sintomas.push(1,0,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='438') sintomas.push(1,0,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='440') sintomas.push(1,0,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='442') sintomas.push(1,0,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='450') sintomas.push(1,0,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='454') sintomas.push(1,0,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='458') sintomas.push(1,0,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='462') sintomas.push(1,0,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='466') sintomas.push(1,0,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='470') sintomas.push(1,0,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='584') sintomas.push(1,0,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='474') sintomas.push(1,0,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='478') sintomas.push(1,0,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='480') sintomas.push(1,0,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='175') sintomas.push(1,0,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='484') sintomas.push(1,0,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='583') sintomas.push(1,0,0,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='492') sintomas.push(1,0,0,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='496') sintomas.push(1,0,0,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='499') sintomas.push(1,0,0,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='500') sintomas.push(1,0,0,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='504') sintomas.push(1,0,0,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='508') sintomas.push(1,0,0,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='104') sintomas.push(1,0,0,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='516') sintomas.push(1,0,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='520') sintomas.push(1,0,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='524') sintomas.push(1,0,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='528') sintomas.push(1,0,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='540') sintomas.push(1,0,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='554') sintomas.push(1,0,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='558') sintomas.push(1,0,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='562') sintomas.push(1,0,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='566') sintomas.push(1,0,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='570') sintomas.push(1,0,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='574') sintomas.push(1,0,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='807') sintomas.push(1,0,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='580') sintomas.push(1,0,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='578') sintomas.push(1,0,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='512') sintomas.push(1,0,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='586') sintomas.push(1,0,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='585') sintomas.push(1,0,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='591') sintomas.push(1,0,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='598') sintomas.push(1,0,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='600') sintomas.push(1,0,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='604') sintomas.push(1,0,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='608') sintomas.push(1,0,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='612') sintomas.push(1,0,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='616') sintomas.push(1,0,1,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='620') sintomas.push(1,0,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='630') sintomas.push(1,0,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='634') sintomas.push(1,0,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='410') sintomas.push(1,0,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='498') sintomas.push(1,0,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='638') sintomas.push(1,0,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='642') sintomas.push(1,0,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='643') sintomas.push(1,0,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='646') sintomas.push(1,1,0,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='652') sintomas.push(1,1,0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='654') sintomas.push(1,1,0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='659') sintomas.push(1,1,0,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='662') sintomas.push(1,1,0,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='663') sintomas.push(1,1,0,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='666') sintomas.push(1,1,0,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='670') sintomas.push(1,1,0,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='882') sintomas.push(1,1,0,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='674') sintomas.push(1,1,0,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='678') sintomas.push(1,1,0,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='680') sintomas.push(1,1,0,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='682') sintomas.push(1,1,0,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='686') sintomas.push(1,1,0,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='688') sintomas.push(1,1,0,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='690') sintomas.push(1,1,0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='694') sintomas.push(1,1,0,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='702') sintomas.push(1,1,0,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='534') sintomas.push(1,1,0,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='703') sintomas.push(1,1,0,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='705') sintomas.push(1,1,0,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='090') sintomas.push(1,1,0,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='706') sintomas.push(1,1,0,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='710') sintomas.push(1,1,0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='239') sintomas.push(1,1,0,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='728') sintomas.push(1,1,0,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='724') sintomas.push(1,1,0,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='144') sintomas.push(1,1,0,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='275') sintomas.push(1,1,0,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='729') sintomas.push(1,1,0,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='740') sintomas.push(1,1,0,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='744') sintomas.push(1,1,0,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='752') sintomas.push(1,1,1,0,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='756') sintomas.push(1,1,1,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='760') sintomas.push(1,1,1,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='762') sintomas.push(1,1,1,0,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='764') sintomas.push(1,1,1,0,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='626') sintomas.push(1,1,1,0,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='768') sintomas.push(1,1,1,0,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='772') sintomas.push(1,1,1,0,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='776') sintomas.push(1,1,1,0,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='780') sintomas.push(1,1,1,0,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='788') sintomas.push(1,1,1,0,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='792') sintomas.push(1,1,1,0,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='795') sintomas.push(1,1,1,0,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='796') sintomas.push(1,1,1,0,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='798') sintomas.push(1,1,1,0,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='800') sintomas.push(1,1,1,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='804') sintomas.push(1,1,1,1,0,0,0,0)
                    else if(linha[vetorcampos[i]] =='784') sintomas.push(1,1,1,1,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='826') sintomas.push(1,1,1,1,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='834') sintomas.push(1,1,1,1,0,0,1,1)
                    else if(linha[vetorcampos[i]] =='581') sintomas.push(1,1,1,1,0,1,0,0)
                    else if(linha[vetorcampos[i]] =='840') sintomas.push(1,1,1,1,0,1,0,1)
                    else if(linha[vetorcampos[i]] =='850') sintomas.push(1,1,1,1,0,1,1,0)
                    else if(linha[vetorcampos[i]] =='858') sintomas.push(1,1,1,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='860') sintomas.push(1,1,1,1,1,0,0,0)
                    else if(linha[vetorcampos[i]] =='548') sintomas.push(1,1,1,1,1,0,0,1)
                    else if(linha[vetorcampos[i]] =='862') sintomas.push(1,1,1,1,1,0,1,0)
                    else if(linha[vetorcampos[i]] =='704') sintomas.push(1,1,1,1,1,0,1,1)
                    else if(linha[vetorcampos[i]] =='876') sintomas.push(1,1,1,1,1,1,0,0)
                    else if(linha[vetorcampos[i]] =='732') sintomas.push(1,1,1,1,1,1,0,1)
                    else if(linha[vetorcampos[i]] =='887') sintomas.push(1,1,1,1,1,1,1,0)
                    else if(linha[vetorcampos[i]] =='894') sintomas.push(1,1,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='716') sintomas.push(0,0,0,1,1,0,0,0)
                    else sintomas.push(0,0,0,0,0,0,0,0)
                }else if(vetorcampos[i] == 128){ //TOMO_RES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if (linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,0,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,0,1,1,1)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,0,0,0,0,1)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,0,0,0,1,0)
                    else if(linha[vetorcampos[i]] =='6') sintomas.push(0,0,0,1,0,0)
                    else sintomas.push(0,0,0,0,0,0)
                }else if(vetorcampos[i] == 133){ //RES_AN
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='5') sintomas.push(0,1,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 79){ //SUPORT_VEN
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,0,0,0,1,1,1,1,1,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,0,0,0,0,0,0,0,0,1)
                    else sintomas.push(0,0,0,0,0,0,0,0,0,0) //Quando o campo vier vazio
                }else if(vetorcampos[i] == 80){ //RAOIX_RES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] == '2') sintomas.push(1,1,1)
                    else if(linha[vetorcampos[i]] == '3') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] == '4') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] == '5') sintomas.push(0,0,1)
                    else if(linha[vetorcampos[i]] == '6') sintomas.push(1,0,0)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 109){ //CRITERIO
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,0,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(0,1,0,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(0,1,1,0)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(1,1,1,1)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 148){ //TP_SOR
                    //sintomas.push("D",vetorcampos[i],"E")
                    if (linha[vetorcampos[i]] == '1') sintomas.push(0,1,0)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,1,0)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,0,0)
                    else if(linha[vetorcampos[i]] =='4') sintomas.push(0,0,1)
                    else sintomas.push(0,0,0)
                }else if(vetorcampos[i] == 27){ //CS_ZONA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(0,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,1)
                    else if(linha[vetorcampos[i]] =='3') sintomas.push(1,0)
                    else sintomas.push(0,0)
                }else if(vetorcampos[i] == 36) { //SATURACAO
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 47) { //ASMA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 48) { //DIABETES
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 50) { //PNEUMOPATI
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 53) { //OBESIDADE
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1') sintomas.push(1,1,1,1)
                    else if(linha[vetorcampos[i]] =='2') sintomas.push(1,0,1,0)
                    else sintomas.push(0,0,0,0)
                }else if(vetorcampos[i] == 151) { //RES_IGG, RES_IGM, RES_IGA
                    //sintomas.push("D",vetorcampos[i],"E")
                    if(linha[vetorcampos[i]] == '1' || linha[vetorcampos[i+1]] == '1' || linha[vetorcampos[i+2]] == '1'){
                        sintomas.push(0,0,0,0)
                    }else sintomas.push(1,1,1,1)
                }else {
                    if(vetorcampos[i] != 70 && vetorcampos[i] != 77 && vetorcampos[i] != 78 && vetorcampos[i] != 111 && vetorcampos[i] != 87 && vetorcampos[i] != 152 && vetorcampos[i] != 153){
                        //sintomas.push("D")
                        //sintomas.push(vetorcampos[i],"E")
                        if(linha[vetorcampos[i]] == '1') sintomas.push(1,1)
                        else if(linha[vetorcampos[i]] == '2') sintomas.push(1,0)
                        else sintomas.push(0,0)
                        //sintomas.push("F")
                    }
                }
            }
            
            CountMortos++
            PacientesMortos.push(sintomas)
        }
    }
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

    for(var i=0;i<n;i++) X[i] = [-b].concat(X[i]);

    W = [1].concat(W)

    var l = 0
    var Y = new Array(n).fill(0)
    var tentativas = 0

    var ok = true;

    while (l == 0){
        tentativas++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += X[i][j] * W[j];
            Y[i] = sinal(soma)
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
            return [ok,W]
        }
    }   

    return [ok,W,tentativas]
} 

function RandomArray(Vivos,Mortos){  // Escolhendo aleatóriamente os pacientes
    let PacientesVivosEscolhidos = [], PacientesMortosEscolhidos = []

    let countPacientes = 0

    while(countPacientes < 5){
        let idx = Math.floor(Math.random() * PacientesVivos.length)
        if(!PacientesVivosEscolhidos.includes(idx)){
            PacientesVivosEscolhidos.push(idx)
            PacientesTotal.push(PacientesVivos[idx])
            PacientesTotalY.push(1)
            countPacientes++
        } 
    }
        
    countPacientes = 0
    while(countPacientes < 5){
        idx = Math.floor(Math.random() * PacientesMortos.length)
        if(!PacientesMortosEscolhidos.includes(idx)){
            PacientesMortosEscolhidos.push(idx)
            PacientesTotal.push(PacientesMortos[idx])
            PacientesTotalY.push(-1)
            countPacientes++
        }
    }
}

function RunPerceptron(){
    // console.clear()
    console.log('mortosCount = %d', CountMortos)
    console.log('vivosCount = %d', CountVivos)
    
    RandomArray(PacientesVivos,PacientesMortos)

    //Perceptron
    let W = []
    let b = 1

    for(let i=0;i<PacientesTotal[0].length;i++){
        W.push(1)
    }

    let tamanhoPacientes = PacientesTotal.length
    let ok, iteracoes

    let arr = Perceptron(PacientesTotal,tamanhoPacientes,W,PacientesTotalY,b,10000)

    ok = arr[0]
    W = arr[1]
    iteracoes = arr[2]

    while(!ok){
        PacientesTotal = [], PacientesTotalY = []
        W = []

        RandomArray(PacientesVivos,PacientesMortos)

        for(let i=0;i<PacientesTotal[0].length;i++){
            W.push(1)
        }

        arr = Perceptron(PacientesTotal,tamanhoPacientes,W,PacientesTotalY,b,10000)

        ok = arr[0]
        W = arr[1]
        iteracoes = arr[2]

        if(!ok) console.log("Não achou o Hiperplano")
    }

    console.log("\nO hiperplano foi achado em %d iterações", iteracoes)
    console.log(`W = ${W}`)
    console.log(`Tamanho de W = ${W.length}`)
}

var hrstart = process.hrtime()
fs.createReadStream('MiniBanco.csv')//Data.csv
.pipe(csv({}))
.on('data', (data) => {  //Lógica aplicada a cada linha //data
    //
    getSintomas(data)
})
.on('end', () => {   //Lógica aplicada quando chega no EOF
    // RunPerceptron()

    //Printa quantos pacientes tem uma certa quantidade de campos Preenchidos
    // for(let i=0;i<QntdSintomasPreenchidos.length;i++){
    //     console.log("Tem %d pacientes com %d campos Preenchidos",QntdSintomasPreenchidos[i],i)
    // }
    // console.log(PacientesMortos.length+PacientesVivos.length)
    WriteCSV(PacientesMortos.concat(PacientesVivos),PacientesMortos.length,PacientesVivos.length);

    //Calculando o tempo de execução do código
    let hrend = process.hrtime(hrstart)
    console.info('\nExecution time (hr): %ds %dms\n', hrend[0], hrend[1] / 1000000)
}
)