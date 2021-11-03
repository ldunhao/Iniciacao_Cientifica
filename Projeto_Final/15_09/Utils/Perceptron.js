function Sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

function Perceptron(X,n,W,Ylinha,b,t){
    var d = X[0].length
    B = b
    for(var i=0;i<n;i++) X[i] = [-b].concat(X[i]);

    W = [1].concat(W)

    var l = 0
    var Y = new Array(n).fill(0)
    var Yteste = new Array(n).fill(0)
    var tentativas = 0

    var ok = true;

    while (l == 0){
        tentativas++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += X[i][j] * W[j];
            Yteste[i] = soma
            Y[i] = Sinal(soma)
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
            return [ok,W,tentativas,Yteste]
        }
    }   
    return [ok,W,tentativas,Yteste]
} 

module.exports = {
    Perceptron,
    Sinal
}