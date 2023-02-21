
var collums = 100;

imageEl = document.getElementById('image');

var cur_choice = 0// 0: null, 1: wall, 2: place, 3: entry

var types = [
    {
        "type": null,
        "color": "black",
        "walkable": true,
        "change": function(e) {
            e.style.backgroundColor = this.color
            e.style.opacity = 0.2
        },
        "extra": function() {
            return null
        },
        "text": function(extra){
            return null
        }
    },
    {
        "type": "wall",
        "color": "black",
        "walkable": false,
        "change": function(e) {
            e.style.backgroundColor = this.color
            e.style.opacity = 0.6

        },
        "extra": function() {
            return null
        },
        "text": function(extra){
            return null
        }
    },
    {
        "type": "place",
        "color": 'yellow',
        "walkable": true,
        "change": function(e) {
            e.style.backgroundColor = this.color
            e.style.opacity = 0.6
        },
        "extra": function() {
            return {
                place: prompt("Place name:"),
            }
        },
        "text": function(extra) {
            return extra.place
        }
    },
    {
        "type": "entry",
        "color": "green",
        "walkable": true,
        "change": function(e) {
            e.style.backgroundColor = this.color
            e.style.opacity = 0.6
        },
        "extra": function() {
            return {
                entryTo: prompt("Entry to building: "),
                num: prompt("Entry num: ")
            }
        },
        "text": function(extra) {
            return extra.entryTo + "," + extra.num
        }
    }
]



imgInp.onchange = evt => {
    const [file] = imgInp.files
    if (file) {
      imageEl.src = URL.createObjectURL(file)
      
    }
    
    }

var btn = document.getElementById(
        "btn").onclick = function() {
            setImage()
        }

document.addEventListener("keydown", (event) => {
    if (event.key<=4 && event.key>=1) {
        cur_choice = event.key - 1
        document.getElementById('choice').innerHTML = types[cur_choice].type + "(" + event.key + ")"
    }
    
});

var mouseDown
function logButtons(e) {
  if (e.buttons==1){
    mouseDown = 1
  } else {
    mouseDown = 0
  }
}

document.addEventListener('mouseup', logButtons);
document.addEventListener('mousedown', logButtons);





function cordToId(x, y){
    return x + ',' + y
}

function idToCord(id){
    return id.split(',');
}

function clickNode(e)
{
    cord = idToCord(e.id)
    x = cord[1]
    y = cord[0]

    types[cur_choice].change(e);
    nodes[x][y].type = types[cur_choice].type;
    nodes[x][y].extra = types[cur_choice].extra()
    nodes[x][y].walkable = types[cur_choice].walkable;
    e.innerHTML = types[cur_choice].text(nodes[x][y].extra)
}



function setImage(){

    imageRatio = imageEl.clientHeight/image.clientWidth;
    nodeSize = imageEl.clientWidth/collums
    rows = collums*imageRatio;
    console.log(imageEl.clientWidth)
    console.log(nodeSize)

    nodes = new Array();
    for (let i = 0; i < rows; i++) {                    //we creat a list with all the nodes
        nodes[i] = new Array();
        for (let j =0; j < collums; j++) {       
            nodes[i][j] = {
                x: j,
                y: i,
                walkable: true,
                type: null,
                extra: null
            }
        }
    }

        //Append the nodes at the DOM
    var div = document.getElementById('nodes');
    var child = div.lastElementChild; 
    while (child) {
        div.removeChild(child);
        child = div.lastElementChild;
    }

    //loop through the nodes list
    for (let i = 0; i < rows; i++) {    
        let divRow = document.createElement("DIV")           //create the row(div with class: 'container')
        divRow.className = 'row'                      //add a class 
        for (let j =0; j < collums; j++) {       
            let divCollume = document.createElement("DIV")   //create the collum(div with id: 'y,x' and class: 'node')
            divCollume.id = cordToId(nodes[i][j].x, nodes[i][j].y);                 //add id
            divCollume.className = 'node'                  //add a class
            divCollume.style.width = nodeSize + 'px';        //set size
            divCollume.style.height = nodeSize + 'px';
            divCollume.addEventListener('mouseenter', (e) => {if(mouseDown==1 && (cur_choice==0 || cur_choice==1)) {clickNode(e.path[0])}})
            divCollume.addEventListener('mousedown', (e) => {clickNode(e.path[0])})
              
            divRow.appendChild(divCollume)
        }
        div.appendChild(divRow); 
    }
    
    
 }

function ForemData(nodes) {
    jsonData = {
        "name": document.getElementById("textInp").value,
        "res": {
            "width": imageEl.clientWidth,
            "height": imageEl.clientHeight
        },
        "collums": collums,
        "rows": rows,
        "nodeSize": nodeSize,
        "grid": null,
        "places": null,
        "entries": null
    }

    grid = new Array();
    places = new Array();
    placescount = 0;
    entries = new Array();
    entriescount = 0;
    for (let i = 0; i < rows; i++){
        grid[i] = new Array()
        for (let j =0; j < collums; j++){
            if (nodes[i][j].walkable) {
                grid[i][j] = 1;
            } else {
                grid[i][j] = 0;
            }

            if (nodes[i][j].type == "place") {
                places[placescount] = {
                    "name": nodes[i][j].extra.place,
                    "cords": {
                        "y": nodes[i][j].y,
                        "x": nodes[i][j].x
                    }
                };
                placescount++
            }

            if (nodes[i][j].type == "entry") {
                entries[entriescount] = {
                    "entryTo": nodes[i][j].extra.entryTo,
                    "num": nodes[i][j].extra.num,
                    "cords": {
                        "y": nodes[i][j].y,
                        "x": nodes[i][j].x
                    }
                }
                entriescount++
            }
        }

    }
    jsonData.grid = grid;
    jsonData.places = places;
    jsonData.entries = entries;

    return jsonData;
    
}

 function exportToJsonFile() {
    json = ForemData(nodes);
    let dataStr = JSON.stringify(json);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = json.name+'.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
 }