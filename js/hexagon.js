window.onload = init;
let ctx;
const sqrt3=Math.sqrt(3);

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawHexagonGrid(100,100);
}

/**
 * Draws hexagon with center point (x, y), radius r, and degree d 
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} r
 * @param {number} d
 */
 function drawHexagon(x,y,r=60,d=0){
    ctx.beginPath();
    s = 60*Math.PI/180; //60 deg in radians
    d = d*Math.PI/180; //d=0 hexagon will be flat, d=30 hexagon will be sharp
    for (var i = 0; i < 6; i++) {
        rad = d-i*s;
        ctx.lineTo(x+r*Math.cos(rad),y+r*Math.sin(rad));
    }
    ctx.closePath();
    ctx.stroke();    
}

/**
 * Draws hexagon grid with top-left hexagon cell center point (x, y),
 * radius r
 * 
 * @param {number} x 
 * @param {number} y
 * @param {number} r
 */
function drawHexagonGrid(x,y,r=60){
    max_x=window.innerWidth/(2*r)+2;
    max_y=window.innerHeight/(2*r)-1;
    for(let j=0;j<max_y;j++){
        for(let i=0;i<max_x;i++){
            hex_x=x+(1.5*i)*r;
            hex_y=y+2*j*r*sqrt3/2+(i%2)*r*sqrt3/2;
            drawHexagon(hex_x,hex_y);
        }
    }
}

function init() {
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    window.addEventListener('resize',resizeCanvas,false);
    drawHexagonGrid(100,100);
}