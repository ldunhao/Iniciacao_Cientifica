import numpy as np
import pandas as pd
import math
import random
import matplotlib.pyplot as plt
import time

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

  print(f"Número de iterações {cont}")
  return W

def main():
  X = [[14,0],[18,0.7],[20,1],[22,2],[24,4],[26,6],[27,8],[27.5,10],[28,14],[27.5,18],[27,20],[26,22],[24,24],[22,25.5],[20,26.5],[18,27],[14,28],[10,27],[8,26.5],[6,25.5],[4,24],[2.5,22],[1,20],[0.5,18],[0,14],[0.5,10],[1,8],[2.5,6],[4,4],[6,2],[8,1],[10,0.5]]
  n = len(X)
  W = [0,1]
  Y = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,-1,-1,]
  b = -1

  eixoXPretos = []
  eixoYPretos = []
  eixoXBrancos = []
  eixoYBrancos = []

  for i in range(len(X)):
    if(Y[i] == -1):
      eixoXBrancos.append(X[i][0])
      eixoYBrancos.append(X[i][1])
    else:
      eixoXPretos.append(X[i][0])
      eixoYPretos.append(X[i][1])


 
  W = Perceptron(X,n,W,Y,b)

  fig = plt.figure()
  ax = fig.gca()

  print(W)

  x = np.linspace(-5,5)
  y = W[0]*x + W[1]

  plt.plot(x, y, '-r', label=f"y={W[0]}x+{W[1]}")

  ax.scatter(eixoXBrancos,eixoYBrancos,c = 'green')
  ax.scatter(eixoXPretos,eixoYPretos,c = 'black')

  plt.title('Perceptron')
  ax.set_xlabel('Eixo X')
  ax.set_ylabel('Eixo Y')
  # ax.set_zlabel('Z-axis')
  plt.legend(loc='upper left')
  plt.grid()
  plt.show()

main()


