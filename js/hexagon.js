window.onload = init;
let ctx;
let canvas;
const SQRT3=Math.sqrt(3);
const R=60;
const MIN_X=100;
const MIN_Y=100;

function resizeCanvas(canvas){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawHexagonGrid(100,100);
}

function clearContext(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getHexPos(i,j){
    return [MIN_X+(1.5*i)*R, MIN_Y+2*j*R*SQRT3/2+(i%2)*R*SQRT3/2];
}

/**
 * Draws hexagon with center point (x, y), radius r, and degree d
 * 
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {number} d
 */
function drawHexagon(i,j,r=60,d=0){
    [x,y]=getHexPos(i,j);
    ctx.beginPath();
    s=60*Math.PI/180; //60 deg in radians
    d=d*Math.PI/180; //d=0 hexagon will be flat, d=30 hexagon will be sharp
    for(let i=0;i<6;i++) {
        rad=d-i*s;
        ctx.lineTo(x+r*Math.cos(rad),y+r*Math.sin(rad));
    }
    ctx.closePath();
    ctx.stroke();
}

/**
 * Draws hexagon grid
 */
function drawHexagonGrid(){
    clearContext();
    max_x=window.innerWidth/(SQRT3*R)+1;
    max_y=window.innerHeight/(2*R)+1;
    for(let j=0;j<max_y;j++){
        for(let i=0;i<max_x;i++){
            drawHexagon(i,j);
        }
    }
}

function dist([x1,y1],[x2,y2]){
    return Math.hypot(x1-x2,y1-y2);
}

/**
 * Returns hexagon index [i,j] of any point in canvas
 * @param {number} x 
 * @param {number} y 
 */
function getHexIndex(x,y){
    let group_i=Math.floor((x-MIN_X)/(SQRT3*R));
    let group_j=Math.floor((y-MIN_Y)/(2*R));
    let hexs=[];
    if(group_i%2==0){
        hexs.push(group_i,group_j);
        hexs.push(group_i+1,group_j);
        hexs.push(group_i,group_j+1);
    }else{
        hexs.push(group_i,group_j);
        hexs.push(group_i,group_j+1);
        hexs.push(group_i+1,group_j+1);
    }
    let pt=[x,y];
    let dists=[];
    dists.push(dist(getHexPos(hexs[0],hexs[1]),pt));
    dists.push(dist(getHexPos(hexs[2],hexs[3]),pt));
    dists.push(dist(getHexPos(hexs[4],hexs[5]),pt));
    const min=Math.min(...dists);
    const index=dists.indexOf(min);
    console.log("getHexIndex - ",dists);
    return [hexs[2*index],hexs[2*index+1]];
}

/**
 * Draws round character with index (i,j)
 * @param {number} i 
 * @param {number} j 
 */
function drawRoundCharacter(i=0,j=0){
    ctx.beginPath();
    // arc(x, y, radius, startAngle, endAngle)
    [x,y]=getHexPos(i,j);
    ctx.arc(x,y,30,0,2*Math.PI);
    ctx.fillStyle = `rgb(218, 247, 166)`;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "darkslategray";
    ctx.stroke();
    ctx.closePath();
}

/**
 * Returns cursor position in canvas
 * @param {*} canvas 
 * @param {*} event 
 * @returns [number,number]
 */
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x,",x,"y,",y);
    return [x,y];
}

function init(){
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('mousedown', function(e) {
        let [x,y]=getCursorPosition(canvas, e);
        let [i,j]=getHexIndex(x,y);
        clearContext();
        drawHexagonGrid();
        drawRoundCharacter(i,j);
    })
    ctx = canvas.getContext("2d");
    window.addEventListener('resize',resizeCanvas,false);
    drawHexagonGrid();
    drawRoundCharacter();
}