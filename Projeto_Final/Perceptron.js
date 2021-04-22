function sinal(z){
    if(z>0) return 1
    else if(z<0){
        return -1
    }
    else return 0
}

function Perceptron(X,n,W,Ylinha,b){
    var d = X[0].length

    for(var i=0;i<n;i++) X[i] = [-b].concat(X[i]);

    W = [1].concat(W)
    var l = 0
    var Y = new Array(n).fill(0)
    var cont = 0


    while (l == 0){
        cont++;

        for(var i = 0;i<n;i++){
            var soma = 0
            for(var j=0;j<d+1;j++) soma += X[i][j] * W[j];
            Y[i] = sinal(soma)
        }

        var i=0, l=1;

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
    }   

    console.log(cont)
    return W
} 

var X = [[14,0],[18,0.7],[20,1],[22,2],[24,4],[26,6],[27,8],[27.5,10],[28,14],[27.5,18],[27,20],[26,22],[24,24],[22,25.5],[20,26.5],[18,27],[14,28],[10,27],[8,26.5],[6,25.5],[4,24],[2.5,22],[1,20],[0.5,18],[0,14],[0.5,10],[1,8],[2.5,6],[4,4],[6,2],[8,1],[10,0.5]]
var n = X.length
var W = [0,0]
var Y = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1,-1,]
var b = 1

W = Perceptron(X,n,W,Y,b)

console.log(W)
