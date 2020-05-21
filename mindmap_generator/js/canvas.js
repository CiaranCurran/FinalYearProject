var canvas = document.querySelector('canvas');
var canvasContainer = document.getElementById('canvas-container')
canvas.width = canvasContainer.offsetWidth;
canvas.height = canvasContainer.offsetHeight;
var cxt = canvas.getContext('2d');
var zip = new JSZip();
zip.folder("images");
zip.folder("boxes");
var zippedImages = 0;

function change_canvas_width() {
    canvas.width = document.getElementById('canvas_width').value;
    console.log("changed");
}

function change_canvas_height() {
    canvas.height = document.getElementById('canvas_height').value;
    console.log("changed");
}

function closest_points(box1, box2){
    if(Math.abs(box1.midpoint.x  - box2.midpoint.x)
        > Math.abs(box1.midpoint.y - box2.midpoint.y)){
        if(box1.midpoint.x > box2.midpoint.x){
            return {
                side1: {
                    x: box1.x, y: box1.y + box1.height/2
                },
                side2: {
                    x: box2.x + box2.width, y: box2.y + box2.height/2
                }
            };
        }
        else {
            return {
                side1: {
                    x: box2.x, y: box2.y + box2.height/2
                },
                side2: {
                    x: box1.x + box1.width, y: box1.y + box1.height/2
                }
            };
        }
    }
    else {
        if(box1.midpoint.y > box2.midpoint.y){
            return {
                side1: {
                    x: box1.x + box1.width/2, y: box1.y
                },
                side2: {
                    x: box2.x + box2.width/2, y: box2.y + box2.height
                }
            };
        }
        else{
            return {
                side1: {
                    x: box2.x + box2.width/2, y: box2.y
                },
                side2: {
                    x: box1.x + box1.width/2, y: box1.y + box1.height
                }
            };
        }
    }
}

class TextBox {
    constructor(x, y, text, padding=10, color="rgba(255,255,255,0)", textColor="#000000") {
        this.x = x;
        this.y = y;
        this.message = text;
        this.padding = padding;
        this.color = color;
        this.textColor = textColor;
        this.size = cxt.measureText(text);

        //calculate additional properties
        this.ascent = this.size.actualBoundingBoxAscent;
        this.descent = this.size.actualBoundingBoxDescent;
        this.height = this.ascent + this.descent;
        this.width = this.size.width;
        this.rect = {x: this.x - this.padding / 2, y: this.y - this.padding / 2,
            width: this.width + this.padding, height: this.height + this.padding};
        this.rect.midpoint = {x: this.rect.x + this.rect.width / 2, y: this.rect.y + this.rect.height / 2}
    }

    draw() {
        cxt.fillStyle = this.color;
        cxt.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        cxt.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        cxt.shadowOffsetX = 0;
        cxt.shadowOffsetY = 0;
        cxt.shadowBlur = 0;

        cxt.fillStyle = this.textColor;
        cxt.fillText(this.message, this.x, this.y + this.ascent);
    }
}

function drawLine(from, to){
    cxt.bezierCurveTo(to.x + 10, to.y + 10, to.x + 10, to.y + 10, to.x, to.y);
}

function joinBoxes(from, to){
    points = closest_points(from.rect, to.rect);
    bezier(points.side1, points.side2, 5, 10);
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMidPoint(rect){
    return {x: rect.x + rect.width/2, y: rect.y + rect.height/2};
}

function getRandomPoint(rect){
    return {
        x: rect.x + randInt(1, rect.width/2),
        y: rect.y + randInt(1, rect.height/2)
    };
}

//return a coordinate that lies on a circle of a given radius from given centre point
function random_point_on_circle(point, radius) {
    let alpha = (Math.random() * (2 * Math.PI));
    let x = radius * Math.cos(alpha);
    let y = radius * Math.sin(alpha);
    return {
        x: point.x + x,
        y: point.y + y
    };
}

function bezier(from, to, divide=3, width=10){
    let flipx1, flipx2, flipy1, flipy2 = 1;

    if(to.x >= from.x && to.y >= from.y){
        flipx1 = 1;
        flipy1 = -1;
        flipx2 = -1;
        flipy2 = 1;
    }else if(to.x >= from.x && to.y <= from.y){
        flipx1 = 1;
        flipy1 = 1;
        flipx2 = -1;
        flipy2 = -1;
    }else if(to.x <= from.x && to.y <= from.y){
        flipx1 = -1;
        flipy1 = 1;
        flipx2 = 1;
        flipy2 = -1;
    }else if(to.x <= from.x && to.y >= from.y){
        flipx1 = -1;
        flipy1 = -1;
        flipx2 = 1;
        flipy2 = 1;
    }

    //find mid line
    let diff = {
        x: to.x - from.x,
        y: to.y - from.y
    };

    //calculate distance orthogonal to line
    let sqd = Math.sqrt(Math.pow(width, 2)/2);

    let cp1 = {
        x: from.x + diff.x/divide + sqd*flipx1,
        y: from.y + diff.y/divide + sqd*flipy1
    };

    let cp2 = {
        x: from.x + (diff.x/divide)*(divide-1) + sqd*flipx2,
        y: from.y + (diff.y/divide)*(divide-1) + sqd*flipy2
    };


    cxt.strokeStyle = "#000000";

    cxt.beginPath();
    cxt.moveTo(from.x, from.y);
    cxt.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, to.x, to.y);
    cxt.stroke();
}

//return a coordinate that lies on a circle of a given radius from given centre point
function point_on_arc(point, radius, alpha) {
    let x = radius * Math.cos(-alpha);
    let y = radius * Math.sin(-alpha);
    return {
        x: point.x + x,
        y: point.y + y
    };
}

function render(map, imageNum){
    //draw root node
    midx = canvas.width/2;
    midy = canvas.height/2;

    root = new TextBox( canvas.width/2,  canvas.height/2, map[0].text);
    midx = root.rect.midpoint.x;
    midy = root.rect.midpoint.y;

    //select random background image then draw the background after the target has been set
    setImage(() => {
        let background = new Image();
        background.src = target.src;

        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function(){
            cxt.drawImage(background,0,0, canvas.width, canvas.height);
            root.draw();
            let boxes = "\"img_" + imageNum.toString() + ".png\"" + ","
                + (root.x).toString() + ","
                + (root.y).toString() + ","
                + (root.x + root.width).toString() + ","
                + (root.y + root.height).toString() + ","
                + "\"node\"" + "\n";
            draw_nodes_centered({x: midx, y:midy}, root, map[0].children, 0, Math.PI*2, 100);

            canvasToImage(imageNum);
            zip_boxes(boxes, imageNum);


            function draw_nodes_centered(centre, root, nodes, start, end, radius) {
                if(nodes.length == 0){
                    return;
                }
                let n = nodes.length;
                for(let i=0;i<n;i++) {
                    console.log(start, end);
                    let point = point_on_arc(
                        {x: centre.x, y: centre.y},
                        radius,
                        start + ((end - start)/n)/2 + i*((end - start)/n)
                    );
                    let node = new TextBox(point.x, point.y, nodes[i].text);

                    //add label for box: class 0 | x | y | width | height
                    if(node.x > 0 && node.y > 0
                        && node.x < canvas.width
                        && node.y < canvas.height
                        && (node.x + node.width) < canvas.width
                        && (node.y + node.height) < canvas.height) {
                        boxes = boxes
                            + "\"img_" + imageNum.toString() + ".png\"" + ","
                            + (node.x).toString() + ","
                            + (node.y).toString() + ","
                            + (node.x + node.width).toString() + ","
                            + (node.y + node.height).toString() + ","
                            + "\"node\"" + "\n";
                    }

                    joinBoxes(root, node);
                    node.draw();
                    let e = start + (i+1)*((end - start)/n);
                    let s = start + i*((end - start)/n);
                    draw_nodes_centered(centre, node, nodes[i].children, s, e, radius + randInt(80, 120));
                }
            }
        }
    });
}


function draw_nodes_centered(centre, root, nodes, start, end, radius) {
    if(nodes.length == 0){
        console.log("yuppereeee");
        zip_boxes(boxes, imageNum);
        return;
    }
    let n = nodes.length;
    for(let i=0;i<n;i++) {
        console.log(start, end);
        let point = point_on_arc(
            {x: centre.x, y: centre.y},
            radius,
            start + ((end - start)/n)/2 + i*((end - start)/n)
        );
        let node = new TextBox(point.x, point.y, nodes[i].text);

        //add label for box: class 0 | x | y | width | height
        boxes = boxes
            + "0 "
            + (node.rect.midpoint.x / canvas.width).toString() + " "
            + (node.rect.midpoint.y / canvas.height).toString() + " "
            + (node.rect.width / canvas.width).toString() + " "
            + (node.rect.height / canvas.height).toString() + "\n"

        joinBoxes(root, node);
        node.draw();
        let e = start + (i+1)*((end - start)/n);
        let s = start + i*((end - start)/n);
        console.log(start + ((end - start)/n)/2 + i*((end - start)/n));
        console.log(nodes[i].text + " was drawn at " +  (start + (((end - start)/n)/2 + i*((end - start)/n))) +
            "\n" + "It drew its children at s: " + s + " e: " + e);
        draw_nodes_centered(centre, node, nodes[i].children, s, e, radius + 100);
    }
}

function generateImage(text, imageNum){
    let mapText = generateTextSpecification(text);
    let eachLine = mapText.split('\n');
    let map = parseToMap(eachLine);
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    render(map, imageNum);
}

function parseToMap(eachLine, tabs=0) {
    let pttrn = /^\t*/;
    let nodes = [];

    //base case eachLine is empty
    if(eachLine == null){
        return
    }

    //base case: there is only one line
    let n = eachLine.length;
    if(n == 1){
        let node = {};
        node.text = eachLine[0].replace(/\t+/, "");
        node.children = [];
        nodes.push(node);
        return nodes;
    }

    //parse every line
    for(let i=0;i<n;i++){
        let len = eachLine[i].match(pttrn)[0].length;

        //skip line if it is is a level lower
        if(len > tabs){
            continue;
        }

        let node = {};
        node.text = eachLine[i].replace(/\t+/, "");
        node.children = [];

        let children = [];
        for(let j=i+1;j<n;j++){
            let len = eachLine[j].match(pttrn)[0].length;
            if(len >= tabs+1){
                children.push(eachLine[j]);
            }
            else {
                break;
            }
        }
        if(children.length > 0) {
            node.children = parseToMap(children, tabs + 1);
        }
        nodes.push(node);
    }
    return nodes;
}

function canvasToImage(imageNum){
    canvas.toBlob((blob) => zip_image(blob, imageNum));
}

function submit_click() {
    readTextFile((text) => {
        let numImages = document.getElementById('imagenum').value;
        for(let i=1; i<=numImages; i++){
            generateImage(text, i);
        }
    });

    setTimeout(function() { download_zip(); }, 60000);
}

function zip_image(image, image_number) {
    zip.folder("images").file("img_" + image_number.toString() + ".png", image);
    zippedImages += 1;
}

function zip_boxes(boxes, image_number) {
    console.log("BOX" + boxes);
    zip.folder("boxes").file("boxes_" + image_number.toString() + ".txt", boxes);
}

function download_zip() {
    zip.generateAsync({type:"blob"})
        .then(function(content) {
            // see FileSaver.js
            saveAs(content, "example.zip");
        });
}

function readTextFile(callback) {
    if(document.querySelector("#corpus-input").files.length == 0) {
        alert('Error : No file selected');
        return;
    }

    // first file selected by user
    var file = document.querySelector("#corpus-input").files[0];

    // perform validation on file type & size if required

    // read the file
    var reader = new FileReader();

    // file reading started
    reader.addEventListener('loadstart', function() {
        console.log('File reading started');
    });

    // file reading finished successfully
    reader.addEventListener('load', function(e) {
        // contents of file in variable
        var text = e.target.result;
        callback(text);
    });

    // file reading failed
    reader.addEventListener('error', function() {
        alert('Error : Failed to read file');
    });

    // file read progress
    reader.addEventListener('progress', function(e) {
        if(e.lengthComputable == true) {
            var percent_read = Math.floor((e.loaded/e.total)*100);
            console.log(percent_read + '% read');
        }
    });

    // read as text file
    reader.readAsText(file);

    return reader.result;
}

var folder = document.getElementById("image-input");

function setImage(callback) {
    var fr=new FileReader();

    // when image is loaded, set the src of the image where you want to display it
    fr.onload = function(e) {
        target.src = this.result;
        callback();
    };

    // fill fr with image data of a randomly selected image
    fr.readAsDataURL(folder.files[randInt(0, folder.files.length-1)]);
}

var target = document.getElementById("target");