from __future__ import print_function
import cv2 as cv
import numpy as np
import argparse
import random as rng
import os

rng.seed(12345)

def thresh_callback():
    boxes = ""
    canny_output = cv.Canny(src_gray, thresh_min, thresh_max)


    contours, _ = cv.findContours(canny_output, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

    count = 0

    contours_poly = [None]*len(contours)
    boundRect = []
    for i, c in enumerate(contours):
        contours_poly[i] = cv.approxPolyDP(c, 3, True)
        rect = cv.boundingRect(contours_poly[i])
        if(rect[2] > 30 and rect[2] < 200 and rect[3] > 15 and rect[3] < 50):
            boundRect.append(cv.boundingRect(contours_poly[i])) 
    
    for box in boundRect:
        boxes += "node " + "1 " + str(box[0]) + " " + str(box[1]) + " " + str(box[0] + box[2]) + " " + str(box[1] + box[3]) + "\n"

    return boxes


thresh_min = 100
thresh_max = 500


rootpath = './images/'
images = os.listdir(rootpath)

for image in images:
    filepath = rootpath + image
    src = cv.imread(cv.samples.findFile(filepath))
    # Convert image to gray and blur it
    src_gray = cv.cvtColor(src, cv.COLOR_BGR2GRAY)
    src_gray = cv.blur(src_gray, (3,3))

    box_estimates = thresh_callback()

    with open("./detection-results/" + image[:-4] + ".txt", "w") as text_file:
        text_file.write(box_estimates)

