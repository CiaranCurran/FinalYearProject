import os

#takes mindmap generator box plots and converts them to format: classname | xmin | ymin | xmax | ymax
rootpath = './input/boxes/'
boxfiles = os.listdir(rootpath)

for boxfile in boxfiles:
    reformatted = ""

    filepath = rootpath + boxfile

    with open(filepath, 'r') as text_file:
        lines = text_file.readlines()
        for line in lines:
            tokens = line.split(",")
            reformatted += "node " + tokens[1] + " " + tokens[2] + " " + tokens[3] + " " + tokens[4] + "\n"

    with open("./input/ground-truth-boxes/" + "img_" + boxfile[6:] , "w") as text_file:
        text_file.write(reformatted)
