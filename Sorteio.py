import numpy as np
import pandas as pd
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

## Esta função calcula a média dos retornos da função Escolhe_Elementos
## Também plota um gráfico com os retornos de cada iteração do loop com uma linha no valor médio
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
###############

## Sorteia um elemento aleatório do Fluxo
def Escolhe_Elementos(S):
  a = next(S)
  i = 1; m = a
  a = next(S)
  while a != None:
    i = i + 1
    p = np.random.random()
    if p <= 1/i:
      m = a
    a = next(S)
  return m
###############

def main():

  ## Determinando o intervalo dos números do Fluxo
  print("Digite o intervalo.")
  start = int(input("De: "))
  end = int(input("Até: "))
  ###############

  ## Declaração do DataFrame 
  df = pd.DataFrame(index = np.arange(start, end+1))
  df['count'] = 0
  ###############
  
  ## Inicializando o Fluxo
  myclass = Fluxo(start,end)
  S = iter(myclass)
  ###############

  ## Calculo do Tempo de Execução e Armazenamento de cada chamada da função
  start_time = time.time()
  for i in range(1,10001):
    tmp = Escolhe_Elementos(S)
    df.loc[tmp, 'count'] += 1
    S = iter(myclass)
  finish_time = time.time()
  ###############

  Plot(df,finish_time,start_time)

main()