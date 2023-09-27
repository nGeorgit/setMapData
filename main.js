
var collums = 200;//x

imageEl = document.getElementById('image');
var floorId
var floorName

var clickedNode = {x:null, y:null}
var makingLine = false
var lineOnX = null
var shiftDown = false

var cur_choice = 0// 0: null, 1: wall, 2: place, 3: stairs, 4: elevator

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
        "color": "red",
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
                id: Number(prompt("Entry id: "))
            }
        },
        "text": function(extra) {
            return extra.place + " (" + extra.id + ")"
        }
    },
    {
        "type": "stairs",
        "color": "green",
        "walkable": true,
        "change": function(e) {
            e.style.backgroundColor = this.color
            e.style.opacity = 0.6
        },
        "extra": function() {
            return {
                id: prompt("Entry id: "),
                level: prompt("Entry level: ")
            }
        },
        "text": function(extra) {
            return extra.id
        }
    },
    {
        "type": "elevator",
        "color": "greenyellow",
        "walkable": true,
        "change": function(e) {
            e.style.backgroundColor = this.color
            e.style.opacity = 0.6
        },
        "extra": function() {
            return {
                id: prompt("Entry id: "),
                level: prompt("Entry level: ")
            }
        },
        "text": function(extra) {
            return extra.id
        }
    },
        {
        "type": "door",
        "color": "LimeGreen",
        "walkable": true,
        "change": function(e) {
            e.style.backgroundColor = this.color
            e.style.opacity = 0.6
        },
        "extra": function() {
            return {
                id: prompt("Entry id: "),
                level: prompt("Entry side(1,0): ")
            }
        },
        "text": function(extra) {
            return extra.id
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
    if (event.key<=6 && event.key>=1) {
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

document.addEventListener("keydown", (event) => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
  if(event.keyCode==16){

    shiftDown = true
  }
});

document.addEventListener("keyup", (event) => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
  if(event.keyCode==16){

    makingLine = false
    clickedNode = {x:null, y:null}
    shiftDown = false
  }
});

function cordToId(x, y){
    return x + ',' + y
}

function idToCord(id){
    return id.split(',');
}

function clickNode(e)
{
    cord = idToCord(e.id)
    var x = cord[0]
    var y = cord[1]

    if(shiftDown)
    {
      if(!makingLine)
      {
        if(clickedNode.x == null)
        {
          clickedNode.x = x
          clickedNode.y = y
        }else
        {
          lineOnX = true
          if(clickedNode.y!=y)
          {
            lineOnX = false
          }
          makingLine = true
        }
        
      }
      if(lineOnX)
      {
        y = clickedNode.y
      } else
      {
        x = clickedNode.x
      }
    }

    console.log(x)
    e = document.getElementById(cordToId(x, y))
    types[cur_choice].change(e);
    nodes[x][y].type = types[cur_choice].type;
    nodes[x][y].extra = types[cur_choice].extra()
    nodes[x][y].walkable = types[cur_choice].walkable;
    e.innerHTML = types[cur_choice].text(nodes[x][y].extra)
}

fileInp.onchange = evt => {
  const [file] = fileInp.files
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(e) {
      JSONdata = e.target.result
      loadMapData = JSON.parse(JSONdata)
      loadData()
    }
  }
}

function loadData(){
  floorId = loadMapData.id
  floorName = loadMapData.name
  grid = loadMapData.grid
  nodeSize = loadMapData.nodeSize
  rows = loadMapData.rows//y
  collums = loadMapData.collums
  console.log(imageEl.clientWidth)
  console.log(nodeSize)
  resetBoard()
  nodes = new Array()
  for (let i = 0; i < collums; i++) {                    //we creat a list with all the nodes
      nodes[i] = new Array()
      for (let j =0; j < rows; j++) {       
          nodes[i][j] = {
              x: i,
              y: j,
              walkable: true,
              type: null,
              extra: null
          }
          if(grid[j][i]==0)
          {
            e = document.getElementById(cordToId(i, j))
            nodes[i][j].walkable = true
            types[1].change(e);
            nodes[i][j].type = types[1].type;
            nodes[i][j].walkable = types[1].walkable;
          }
      }
  }

  for(i in loadMapData.places)
  {
    x = loadMapData.places[i].cords.x
    y = loadMapData.places[i].cords.y

    e = document.getElementById(cordToId(x, y))

    types[2].change(e);
    nodes[x][y].type = types[2].type;
    nodes[x][y].extra = {
      place: loadMapData.places[i].name,
  }
    nodes[x][y].walkable = types[2].walkable;
    e.innerHTML = loadMapData.places[i].name
  }

  for(i in loadMapData.entries)
  {
    x = loadMapData.entries[i].cords.x
    y = loadMapData.entries[i].cords.y

    e = document.getElementById(cordToId(x, y))
    atype = 4
    console.log(loadMapData.entries.type)
    if(loadMapData.entries[i].type == "stairs")
    {
      atype = 3
    } else if (loadMapData.entries[i].type == "door")
    {
      atype = 5
    }
    types[atype].change(e);
    nodes[x][y].type = types[atype].type;
    nodes[x][y].extra = {
      id: loadMapData.entries[i].id,
      level: loadMapData.entries[i].level
    }
    nodes[x][y].walkable = types[atype].walkable;
    e.innerHTML = loadMapData.entries[i].id
  }
}

function setImage(){
  collums = document.getElementById("squareSize").value
  imageRatio = imageEl.clientHeight/image.clientWidth;
  nodeSize = imageEl.clientWidth/collums
  rows = collums*imageRatio;//y
  console.log(imageEl.clientWidth)
  console.log(nodeSize)

  nodes = new Array()
  for (let i = 0; i < collums; i++) {                    //we creat a list with all the nodes
      nodes[i] = new Array()
      for (let j =0; j < rows; j++) {       
          nodes[i][j] = {
              x: i,
              y: j,
              walkable: true,
              type: null,
              extra: null
          }
      }
  }

    resetBoard()
}



function resetBoard()
 {
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
              divCollume.id = cordToId(j, i);                 //add id
              divCollume.className = 'node'                  //add a class
              divCollume.style.width = nodeSize + 'px';        //set size
              divCollume.style.height = nodeSize + 'px';
              divCollume.addEventListener('mouseenter', (e) => {if(mouseDown==1 && (cur_choice==0 || cur_choice==1)) {clickNode(e.target)}})
              divCollume.addEventListener('mousedown', (e) => {clickNode(e.target)})
                
              divRow.appendChild(divCollume)
          }
          div.appendChild(divRow); 
      }
 }

function ForemData(nodes) {
  if (!(document.getElementById("check").checked))
  {
    floorId = document.getElementById("fileId").value
    floorName = document.getElementById("textInp").value
  }
  
  jsonData = {
      "name": floorName,
      "id": floorId,
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

          if (nodes[j][i].walkable) {
              grid[i][j] = 1;
          } else {
              grid[i][j] = 0;
          }

          if (nodes[j][i].type == "place") {
              places[placescount] = {
                  "name": nodes[j][i].extra.place,
                  "id": nodes[j][i].extra.id,
                  "cords": {
                      "y": nodes[j][i].y,
                      "x": nodes[j][i].x
                  }
              };
              placescount++
          }
          if (nodes[j][i].type == "elevator" || nodes[j][i].type == "stairs" || nodes[j][i].type == "door") {
              console.log(j)
              entries[entriescount] = {
                  "code": nodes[j][i].extra.id + "_" + nodes[j][i].extra.level + "_" + floorId,
                  "type": nodes[j][i].type,
                  "id": nodes[j][i].extra.id,
                  "level": nodes[j][i].extra.level,
                  "cords": {
                      "y": nodes[j][i].y,
                      "x": nodes[j][i].x
                  }
              }
              entriescount++
          }
      }

  }

  entriesDist(entries, grid);

  jsonData.grid = grid;
  jsonData.places = places;
  jsonData.entries = entries;

  return jsonData;
  
}

function exportToJsonFile() {
  json = ForemData(nodes);
  let dataStr = JSON.stringify(json);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  let exportFileDefaultName = json.id+'.json';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}


function entriesDist(entries, grid) {
    for (let i = 0; i < entries.length; i++){

        entries[i].costs = new Array();
        n = 0;
        for (let j = 0; j < entries.length; j++){
            if (!(i==j)) {

                entries[i].costs[n] = {
                    "id" : entries[j].id,
                    "cost" : findCost(grid, entries[i].cords.x, entries[i].cords.y, entries[j].cords.x, entries[j].cords.y)
                }
                n++;
            }
        }
    }
}

