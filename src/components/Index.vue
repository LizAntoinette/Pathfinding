<template>
<div class="row">
<div class="sidebar">
        <h1 class="mt-4">Pathfinding</h1>
        <h1> Visualizer</h1>
        <div class="grid-container mx-4 mt-3">
          <div class="button-div1 mx-3">
             <b-dropdown block class="ml-2 algobtn " :text="selectedItem" v-model="selectedItem">
                <b-dropdown-header id="unweighted">
                  Unweighted
                </b-dropdown-header>
                <b-dropdown-item-button @click="selectedItem = 'BFS'"  aria-describedby="unweighted">
                  BFS
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="selectedItem = 'DFS'"  aria-describedby="unweighted">
                  DFS
                </b-dropdown-item-button>
                <b-dropdown-header id="weighted">
                  Weighted
                </b-dropdown-header>
                <b-dropdown-item-button @click="selectedItem = 'Uniform Cost'"  aria-describedby="unweighted">
                  Uniform Cost
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="selectedItem = 'Greedy BFS'"  aria-describedby="unweighted">
                  Greedy BFS
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="selectedItem = 'A*'"  aria-describedby="unweighted">
                  A*
                </b-dropdown-item-button>
              
            </b-dropdown>
          </div>
          <div class="button-div2 ml-4 mr-2 mt-2">
             <input id="fileUpload" type="file" @change="onFileSelected" hidden>
             <b-button block  @click="chooseFiles()"  > Import Graph </b-button>
          </div>
          <div class="button-div3 mr-3 mt-2">
              <b-button block @click="savefile"> Save Graph </b-button>
          </div>
          <div class="button-div4">
             <h6 class="mt-3"> <b>Add to Graph </b></h6>
          </div>
          <div class="button-div5 ml-4 mr-2 mt-2">
              <b-button block class="btn btn-secondary" @click="addingVertex" >
                Vertex
              </b-button>
          </div>
          <div class="button-div6 mr-3 mt-2">
             <b-button block  class="btn btn-secondary" @click="addingConnection">
                Connection
              </b-button>
          </div>
          <!-- </div> -->
          <!-- <div class="button-div7"></div>
          <div class="button-div8"></div> -->
          <div class="button-div8 ml-3 mr-4">
             <b-button block class="btn ml-2 mr-3 btn-secondary" @click="runGraph">Visualize Algo</b-button>
          </div>
          <div class="button-div10 ml-3 mr-4">
             <b-button :disabled="cantrunShortPath" block class="btn ml-2 mr-3 btn-secondary" @click="getPath">Get the Path</b-button>
          </div>
          <div class="button-div9 ml-3 mr-4">
             <b-button block class="btn ml-2 mr-3 btn-secondary " @click="clearScreen">Clear Graph</b-button>
          </div>
          <!--  <div class="button-div7"> -->
            <b-form inline class="button-div7 mx-3 mb-2" > 
              <div class="button-div10 mx-2 ">
              
                  <label class="" for="start-node">Start node:</label>
                  <b-form-select
                    @change="changeColorStart"
                    id="start-node"
                    class=""
                    :options="optionsStartNode"
                    v-model="startNode"
                    :value="null"
                  ></b-form-select>
              </div>
              <div class="button-div11">
                <label class="" for="end-node">Goal node:</label>
                <b-form-select
                  id="end-node"
                  class=""
                  @change="changeColorGoal"
                  :options="optionsGoalNode"
                  v-model="goalNode"
                  :value="null"
                ></b-form-select>
              </div>
            </b-form>
         
        
          
        </div>
       
      
    </div>


    <div class="main container">
        <!-- <p> For the are viewers out there.. if you see this text, it means this is still under development. But you can view the algorithms, it's already done.. </p> -->
      
         <div class="row pt-4 ml-4">
            
             <b-card class="col-7 drawArea" id="drawArea" style="height: 35rem">
                <v-stage
                  :config="stageSize"
                  @click="handleClick"
                  ref="konva"
                  @mousedown="handleMouseDown"
                  @mouseup="handleMouseUp"
                  @mousemove="handleMouseMove"
                >
                <v-layer ref="layer">
                      <v-line
                        v-for="line in connections"
                        :key="line.id"
                        :config="{
                          stroke: 'black',
                          points: line.points,
                          id: line.id
                          
                        }"
                      />

                    <v-circle
                      
                      v-for="(item, index) in list"
                      :key="item.id"

                      :config="{
                        x: item.x,
                        y: item.y,
                        
                        radius: 15,
                        fill: '#a20417',
                        //draggable:true,
                        stroke: '#a20417',
                        strokeWidth: 2,
                        id:'circle'+index
                      }"
                    ></v-circle>
            <v-text
              v-for="(item, index) in list"
              :key="item.id"
              :config="{
                x: item.x + 11,
                y: item.y + 11,
                text: index,
                fontSize: 15,
                width: 300,
              }" 
            ></v-text>
            <v-text
              v-for="label in distances"
              :key="label.id"
              :config="{
                x: label.x,
                y: label.y,
                text: label.distance,
              }"
            />
            <p class="text-left">Click Vertex button and click here to add vertex</p>
            <!-- <v-text :key="label_txt" :config="{ text: 'Click Vertex button and click here to add vertex'}"/> -->
                  </v-layer>
                </v-stage>
             </b-card>
            
                <b-card class="col-4 ml-3" id="label" style="height: 35rem">
                    <div class="row box-top">

                       <h4>Graph Details</h4>
                       <button :disabled="cantPlayPrev" @click="prev"  class="btn btn-outline-secondary rounded-circle play-button push-top mr-2"> prev</button>
                       <button :disabled="cantPlayNext" @click="next" class="btn btn-outline-secondary rounded-circle play-button mr-3">next</button>
                       <!-- <button :disabled="disablePath" @click="getShortPath" class="btn btn-outline-secondary rounded-circle play-button">Get Path</button> -->
                    </div>
                    
                    <div>
                      <div class="row">
                        
                        <p>Adjacency Matrix</p>
                        
                      </div>
                      <table id="my-table">
                          
                          <tbody>
                            <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                              <td v-for="(cell, cellIndex) in row" :key="cellIndex" >{{ cell }}</td>
                            </tr>
                          </tbody>
                        </table>
                      <div class="row mt-3" id="distance-list">
                        <div class="ml-1">
                        
                          <p>Queue</p>
                          
                        </div>
                       
                        <table  class=" mt-4">
                          
                          <tbody>
                            <tr>
                              <td class="stack" v-for="cell in listNodes"  :key="cell">{{ cell }}</td>
                              <!-- <td v-for="(item, index) in listNodes" :key="item.id">{{ cell }}</td> -->
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="row mt-3" id="distance-list">
                        <div class="ml-1">
                        
                        <p>Output</p>
                        
                       </div>

                        <table  class=" mt-4">
                          
                          <tbody>
                            <tr>
                              <td class="stack" v-for="cell in outputNodes"  :key="cell">{{ cell }}</td>
                              <!-- <td v-for="(item, index) in listNodes" :key="item.id">{{ cell }}</td> -->
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                </b-card>

          

         </div>
         
        
    </div>

</div>
  
</template>
<script>
import Konva from "konva";
import {bfs} from '../algorithms/breadthFirstSearch';
import {dfs} from '../algorithms/depthFirstSearch';
import {greedyBFS} from '../algorithms/greedyBestFirstSearch';
import {astar} from '../algorithms/astar';
import {uniformCost} from '../algorithms/uniformCost';

export default {
  data() {
    return {
      file: null, 
      fileContents: null,
      objectUrl: null,
      grid: null,
      startNode: null,
      goalNode: null,
      prevStartNode: '',
      prevGoalNode:'',
      optionsStartNode:[],   
      list: [],
      edges: [],
      distances: [],
      connection: false,
      vertex: false,
      connections: [],
      drawingLine: false,
      runnableGraph: false,
      selectedItem: "Algorithms",
      coor: "",
      stageSize: {
          width: 200,
          height: 200,
        },
      tableData:[],
      theStage:[],
      //this is for the animation so no need to import it
      cantPlayPrev:true,
      cantPlayNext:true,
      cantrunShortPath:true,
      visitedCount: 0,
      visitedNodesInOrder: null, 
      calculatedPath: null,
      listNodes: [],
      outputNodes: []
    };
  },
  created: function() {
     this.initializeGrid();

     for (let i = 0; i < 12; i++) {
      let arr =[];
      for (let j = 0; j < 12; j++) {
       
        if(i==0 && j!=0){
          arr[j] = j-1;
        }
        else if(j==0 && i!=0 ){
          arr[j] = i-1;
        }
        else{
          arr[j] = "0";
        }
      }
      this.tableData.push(arr);
    }
    console.log(this.tableData);
    //  for (let i = 0; i < 22; i++) {
    //       // Create a new row
    //       const row = document.createElement('tr');
    //       for (let j = 0; j < 22; j++) {
    //         // Create a new cell and add it to the row
    //          cell = document.createElement('td');
    //         if(i==0 && j!=0){
    //           cell.textContent = j-1;
    //         }
    //         else if(j==0 && i!=0 ){
    //           cell.textContent = i-1;
    //         }
    //         else{
    //           cell.textContent = "0";
    //         }
            
    //         row.appendChild(cell);
    //       }
    //       // Add the row to the table
    //       document.getElementById('matrix').appendChild(row);
    //   }
  },
  mounted: function () {
    //For Dynamic Stage Size
    const container = document.querySelector(".drawArea");
    const observer = new ResizeObserver(() => {
      this.stageSize.width = container.offsetWidth;
      this.stageSize.height = container.offsetHeight;
    });
    observer.observe(container);

    
  },
 
  computed:{
   
    optionsGoalNode(){
        return this.optionsStartNode.filter((node) => {
            return node !== this.startNode;
        
        });
    },   
    // cellHasValue(){
    //      const cells = document.querySelector("td"); // Get all table cells
    //      return Array.from(cells).some(cell => cell.textContent.trim() == 0 );
    // }

    
  },

  
  methods: {
    
    addingConnection() {
      this.connection = !this.connection;
      this.vertex = false;
      
    },
    addingVertex() {
      this.connection = false;
      this.vertex = !this.vertex;
    },

    clearScreen() {

      console.log("this could work");
      this.grid= null;
      this.startNode= null;
      this.goalNode= null;
      this.prevStartNode= '';
      this.prevGoalNode='';
      this.optionsStartNode=[];   
      this.list= [];
      this.edges= [];
      this.distances= [];
      this.connection= false;
      this.vertex= false;
      this.connections= [];
      this.drawingLine= false;
      this.runnableGraph= false;
      this.selectedItem= "Algorithms";
      this.coor= "";

      const stage = this.$refs.konva.getStage();
      // Clear the stage to remove all children and reset properties
      stage.clear();
      
      
      // this.theStage.clear();
      this.theStage = []; 

      this.$forceUpdate();
      // Clear the file reference
      this.file = null;
      // Clear the file contents
      this.fileContents = null;
      // Revoke the object URL
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
      this.initializeGrid();
     


    },
    onFileSelected(event) {
      this.file = event.target.files[0];
      let result;

      if (!this.file) {
        return;
      }
      console.log("this works");
      this.objectUrl = URL.createObjectURL(this.file);

      const reader = new FileReader();
      reader.onload = (event) => {
        console.log("readerworks");
        this.fileContents = event.target.result;
       
        result = JSON.parse(this.fileContents);
        this.grid= result["grid"];
        this.startNode= result["startNode"];
        this.goalNode=  result["goalNode"];
        this.prevStartNode= result["prevStartNode"];
        this.prevGoalNode= result["prevGoalNode"];
        this.optionsStartNode= result["optionsStartNode"];   
        this.list= result["list"];
        this.edges= result["edges"];
        this.distances= result["distances"];
        this.connection= false;
        this.vertex= true;
        this.connections= result["connections"];
        this.drawingLine= result["drawingLine"];
        this.runnableGraph= result["runnableGraph"];
        this.selectedItem=  result["selectedItem"];
        this.coor= result["coor"];
        this.tableData = result["tableData"];
        this.theStage = Konva.Node.create(result["theStage"], 'drawArea');
      

        // this.theStage =new Konva.Stage(result["theStage"], 'drawArea');
       

        // Perform your desired action with the file contents here
      };
      reader.readAsText(this.file);

     
      
      
    },

    handleClick(evt) {
      if (this.vertex && this.list.length < 20) {
        console.log("this works circle");
        this.optionsStartNode.push(this.list.length);
        const stage = evt.target.getStage();
        const pos = stage.getPointerPosition();
        this.list.push(pos);
        this.theStage = stage;
        console.log("list");
        console.log(this.list);
      
      }
    },
    chooseFiles() {
        document.getElementById("fileUpload").click()
    },
    changeColorStart(){
        var tween;
       
        var id = "#circle"+this.startNode;
        
        console.log(id);
        const stage = this.theStage;
        if (tween) {
          tween.destroy();
        }

        console.log(stage);
       
        var shape = stage.findOne(id);
         

       

        if(this.prevStartNode !== ''){
          console.log(this.prevStartNode);
          var prevShape = stage.findOne(this.prevStartNode);
          tween = new Konva.Tween({
            node: prevShape,
            fill:"#a20417",
            stroke:"#a20417"
          }).play();
          
        }

        tween = new Konva.Tween({
          node: shape,
          fill:"#2f9c6e",
          stroke:"#2f9c6e"
        }).play();
        
        this.prevStartNode = id;

    },
    
    savefile(){

      let result = {
        grid: this.grid,
        startNode: this.startNode,
        goalNode: this.goalNode,
        prevStartNode: this.prevStartNode,
        prevGoalNode: this.prevGoalNode,
        optionsStartNode: this.optionsStartNode,   
        list: this.list,
        edges: this.edges,
        distances: this.distances,
        connection: this.connection,
        vertex: this.vertex,
        connections: this.connections,
        drawing: this.drawingLine,
        runnableGraph: this.runnableGraph,
        selectedItem: this.selectedItem,
        coor: this.coor,
        theStage: this.theStage,
        tableData: this.tableData
      }

     
      let data = JSON.stringify(result);
      const blob = new Blob([data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TheGraph.txt'); // Replace with your own filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);


      const stage = this.$refs.konva.$stage; // Get the Konva stage instance
      console.log(stage);
    },

   

    changeColorGoal(){
        var tween;
       
        var id = "#circle"+this.goalNode;
        console.log(id);
        const stage = this.theStage;

       
        var shape = stage.findOne(id);
         

        if (tween) {
          tween.destroy();
        } 
        
        if(this.prevGoalNode !== ''){
          var prevShape = stage.findOne(this.prevGoalNode);
          tween = new Konva.Tween({
            node: prevShape,
            fill:"#a20417",
            stroke:"#a20417"
          }).play();
         
        }

        tween = new Konva.Tween({
          node: shape,
          fill:"#004019",
          stroke:"#004019"
        }).play();
        
        this.prevGoalNode = id;
    },
    handleMouseDown(e) {
      if (this.connection) {
        const onCircle = e.target instanceof Konva.Circle;
        console.log(onCircle.id)
        if (!onCircle) {
          return;
        }
        this.drawingLine = true;
        this.connections.push({
          id: Date.now(),
          points: [e.target.x(), e.target.y()],
        });
      }
    },
    handleMouseMove(e) {
      if (this.connection) {
        if (!this.drawingLine) {
          return;
        }
        const pos = e.target.getStage().getPointerPosition();
        const lastLine = this.connections[this.connections.length - 1];
        lastLine.points = [
          lastLine.points[0],
          lastLine.points[1],
          pos.x,
          pos.y,
        ];
      }
    },
    handleMouseUp(e) {
      if (this.connection) {
        const onCircle = e.target instanceof Konva.Circle;
        if (!onCircle) {
          return;
        }
        this.drawingLine = false;
        const lastLine = this.connections[this.connections.length - 1];
        const indexOfPoint1 = this.list.findIndex(function (point) {
          return (
            point.x === lastLine.points[0] && point.y === lastLine.points[1]
          );
        });
        const indexOfPoint2 = this.list.findIndex(function (point) {
          return point.x === e.target.x() && point.y === e.target.y();
        });
        console.log("Point1 = " + indexOfPoint1 + " Point2 = " + indexOfPoint2);
        this.tableData[indexOfPoint1+1][indexOfPoint2+1] = 1;
        this.tableData[indexOfPoint2+1][indexOfPoint1+1] = 1;
        var dist = Math.sqrt(
          Math.pow(e.target.x() - lastLine.points[0], 2) +
            Math.pow(e.target.y() - lastLine.points[1], 2)
        );
        this.distances.push({
          id: Date.now(),
          distance: dist.toFixed(2),
          x:
            Math.min(e.target.x(), lastLine.points[0]) +
            Math.abs(e.target.x() - lastLine.points[0]) / 2 +
            4,
          y:
            Math.min(e.target.y(), lastLine.points[1]) +
            Math.abs(e.target.y() - lastLine.points[1]) / 2 +
            4,
        });
       
        this.grid[indexOfPoint1][indexOfPoint2] = this.createNode(indexOfPoint1, indexOfPoint2, dist.toFixed(2));
        this.grid[indexOfPoint2][indexOfPoint1] = this.createNode(indexOfPoint2, indexOfPoint1, dist.toFixed(2));
        console.log("CreatedLines");
        console.log(this.grid[indexOfPoint1][indexOfPoint2]);
        console.log(this.grid[indexOfPoint2][indexOfPoint1]);
      
        lastLine.id= "line"+indexOfPoint1+indexOfPoint2;
        lastLine.points = [
          lastLine.points[0],
          lastLine.points[1],
          e.target.x(),
          e.target.y(),
        ];
       
        if(this.connections.length < 2){
            this.runnableGraph = true
        }
        console.log("after making lines");
     
        console.log(this.grid[indexOfPoint1][indexOfPoint2]);
        console.log(this.grid[indexOfPoint2][indexOfPoint1]);
        console.log(this.grid);
     

      }
     

    },
    next(){
      if((this.visitedCount+1)<this.visitedNodesInOrder.length){
        this.visitedCount += 1;
        this.colorNode(this.visitedNodesInOrder[this.visitedCount], "#ed81c4");
        
        
        console.log("Adding next");
        console.log(this.visitedNodesInOrder[this.visitedCount]);
        
        //adding stack table
        if(this.selectedItem ==="BFS"){
          let item = null;
          const node = this.visitedNodesInOrder[this.visitedCount];
          // if(this.listNodes.includes(node.point1)){
          //   item = this.listNodes.shift();
          //   this.outputNodes.push(item);
          // }
          this.listNodes.push(node.point2);
          
         

        }
        
      }
      if(this.visitedCount > 1)
        this.cantPlayPrev = false;
      if(this.visitedCount >= this.visitedNodesInOrder.length-1){
        this.cantPlayNext = true;
        this.cantrunShortPath = false;

      }
      
        
      
    },
    prev(){
      if((this.visitedCount-1) >= 1){
        this.undoColorNode();
        this.visitedCount -= 1;
      }
      if(this.visitedCount <= 1)
        this.cantPlayPrev = true;

      if(this.visitedCount < this.visitedNodesInOrder.length-1){
        this.cantrunShortPath = true;

      }
    },

 
    createHeuristic(node){
       const size = this.list.length;
       const endNode= this.list[node];
       let heuristic = [];
       

       for(let i =0; i < size; i++){
         var dist = Math.sqrt(
            Math.pow(endNode.x - this.list[i].x, 2) +
              Math.pow(endNode.y - this.list[i].y, 2)
          );
         heuristic.push({node: i, hval: dist});
       }

       return heuristic;

    },
    initializeGrid(){
      const grid = [];
      for (let row = 0; row < 10; row++) {
        const currentRow = [];
        for (let col = 0; col < 10; col++) {
          currentRow.push(this.createNode(row, col, 0));
        }
        grid.push(currentRow);
      }
      this.grid = grid;
      console.log('This is the Initialized Grid');
      console.log(this.grid);
    },

    //
    createNode(x, y, dist){
      return {
        point1: x,
        point2: y,
        distance: dist,
        isVisited: false,
        previousNode: null,
        cost: {
                F: Infinity,
                G: Infinity,
                H: Infinity,
            },
      }

    },
    
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
      
      
      for (let i = 1; i < visitedNodesInOrder.length; i++) {
        
          setTimeout(() => {
                this.colorNode(visitedNodesInOrder[i], "#ed81c4");
          }, i*800);
         

        }
        setTimeout(() => {
                this.animateShortestPath(nodesInShortestPathOrder);
        }, visitedNodesInOrder.length*800);
        
    },

  colorNode(visitedNode, color){
          let stage = this.theStage;

          var connections = this.connections;
          const node = visitedNode;

          var idCircle = "#circle"+node.point2;
          console.log(idCircle);
          var shape = stage.findOne(idCircle);
          

          
          var idLine = "line"+node.point1+node.point2;
          var idLine2 = "line"+node.point2+node.point1;
          let idL =connections.filter(line => line.id === idLine|| line.id === idLine2);

        
          var idOfLine = "#"+idL[0].id;
          var line = stage.findOne(idOfLine);

        
          var tweenLine = new Konva.Tween({
              node: line,
              
              fill:color,
              stroke:color
          }).play();
          console.log("Line is working");
          
          var tweenShape = new Konva.Tween({
            node: shape,
        
            fill:color,
            stroke:color
          }).play();
         
         console.log("Shape is working");
  },

  undoColorNode( color){
          let stage = this.theStage;
          
          // let prevNode = this.visitedNodesInOrder[this.visitedCount-1]
          let visitedNode = this.visitedNodesInOrder[this.visitedCount]
         

          
          var connections = this.connections;
          const node = visitedNode;

          var idCircle = "#circle"+node.point2;
          console.log(idCircle);
          var shape = stage.findOne(idCircle);
          

          
          var idLine = "line"+node.point1+node.point2;
          var idLine2 = "line"+node.point2+node.point1;
          let idL =connections.filter(line => line.id === idLine|| line.id === idLine2);

        
          var idOfLine = "#"+idL[0].id;
          var line = stage.findOne(idOfLine);

        
          var tweenLine = new Konva.Tween({
              node: line,
              stroke: 'black',
          }).play();
          console.log("Line is working");
          
          var tweenShape = new Konva.Tween({
            node: shape,
        
            fill: '#a20417',
             //draggable:true,
            stroke: '#a20417',
          }).play();
         
         console.log("Shape is working");
        
  },

  animateShortestPath(nodesInShortestPathOrder) {
    
    for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
          
          setTimeout(() => {
                this.colorNode(nodesInShortestPathOrder[i], "#ed4255");
          }, i*500);
       
    }
  },
  getPath(){
    this.cantPlayPrev = false;
    for (let i = 1; i < this.calculatedPath.length; i++) {
          
          setTimeout(() => {
                this.colorNode(this.calculatedPath[i], "#ed4255");
          }, i*500);
       
    }
  },
    visualizeBFS(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       return bfs(this.grid, STARTNODE, GOALNODE, size);
       
      
    },
    visualizeDFS(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       return dfs(this.grid, STARTNODE, GOALNODE, size);
      
      
    },
    visualizeAStar(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const heuristic = this.createHeuristic(GOALNODE);
       return astar(this.grid, STARTNODE, GOALNODE, size, heuristic );

    },
    visualizeGreedyBFS(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const heuristic = this.createHeuristic(GOALNODE);
       return greedyBFS(this.grid, STARTNODE, GOALNODE, size, heuristic );
      
    },
    visualizeUniformCost(){
       const STARTNODE = this.grid[this.startNode][this.startNode];
       const GOALNODE = this.goalNode;
       const size = this.list.length;
       const heuristic = this.createHeuristic(GOALNODE);
       return uniformCost(this.grid, STARTNODE, GOALNODE, size, heuristic );
 
    },
  
    runGraph(){
       
       if(this.runnableGraph && this.selectedItem.trim()!=="Algorithms") {
          
          const item = this.selectedItem;
          if(item === "BFS"){
            [this.visitedNodesInOrder, this.calculatedPath] = this.visualizeBFS();
          }
          else if(item === "DFS"){
            [this.visitedNodesInOrder, this.calculatedPath] = this.visualizeDFS();
          }
          else if (item === "A*"){
            [this.visitedNodesInOrder, this.calculatedPath] =this.visualizeAStar();
          }
          else if (item === "Greedy BFS"){
            [this.visitedNodesInOrder, this.calculatedPath] = this.visualizeGreedyBFS();
          }
          else if (item === "Uniform Cost"){
            [this.visitedNodesInOrder, this.calculatedPath] = this.visualizeUniformCost();
          }

          // this.animateAlgorithm(this.visitedNodesInOrder, this.calculatedPath);

          this.cantPlayNext = false;

       }
    },

  }

}
</script>