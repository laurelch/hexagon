Stage({
    textures : {
        "hex-bg": Stage.canvas(function(ctx) {
            let width = W, height = width;                         
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawHex(ctx, width, height);
        }),
        "o": Stage.canvas(function(ctx) {
            ctx.beginPath();
            ctx.arc(0.5*W,0.5*W,0.3*W,0,2*Math.PI);
            ctx.fillStyle = `rgb(218, 247, 166)`;
            ctx.fill();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "darkslategray";
            ctx.stroke();
            ctx.closePath();
        }),
        "hex-red": Stage.canvas(function(ctx) {
            let width = W, height = width;
            this.size(width, height, 4);
            ctx.scale(4, 4);
            drawHex(ctx, width, height, "#eaa");
        }),
    }
});

function drawHex(ctx, width, height, color = "#eee"){
    ctx.translate(width/2, height/2);
    ctx.beginPath();
    let s=60*Math.PI/180; //60 deg in radians
    for(let i=0;i<=6;i++) {
        let rad=-i*s;
        ctx.lineTo(width/2*Math.cos(rad),height/2*Math.sin(rad));
    }
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
}