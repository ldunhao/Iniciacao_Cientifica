import numpy as np
import pandas as pd
import math
import matplotlib.pyplot as plt
import time

class Fluxo: 
  def __init__(self, start ,limit): 
    self.start = start
    self.limit = limit 

  def __iter__(self): 
    self.x = self.start
    return self

  def __next__(self): 
    x = self.x 
    if x > self.limit: 
      return None
    self.x = x + 1; 
    return x
  
def escolher_aleatoriamente(z):
  if(z == 0):
    return 1

  i = 1
  while(i<=z and np.random.choice([0,1])):
    i = i + 1
  
  if(z < i):
    return 1
  else:
    return 0 

def Conta_Elemento(S):
  z=0
  a = next(S)

  while a != None:
    if(math.sqrt(a) % 1 == 0):
      p = escolher_aleatoriamente(z)
      if(p):
        z = z + 1
    a = next(S)
  

  return math.pow(2,z) - 1

def main():
  print("Digite o intervalo.")
  start = int(input("De: "))
  end = int(input("Até: "))

  df = pd.DataFrame(index = np.arange(1, 10001)) # Se for mudar o DataFrame, mudar tbm o range
  df['count'] = 0

  myclass = Fluxo(start,end)
  S = iter(myclass)

  start_time = time.time()
  for i in range(1,10001): # Se for mudar o range, mudar tbm o DataFrame
    tmp = Conta_Elemento(S)
    df.loc[i, 'count'] = tmp
    S = iter(myclass)
  finish_time = time.time()

  
  print(f"\nO resultado é: {np.mean(df['count'])}\n")
  print(f"\nTempo de execução para 10000 iterações: {finish_time - start_time}\n")

  plt.title('Conta Elementos')
  plt.xlabel('Números de elementos')
  plt.ylabel('Valor por elemento')
  plt.bar(df.index, height=df['count'], data = df)
  plt.axhline(y = np.mean(df['count']), 
          color = 'red',
          linestyle='-')
  plt.show()

main()
