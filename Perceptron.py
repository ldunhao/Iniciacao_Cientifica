import numpy as np
import pandas as pd
import math
import random
import matplotlib.pyplot as plt
import time

############ Variáveis para plotar o gráfico
eixoXPretos = []
eixoYPretos = []
eixoXBrancos = []
eixoYBrancos = []
VW = []
############

def DistinguishPoints(X,Y):
  for i in range(len(X)):
    if(Y[i] == -1):
      eixoXBrancos.append(X[i][0])
      eixoYBrancos.append(X[i][1])
    else:
      eixoXPretos.append(X[i][0])
      eixoYPretos.append(X[i][1])

def GetMargin(X,W,b):
  margin = math.inf
  for i in range(len(X)):
    margin = min(margin,CalcDistPointToLine(X[i],W,b))
  
  return margin

def VerifyPos(SzBrancos,SzPretos,W,b):
  ok = True
  for i in range(SzBrancos):
    if(CheckPos(eixoXBrancos[i],eixoYBrancos[i],W,b) == 1):
      ok = False

  for i in range(SzPretos):
    if(CheckPos(eixoXPretos[i],eixoYPretos[i],W,b) == -1):
      ok = False

  return ok

def CheckPos(xp,yp,W,b):
  m = -W[1]/W[2]
  k = (b*W[0])/W[2]

  if(yp - (m*xp + k) < 0):
    return -1
  elif(yp - (m*xp + k) > 0):
    return 1
  else:
    return 0

def CalcDistPointToLine(P,W,b):
  m = -W[1]/W[2]
  k = (b*W[0])/W[2]

  Dist = abs(k + (m*P[0]) - P[1])/math.sqrt(1 + m**2)

  return Dist

def Plot(W,b):
  fig = plt.figure()
  ax = fig.gca() ## Plot em 2D
  # ax = fig.add_subplot(111, projection='3d') ## Plot em 3D

  x = np.linspace(-0.2,1.2)
  y = (-W[1]*x)/W[2] + (b*W[0])/W[2] ## Formato -> y = ax + b
  #-b*W[0] + W[1]*X1 + W[2]*X2 = 0 Formato -> 0 = ax + by + c
  plt.plot(x, y, '-r', label=f"2*x + 1")

  plt.plot([-0.2],[(-W[1]*(-0.2))/W[2] + (b*W[0])/W[2]],'.',color='green')
  plt.plot([1.2],[(-W[1]*(1.2))/W[2] + (b*W[0])/W[2]],'.',color='green')
  plt.plot(eixoXBrancos,eixoYBrancos,'o',c = 'white',markeredgecolor='black')
  plt.plot(eixoXPretos,eixoYPretos,'o',c = 'black')

  plt.title('Perceptron')
  ax.set_xlabel('Eixo X')
  ax.set_ylabel('Eixo Y')
  plt.grid()
  plt.show()

def sinal(z):
  if(z>0):
    return 1
  elif(z<0):
    return -1
  else:
    return 0

def Perceptron(X,n,W,Ylinha,b):
  d = len(X[0])
  for i in range(n):
    X[i] = [-b]+X[i]
  W = [1]+W
  l = 0
  Y = [None]*n
  cont=0
  while l == 0:
    cont += 1

    for i in range(n):
      soma = 0
      for j in range(d+1):
        soma += X[i][j]*W[j]
      Y[i] = sinal(soma)

    i = 0; l=1

    while True:
      if Y[i] != Ylinha[i]:
        for j in range(d+1):
          W[j] += Ylinha[i]*X[i][j]
        l = 0
      else:
        i += 1

      if(i>=n or l==0):
        break
    
    print()
    print(f"Iteração {cont}:")
    for i in range(n):
      aux = X[i][0]*W[0] + X[i][1]*W[1] + X[i][2]*W[2]
      print(f"X{i+1}: {X[i][0]}.{W[0]} + {X[i][1]}.{W[1]} + {X[i][2]}.{W[2]} = {aux}")
    print()
    
    # if(cont % 500 == 0):
    #   Plot(W,b)

  

  print("")
  print(f"Número de iterações: {cont}")
  return W

def main():
  X = [[0,0],[0,1],[1,0],[1,1]]
  n = len(X)
  W = [2,1]
  Y = [-1,1,1,1]
  b = 1

  DistinguishPoints(X,Y)
  W = Perceptron(X,n,W,Y,b)

  print("")
  print(f"A margem é: {round(GetMargin(X,W,b),4)}")
  print("")
  print("Os pontos foram separados corretamente") if VerifyPos(len(eixoXBrancos),len(eixoXPretos),W,b) else print("Os pontos não foram separados corretamente")
  
  # Plot(W,b)


main()


