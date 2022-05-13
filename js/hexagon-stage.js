let Mouse = Stage.Mouse;
const SQRT3 = Math.sqrt(3);
const W = 60; //width of whole hexagon
const PLAYER = 1;

function getPos(i, j){
    let x, y;
    if(i%2 == 0){
        x = i * 3/4 * W;
        y = j * SQRT3/2 * W;
    }else{
        x = i * 3/4 * W;
        y = SQRT3/4 * W + j * (SQRT3/2) * W;
    }
    return [x,y];
}

function Game(ui,width,height){
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
        this.click = function(hex){
            console.log("hexagon clicked - ", hex.i, "-", hex.j);
            player.move(hex.i, hex.j);
        }
    }

    Hexagon.prototype.insert = function(i, j) {
        // setHexagon(i, j, this);
        grid.push(this);
        this.ui.add();
    }

    function Character(identity) {
        this.identity = identity;
        this.position = [0, 0];
        this.ui = ui.circle(this);
        this.move = function(i, j) {
            this.position[0] = i;
            this.position[1] = j;
            this.ui.move();
        }
    }

    Character.prototype.insert = function(){
        player = this;
        this.ui.add();
    }
}

Stage(function(stage) {
    stage.background('#eeeeee');
    stage.viewbox(500, 500);
    let width = 10, height = 5;

    let board = Stage.create().appendTo(stage).pin({
        width : width,
        height : height,
        align : 0.01
    });

    let game = new Game({
        hex : function(hex) {
            let img = Stage.image("hex").pin({
                align: 0
            }).on(Mouse.CLICK, function(point) {
                hex.click(hex);
                console.log("game click");
            });
            return {
                add : function() {
                    console.log("add -", hex.i, "-", hex.j);
                    let [x, y] = getPos(hex.i, hex.j);
                    img.appendTo(board).offset(x, y);
                }
            }
        },
        circle: function(circle) {
            let img = Stage.image("o").pin({
                align:0
            });
            return {
                add : function() {
                    console.log("add circle");
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                },
                move: function() {
                    img.remove();
                    console.log("move circle");
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                }
            }
        }
    }, width, height);

    game.start();
});