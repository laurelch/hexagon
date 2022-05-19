let Mouse = Stage.Mouse;
const SQRT3 = Math.sqrt(3);
const W = 60; //width of whole hexagon
const PLAYER = 1;

function getPos(i, j){
    let x, y;
    if(i%2 == 0){
        x = i * 3/4 * W;
        y = j * SQRT3/2 * W;
    }else {
        x = i * 3/4 * W;
        y = SQRT3/4 * W + j * (SQRT3/2) * W;
    }
    return [x,y];
}

/**
 * Convert cell [x,y] to grid [x_g, y_g] for distance calculation,
 * cell [0, 0] -> grid [0, 0]
 * cell [1, 0] -> grid [2, 1]
 * @param {*} x 
 * @param {*} y 
 */
function cellToGrid(x, y){
    if(x%2 === 0) return [x*2, y*2];
    else return [x*2, y*2+1];
}

function manhattanDist(x1, y1, x2, y2){
    let p1 = cellToGrid(x1, y1);
    let p2 = cellToGrid(x2, y2);
    return (Math.abs(p1[0]-p2[0])+Math.abs(p1[1]-p2[1]))/2;
}

function Game(ui, width, height){
    this.world = planck.World();
    let grid = [];
    let player;
    let coloredCells = {
        route: [],
        attack: []
    };

    this.start = function(){
        for(let i = 0; i < width; i ++){
            for(let j = 0; j < height; j++){
                new Hexagon(i,j).insert(i,j);
            }
        }
        new Character(PLAYER).insert();
    }

    // let globalTime = 0;
    // this.tick = function(dt){
    //     globalTime += dt;
    // }

    this.handleKeys = function(){
        if(ui.active_keys.ArrowLeft || ui.active_keys.a){
            console.log("Key pressed: <- or A");
        }
        if(ui.active_keys.ArrowRight || ui.active_keys.d){
            console.log("Key pressed: -> or D");
        }
        if(ui.active_keys.ArrowUp || ui.active_keys.w){
            console.log("Key pressed: Up or W");
        }
        if(ui.active_keys.ArrowDown || ui.active_keys.s){
            console.log("Key pressed: Down or S");
        }
        if(ui.active_keys.Tab){
            console.log("Key pressed: tab");
        }
        if(ui.active_keys){

        }
    }

    function Hexagon(i,j){
        this.i = i;
        this.j = j;
        this.ui = ui.hex(this);
        this.click = function(){
            // console.log("hexagon clicked - ", this.i, "-", this.j);
            playerMove(this.i, this.j);
            findCellsWithDist(this.i, this.j, 1, 1);
        }
    }

    Hexagon.prototype.insert = function(i, j){
        // setHexagon(i, j, this);
        grid.push(this);
        this.ui.add();
    }

    /**
     * Move player from original to goal with cells colored
     * @param {number} i 
     * @param {number} j 
     */
    function playerMove(i, j){
        // move player to the clicked hexagon
        let route = player.route(i, j);
        // console.log(route);
        for(let r = 0; r < route.length; r++){
            // color cells in the route
            let hex = new ColoredHexagon();
            coloredCells.route.push(hex);
            colorHex = coloredCells.route[r];
            colorHex.move(route[r][0],route[r][1]);
            colorHex.ui.add();
            // move player to cells in the route one by one
            setTimeout(()=>{
                player.move(route[r][0], route[r][1]);
            }, r*500)
        }
        // clear all colored cells after arrival
        setTimeout(()=>{
            clearColoredCells("route");
        }, route.length*500)
    }

    /**
     * Returns neighbors of one hexagon cell
     * @param {number} i 
     * @param {number} j 
     * @returns array of neighbors [i,j]
     */
    function neighbors(i, j){
        let neighbors = [];
        // top-left, top, top-right, bottom-left, bottom, bottom-right
        let i_list = [-1,0,1,-1,0,1];
        let j_list = [];
        i % 2 == 0 ? j_list = [-1,-1,-1,0,1,0] : j_list = [0,-1,0,1,1,1];
        for(let n = 0; n < 6; n++){
            let new_i = i + i_list[n];
            if(new_i < 0) continue;
            let new_j = j + j_list[n];
            if(new_j < 0) continue;
            neighbors.push([new_i,new_j]);
        }
        return neighbors;
    }

    function Character(identity){
        this.identity = identity;
        this.position = [0, 0];
        this.ui = ui.circle(this);
        this.move = function(i, j){
            this.position[0] = i;
            this.position[1] = j;
            this.ui.move();
        }
        // shortest route from current position to target (i, j)
        this.route = function(i, j){
            let route = [];
            let ci = this.position[0];
            let cj = this.position[1];
            route.push([ci,cj]);
            let dist = manhattanDist(ci,cj,i,j);
            while(dist > 0){
                let dists = [];
                let ns = neighbors(ci, cj);
                for(let n = 0; n < ns.length; n++){
                    dists.push(manhattanDist(ns[n][0],ns[n][1],i,j));
                }
                // console.log("dists - ",dists);
                let next_i = dists.indexOf(Math.min(...dists));
                let next = ns[next_i];
                route.push(next);
                ci = next[0];
                cj = next[1];
                dist = manhattanDist(ci,cj,i,j);
            }
            // console.log(route);
            return route;
        }
    }

    Character.prototype.insert = function(){
        player = this;
        this.ui.add();
    }

    function ColoredHexagon(color = "red"){
        this.i = 0;
        this.j = 0;
        this.move = function(i, j){
            this.i = i;
            this.j = j;
        }
        this.changeColor = function(color){
            this.ui = ui.hex_color(this, color);
        }
        this.changeColor(color);
        // coloredCells.route.push(this);
    }

    function clearColoredCells(type="route"){
        if(type === "route"){
            for(let i = 0; i < coloredCells.route.length; i++){
                coloredCells.route[i].ui.remove();
            }
            coloredCells.route=[];
        }
    }

    /**
     * Find cells within the range of distance (near to far)
     * @param {*} i 
     * @param {*} j 
     * @param {*} near 
     * @param {*} far 
     * @returns
     */
    function findCellsWithDist(i, j, near, far){
        let d = near;
        let cells = []; // neighbors near to far
        cells.push([i,j]);
        let dist_index = [];
        dist_index.push(0);
        while(d <= far){
            dist_index.push(cells.length);
            let current = neighbors(i, j);
            for(let c = 0; c < current.length; c++){
                let cur = current[c];
                if(!cells.includes(cur)) cells.push(cur);
            }
            d++;
        }
        // console.log("findCellsWithDist - ",cells,dist_index);
        return {
            cells:cells,
            dist:dist_index
        };
    }
}

Stage(function(stage){
    let active_keys = {};
    let KEY_NAMES = {
        "Space": false,
        "Tab": false,
        "ArrowUp": false,
        "ArrowLeft": false,
        "ArrowRight": false,
        "ArrowDown": false,
        "w": false,
        "a": false,
        "s": false,
        "d": false
    }

    stage.background('#eeeeee');
    stage.viewbox(500, 500);
    let width = 22, height = 9;

    let board = Stage.create().appendTo(stage).pin({
        width: width,
        height: height,
        align: 0.01
    });

    let game = new Game({
        active_keys: active_keys,
        hex: function(hex){
            let img = Stage.image("hex-bg").pin({
                align: 0
            }).on(Mouse.CLICK, function(point){
                hex.click();
                console.log("game click");
            });
            return {
                add: function(){
                    // console.log("add -", hex.i, "-", hex.j);
                    let [x, y] = getPos(hex.i, hex.j);
                    img.appendTo(board).offset(x, y);
                }
            }
        },
        circle: function(circle){
            let img = Stage.image("o").pin({
                align: 0
            });
            return {
                add: function(){
                    // console.log("add circle");
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                },
                move: function(){
                    // console.log("move circle");
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                }
            }
        },
        hex_color: function(hex, color){
            let img_name = "hex-"+color; // red, yellow, green, blue
            let img = Stage.image(img_name).pin({
                align: 0
            })
            return {
                add: function(){
                    console.log("add color hex");
                    let [x, y] = getPos(hex.i, hex.j);
                    img.appendTo(board).offset(x, y);
                },
                remove: function(){
                    board.remove(img);
                }
            }
        }
    }, width, height);

    let world, meta;

    stage.on('viewport', function(size) {
        meta.pin({
          scaleMode : 'in-pad',
          scaleWidth : size.width,
          scaleHeight : size.height
        });
        world.pin({
          scaleMode : 'in-pad',
          scaleWidth : size.width,
          scaleHeight : size.height
        });
      });

    world = new Stage
        .planck(game.world, { ratio: 80 })
        .pin({
            handle : -0.5,
            width : width,
            height : height
        })
        .appendTo(stage);

    // stage.tick(game.tick);

    meta = Stage
        .create()
        .pin({ width : 1000, height : 1000 })
        .appendTo(stage);

    document.onkeydown = function(evt){
        evt.preventDefault();
        if(KEY_NAMES.hasOwnProperty(evt.key)){
            let key = evt.key;
            if(key === " ") key = "Space";
            active_keys[evt.key] = true;
            game.handleKeys();
        }
    }

    document.onkeyup = function(evt){
        let key = evt.key;
        if(key === " ") key = "Space"
        active_keys[key] = false;
    }

    game.start();
});