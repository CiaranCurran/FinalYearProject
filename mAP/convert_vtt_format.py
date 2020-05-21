import os
import csv

#takes mindmap generator box plots and converts them to format: classname | xmin | ymin | xmax | ymax
resultspath = './input/Annotations-export.csv'

with open(resultspath, newline='') as csvfile:
    boxes = ""
    results = csv.reader(csvfile, delimiter=',')
    next(results, None)  # skip the headers

    rows = {}
    for row in results:
        rows[row[0]] = rows.get(row[0], "") + "node " + row[1] + " " + row[2] + " " + row[3] + " " + row[4] + "\n"

    for key, value in rows.items():
        with open("./input/reformatted/" + key[:-4] + ".txt", "w") as text_file:
            text_file.write(value)












#     filepath = rootpath + boxfile
#
#     with open(filepath, 'r') as text_file:
#         lines = text_file.readlines()
#         for line in lines:
#             tokens = line.split(",")
#             reformatted += "node " + tokens[1] + " " + tokens[2] + " " + tokens[3] + " " + tokens[4] + "\n"
#
#     with open("./input/ground-truth-boxes/" + "img_" + boxfile[6:] , "w") as text_file:
#         text_file.write(reformatted)
