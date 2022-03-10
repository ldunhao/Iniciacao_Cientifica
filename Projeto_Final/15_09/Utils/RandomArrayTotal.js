function RandomArrayTotal(X,Ylinha,PacientesVivos,PacientesMortos){  // Escolhendo aleatóriamente os pacientes

    for(let i = 0; i < PacientesMortos.length; i++){
        X.push(PacientesMortos[i])
        Ylinha.push(-1)
    }
        
    for(let i = 0; i < PacientesVivos.length; i++){
        X.push(PacientesVivos[i])
        Ylinha.push(1)
    }

    return [X,Ylinha]
}

module.exports = {
    RandomArrayTotal
}