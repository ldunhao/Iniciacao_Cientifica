import os

bd2020 = open("bd_2020_campos.txt", "r")
bd2021 = open("bd_2021_campos.txt", "r")

arr2020 = []
arr2021 = []
for x in bd2020:
    arr = x.split(',')
    arr2020.append(arr[0])

for x in bd2021:
    arr = x.split(',')
    arr2021.append(arr[0])

os.system('cls')
print(list(set(arr2021) - set(arr2020)))
print(
    "\nTodos os campos de 2020 estão presentes no banco de 2021\n" 
    if set(arr2020).issubset(arr2021) 
    else "\nOs campos de 2020 não estão todos inclusos no banco de 2021\n"
)
# print(len(arr2021))