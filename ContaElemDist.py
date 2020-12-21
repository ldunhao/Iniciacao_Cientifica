import numpy as np
import pandas as pd
import math
import random
import matplotlib.pyplot as plt
import time

class Fluxo: 
  def __init__(self, start ,limit): 
    self.start = start
    self.limit = limit
    self.cont = 1 

  def __iter__(self): 
    self.x = random.randint(self.start,self.limit)
    return self

  def __next__(self): 
    cont = self.cont
    if cont > self.limit: 
      return None
    x = random.randint(self.start,self.limit)
    self.x = x
    self.cont = cont + 1
    return x

class HashTable:  
  def __init__(self,size):
    self.MAX = size
    self.arr = [0 for i in range(self.MAX)]
      
  def get_hash(self, key):
    # L só pode ser escolhido para potencia de 10
    aux = str(key)
    tmp = str(abs(hash(aux)))
    format_numbers = abs(int(tmp[0:3]))
    return format_numbers%self.MAX
  
  def __getitem__(self, index):
    h = self.get_hash(index)
    return self.arr[h]
  
  def __setitem__(self, key, val):
    h = self.get_hash(key)
    self.arr[h] = val

def Plot(df,Ft,St):
  print(f"\nMedia: {np.mean(df['count'])}\n")
  print(f"\nTempo de execução: {Ft - St}\n")
  plt.title('Escolhe-Elementos')
  plt.xlabel('Elementos')
  plt.ylabel('Quantidades de escolha por elemento')
  plt.bar(df.index, height=df['count'], data = df)
  plt.axhline(y = np.mean(df['count']), 
          color = 'red',
          linestyle='-')
  plt.show()

def Conta_Elementos_Dist_Classico(S):
  L = 20000
  V = [0]*L
  a = next(S)
  while a != None: 
    if V[a] == 0: 
      V[a] = V[a] + 1
    a = next(S)
  
  sum = 0
  for i in V:
    sum = sum + i

  return sum

def Conta_Elementos_Distintos(S):
  L = 333
  V = [0]*L
  h = HashTable(L);P = 0
  a = next(S)
  while a != None: 
    if V[h.get_hash(a)] != 1:
      V[h.get_hash(a)] = 1; P = P + 1
    a = next(S)

  p = (L-P)/L

  return (-L)*np.log(p)

def main():

  print("Digite o intervalo.")
  start = int(input("De: "))
  end = int(input("Até: "))
  iteracoes = int(input("Iterações: "))

  df = pd.DataFrame(index = np.arange(start, end+1))
  df['count'] = 0
  
  myclass = Fluxo(start,end)
  S = iter(myclass)

  start_time = time.time()
  for i in range(1,iteracoes+1):
    tmp = Conta_Elementos_Distintos(S)
    df.loc[i, 'count'] = tmp
    myclass = Fluxo(start,end)
    S = iter(myclass)
  finish_time = time.time()

  Plot(df,finish_time,start_time)

main()