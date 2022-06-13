import { W } from "./hexagon-lv-2.js";
// Adding texture atlas
Stage({
    name : 'skill-1', // optional
    image : {
      src : '../img/skill-1.png',
    //   ratio : 1, // optional, for high-res images
    }
});

Stage({
    textures : {
        "hex-bg": Stage.canvas(function(ctx){
            let width = W, height = width;                         
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawHex(ctx, width, height);
        }),
        "o": Stage.canvas(function(ctx){
            ctx.beginPath();
            ctx.arc(0.5*W,0.5*W,0.3*W,0,2*Math.PI);
            ctx.fillStyle = `rgb(218, 247, 166)`;
            ctx.fill();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "darkslategray";
            ctx.stroke();
            ctx.closePath();
        }),
        "o-green": Stage.canvas(function(ctx){
            ctx.beginPath();
            ctx.arc(0.5*W,0.5*W,0.3*W,0,2*Math.PI);
            ctx.fillStyle = `rgb(218, 247, 166)`;
            ctx.fill();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "darkslategray";
            ctx.stroke();
            ctx.closePath();
        }),
        "o-red": Stage.canvas(function(ctx){
            ctx.beginPath();
            ctx.arc(0.5*W,0.5*W,0.3*W,0,2*Math.PI);
            ctx.fillStyle = `#eaa`;
            ctx.fill();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "darkslategray";
            ctx.stroke();
            ctx.closePath();
        }),
        ">": Stage.canvas(function(ctx){
            let width = W, height = width;
            let thickness = W/8;
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawArrow(ctx, width*0.6, height*0.6, thickness, "black");
        }),
        "hex-red": Stage.canvas(function(ctx){
            let width = W, height = width;
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawHex(ctx, width, height, "#eaa");
        }),
        "hex-yellow": Stage.canvas(function(ctx){
            let width = W, height = width;
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawHex(ctx, width, height, "#eea");
        }),
        "hex-green": Stage.canvas(function(ctx){
            let width = W, height = width;
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawHex(ctx, width, height, "#aea");
        }),
        "hex-blue": Stage.canvas(function(ctx){
            let width = W, height = width;
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawHex(ctx, width, height, "#aee");
        })
    }
});

function drawHex(ctx, width, height, color = "#eee"){
    ctx.translate(W/2, W/2);
    ctx.beginPath();
    let s = 60 * Math.PI/180; //60 deg in radians
    for(let i = 0; i <= 6; i++){
        let rad=-i*s;
        ctx.lineTo(width/2 * Math.cos(rad), height/2 * Math.sin(rad));
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}

function drawArrow(ctx, w, h, th, color){
    ctx.translate(W/2, W/2);
    ctx.beginPath();
    // ctx.lineTo(w/2, 0);
    // ctx.lineTo(-w/2 + th, -h/2);
    // ctx.lineTo(-w/2, -h/2);
    // ctx.lineTo(w/2 - th, 0);
    // ctx.lineTo(-w/2, h/2);
    // ctx.lineTo(-w/2 + th, h/2);
    // ctx.lineTo(w/2, 0);

    let s = 120 * Math.PI/180;
    ctx.lineTo(w/2, 0);
    ctx.lineTo(w/2*Math.cos(s) + th, h/2*Math.sin(s));
    ctx.lineTo(w/2*Math.cos(s), h/2*Math.sin(s));
    ctx.lineTo(w/2 - th, 0);
    ctx.lineTo(w/2*Math.cos(2*s), h/2*Math.sin(2*s));
    ctx.lineTo(w/2*Math.cos(2*s) + th, h/2*Math.sin(2*s));
    ctx.lineTo(w/2, 0);

    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}