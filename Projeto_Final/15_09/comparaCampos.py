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

print(list(set(arr2021) - set(arr2020)))
print(set(arr2020).issubset(arr2021))
# print(len(arr2021))