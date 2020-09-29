####### Bibliotecas 
import numpy as np
import pandas as pd
import math
import matplotlib.pyplot as plt
import time
############################

####### Criação do crivo
def sieve(N):
  i = 2
  while i*i <= N:
    if is_prime[i] == 0:
        i += 1
        continue

    j = 2*i
    while j < N:
        is_prime[j] = 0
        j += i

    i += 1
############################

####### Checar se um num é primo (SEM CRIVO)
def is_prime(n):
  if n == 1:
    return False

  i = 2
  while i*i <= n:
    if n % i == 0:
      return False
    i += 1
  return True
############################

####### Para criar o crivo
if(choice == 2):
  N = end+1
  is_prime = [1]*N
  is_prime[0] = 0
  is_prime[1] = 0
  sieve(N)
############################


####### Criação do iterator
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
############################

####### Preencher um arquivo.txt com valores inteiros
def preenche():
  file = open("dados.txt","w") 
  for i in range(1,4097):

    file.write(str(i))
    file.write('\n')

  file.close()
############################

####### Criação do DataFrame e plot
df = pd.DataFrame(index = np.arange(1, 10001))
df['count'] = 0

print(f"\nO resultado é: {np.mean(df['count'])}\n")

plt.title('Conta Elementos')
plt.xlabel('Números de elementos')
plt.ylabel('Valor por elemento')
plt.bar(df.index, height=df['count'], data = df)
plt.axhline(y = np.mean(df['count']), 
        color = 'red',
        linestyle='-')
plt.show()
############################

####### Calculo do tempo de execução
start_time = time.time()
finish_time = time.time()
print(f"\nTempo de execução para 10000 iterações: {finish_time - start_time}\n")
############################

####### Hash Table sem lista encadeada
class HashTable:  
  def __init__(self):
    self.MAX = 10
    self.arr = [None for i in range(self.MAX)]
      
  def get_hash(self, key):
    hash = 0
    for char in key:
      hash += ord(char)
    return hash % self.MAX
  
  def __getitem__(self, index):
    h = self.get_hash(index)
    return self.arr[h]
  
  def __setitem__(self, key, val):
    h = self.get_hash(key)
    self.arr[h] = val
############################

####### Hash Table com lista encadeada
class HashTable:  
  def __init__(self):
    self.MAX = 10
    self.arr = [[] for i in range(self.MAX)]
      
  def get_hash(self, key):
    hash = 0
    for char in key:
      hash += ord(char)
    return hash % self.MAX
  
  def __getitem__(self, key):
    arr_index = self.get_hash(key)
    for kv in self.arr[arr_index]:
      if kv[0] == key:
        return kv[1]
          
  def __setitem__(self, key, val):
    h = self.get_hash(key)
    found = False
    for idx, element in enumerate(self.arr[h]):
      if len(element)==2 and element[0] == key:
        self.arr[h][idx] = (key,val)
        found = True
    if not found:
      self.arr[h].append((key,val))
      
  def __delitem__(self, key):
      arr_index = self.get_hash(key)
      for index, kv in enumerate(self.arr[arr_index]):
        if kv[0] == key:
          print("del",index)
          del self.arr[arr_index][index]
############################
