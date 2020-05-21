# Final Year Project

This repository contains the code produced as part of COMP30910-FYP

The core contribution is found in [mindmap_generator](https://github.com/CiaranCurran/FinalYearProject/tree/master/mindmap_generator) which contains the browser-based application that generates synthetic mind-maps. To run this application in your browser simply clone this directory and open the index.html file in your browser. It is recommended that you use a modern up-to-date browser such as firefox or chrome. 

[contour_detection](https://github.com/CiaranCurran/FinalYearProject/tree/master/contour_detection) contains the contour approximation algorithm which generates bounding boxes based on polygon approximations. 

The following directories were forked from existing opensource projects, they are included here as they were used in the pipeline of training and evaluation of the algorithms used throughout this project:

* The [yolo](https://github.com/CiaranCurran/FinalYearProject/tree/master/yolo/TrainYourOwnYOLO) directory contains a forked version of [TrainYourOwnYolo](https://github.com/AntonMu/TrainYourOwnYOLO), an opensourced pipeline for training a pre-implemented YOLOv3 algorithm. Additional scripts such as merge_annotations.py were created in order to manipulate or reformat data for the necessary steps in the pipeline. 

* The [mAP](https://github.com/CiaranCurran/FinalYearProject/tree/master/mAP) directory contains a forked version of the opensource project [mAP](https://github.com/Cartucho/mAP) which calculates mean average precision for multi-class object predictions against ground-truth coordinates. This project was used to evaluate the performance of the algorithms used to predict bounding box coordinates for mindmap nodes. 

The results directory contains outputs from the mAP scripts which are included here to demonstrate the comparison of predicted bounding boxes to ground-truth bounding boxes for both the YOLOv3 algorithm and the contour detection algorithm.


A requirements.txt is included to produce the necassary virtual environment for running the python scripts in this project. 
