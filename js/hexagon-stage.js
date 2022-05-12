let Mouse = Stage.Mouse;
const SQRT3 = Math.sqrt(3);
const W = 60; //width of whole hexagon

function Game(ui,width,height){
    let grid = [];
    let gridMap = {};
    this.start = function(){
        for(let i = 0; i < width; i ++){
            for(let j = 0; j < height; j++){
                new Hexagon(i,j).insert(i,j);
            }
        }
    }
    
    this.click = function(hex){
        console.log("hexagon clicked - ",hex.i,"-",hex.j);
    }

    function Hexagon(i,j){
        this.i = i;
        this.j = j;
        this.ui = ui.hex(this);
    }

    Hexagon.prototype.insert = function(i, j) {
        setHexagon(i, j, this);
        grid.push(this);
        this.ui.add();
    }

    function setHexagon(i, j, hex) {
        if (gridMap[i + ':' + j]) {
          console.log('Location unavailable: ' + i + ':' + j);
          return;
        }
        gridMap[i + ':' + j] = hex;
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
            let img = Stage.image('hex').pin({
                align: 0
            }).on(Mouse.CLICK, function(point) {
                game.click(hex);
                console.log("game click");
            });
            return {
                add : function() {
                    console.log("add -",hex.i,"-",hex.j);
                    // img.appendTo(board).offset(hex.i * 2 + 1, hex.j * 2 + 1);
                    if(hex.i%2==0){
                        img.appendTo(board).offset(hex.i * 3/4 * W, hex.j * SQRT3/2 * W);
                    }else if(hex.i%2==1){
                        img.appendTo(board).offset(hex.i * 3/4 * W, SQRT3/4 * W + hex.j * (SQRT3/2) * W);
                    }
                }
            }
        }
    }, width, height);

    game.start();
  });

// https://github.com/shakiba/stage.js/blob/master/example/game-tictactoe/app.js
Stage({
    textures : {
        "hex": Stage.canvas(function(ctx) {
            let width = W, height = width;                         
            this.size(width, height, 4);
            ctx.scale(4, 4);
            // draw hexagon
            ctx.translate(width/2, height/2);
            ctx.beginPath();
            let s=60*Math.PI/180; //60 deg in radians
            for(let i=0;i<=6;i++) {
                let rad=-i*s;
                ctx.lineTo(width/2*Math.cos(rad),height/2*Math.sin(rad));
            }
            ctx.fillStyle = '#eee';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        })
    }
});