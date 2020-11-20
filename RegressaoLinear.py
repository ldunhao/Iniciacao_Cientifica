import numpy as np
import pandas as pd
import math
import random
import matplotlib.pyplot as plt
import time

def RegressaoLinear(X,Y):
  n = len(X)

  ## Somatório de Xi e Somatório de Yi
  sum_x = 0; sum_y = 0
  for i in range(n):
    sum_x += X[i]
    sum_y += Y[i]
  ##################

  xlinha = sum_x/n; ylinha = sum_y/n
  a = 0; b = 0

  ## Somatório de Xi(Yi - ylinha) e Somatório de Xi(Xi - xlinha)
  aux_1 = 0; aux_2 = 0
  for i in range(n):
    aux_1 += X[i]*(Y[i] - ylinha)
    aux_2 += X[i]*(X[i] - xlinha)
  ####################

  a = aux_1/aux_2
  b = ylinha - a*xlinha

  return a,b


def main():
  X = [5,8,10,12,13,15,20,25,30,34]
  Y = [-2,0,3,5,7,8,10,13,15,18]

  resultado = RegressaoLinear(X,Y)

  a = round(resultado[0], 2)
  b = round(resultado[1], 2)


  print(f"a = {a}")
  print(f"b = {b}")
  
  fig = plt.figure()
  ax = fig.gca() ## Plot em 2D

  ## Plotar a reta
  x = np.linspace(-5,5)
  y = 2*x + 1
  plt.plot(x, y, '-r', label=f"{a}x + {b}")
  ################

  plt.title('Regressão Linear')
  ax.set_xlabel('Eixo X')
  ax.set_ylabel('Eixo Y')
  plt.legend(loc='upper left')
  plt.grid()
  plt.show()

main()