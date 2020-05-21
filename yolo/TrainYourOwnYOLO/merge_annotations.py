import os
directory = "./Data/boxes"
headers = '"image","xmin","ymin","xmax","ymax","label"\n'

with open('./Data/Source_Images/Training_Images/vott-csv-export/Annotations-export.csv', 'w') as outfile:
    outfile.write(headers)
    for filename in os.listdir(directory):
        with open(directory + '/' + filename) as infile:
            for line in infile:
                outfile.write(line)
