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

function manhattanDist(x1, y1, x2, y2){
    return Math.abs(x1-x2)+Math.abs(y1-y2);
}


function Game(ui, width, height){
    let grid = [];
    let player;
    // let gridMap = {};

    this.start = function(){
        for(let i = 0; i < width; i ++){
            for(let j = 0; j < height; j++){
                new Hexagon(i,j).insert(i,j);
            }
        }
        new Character(PLAYER).insert();
    }

    function Hexagon(i,j){
        this.i = i;
        this.j = j;
        this.ui = ui.hex(this);
        this.click = function(){
            console.log("hexagon clicked - ", this.i, "-", this.j);
            let route = player.route(this.i, this.j);
            console.log(route);
            for(let r = 0; r < route.length; r++){
                setTimeout(()=>{
                    player.move(route[r][0], route[r][1]);
                }, r*500)
            }
        }
    }

    Hexagon.prototype.insert = function(i, j){
        // setHexagon(i, j, this);
        grid.push(this);
        this.ui.add();
    }

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
            let dist = manhattanDist(ci,cj,i,j);
            while(dist > 0){
                let dists = [];
                let ns = neighbors(ci, cj);
                for(let n = 0; n < ns.length; n++){
                    dists.push(manhattanDist(ns[n][0],ns[n][1],i,j));
                }
                let next_i = dists.indexOf(Math.min(...dists));
                let next = ns[next_i];
                route.push(next);
                ci = next[0];
                cj = next[1];
                dist = manhattanDist(ci,cj,i,j);
            }
            console.log(route);
            return route;
        }
    }

    Character.prototype.insert = function(){
        player = this;
        this.ui.add();
    }
}

Stage(function(stage){
    stage.background('#eeeeee');
    stage.viewbox(500, 500);
    let width = 22, height = 9;

    let board = Stage.create().appendTo(stage).pin({
        width: width,
        height: height,
        align: 0.01
    });

    let game = new Game({
        hex: function(hex){
            let img = Stage.image("hex").pin({
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
                align:0
            });
            return {
                add: function(){
                    console.log("add circle");
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                },
                move: function(){
                    console.log("move circle");
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                    console.log("Delayed for 100 millisecond.");
                }
            }
        }
    }, width, height);

    game.start();
});