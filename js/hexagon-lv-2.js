/**
 * Hexagon map prototype level 2:
 * 1. In a hexagon map, a player controls a main shape starting from the center.
 * 2. The player can move the shape with keys (WSAD) or pressing down mouse button (left click).
 *    - Each character has a limited range of movement.
 *      -> UI for steps left.
 * 3. After move or without move, the player can select from a few skills to attack enemies within the attack range.
 *    - Selection of skills.
 *      -> UI for selection.
 *    - Attack range: single, line, circle. 
 *      -> How to describe attack range with respect to a character (position, direction).
 *    - Attack availability: always available, available every x rounds, available after defeat an enemy, etc.
 *      -> Keep track of the availability, attack count, etc.
 *    - Attack damage: low, medium, high, etc.
 *      -> How to describe attack damage (0-100).
 *      -> How to calculate damage based on skill, character who attacks, and character being attacked.
 *         - base damage of skills
 *         - positions and directions of characters
 *    - HP bar: 0-100.
 *      -> Keep track of hp of each character.
 *      -> UI for HP bar.
 * 4. The enemies will spawn randomly in the map.
 *    - The enemies will spawn except where the player resides.
 *    - How to control the frequency and number of spawns.
 *    - The enemis know how they can attack, and they move with the closest path with maximum move.
 * 5. End policy
 *    - The game will end after player defeat a certain amount of enemies.
 */

let Mouse = Stage.Mouse;
const SQRT3 = Math.sqrt(3);
const W = 60; //width of whole hexagon

class Grid{
    constructor(){
        this.grid = [];
        this.track = {};
        this.coloredCells = {
            route: [],
            move: [],
            attack: []
        };
        this.attackRange = [];
    }

    add(hexagon){
        this.grid.push(hexagon);
    }

    getHex(i, j){
        return this.track[i+":"+j];
    }

    clearHex(i, j){
        if(this.getHex(i, j)){
            this.track[i+":"+j] = 0;
        }
    }

    setHex(i, j, role){
        this.track[i+":"+j] = role;
    }

    moveChar(prev_i, prev_j, i, j, role){
        this.clearHex(prev_i, prev_j);
        this.setHex(i, j, role);
    }

    getRouteCells(){
        return this.coloredCells.route;
    }

    addColoredCell(type="route", hexagon){
       this.coloredCells[type].push(hexagon);
    }

    /**
     * Get a random cell [x, y] that is not currently occupied
     * @returns [x, y]
     */
    getRandomCell(width, height){
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
        while(this.getHex(x, y) > 0){
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
        }
        return [x, y];
    }

    /**
     * Returns neighbors of one hexagon cell
     * @param {number} i 
     * @param {number} j 
     * @returns array of neighbors [i,j]
     */
    getNeighbors(i, j){
        let neighbors = [];
        // top-left, top, top-right, bottom-left, bottom, bottom-right
        let i_list = [-1, 0, 1, -1, 0, 1];
        let j_list = [];
        i % 2 == 0 ? j_list = [-1, -1, -1, 0, 1, 0]:
                    j_list = [0, -1, 0, 1, 1, 1];
        for(let n = 0; n < 6; n++){
            let new_i = i + i_list[n];
            if(new_i < 0) continue;
            let new_j = j + j_list[n];
            if(new_j < 0) continue;
            neighbors.push([new_i, new_j]);
        }
        return neighbors;
    }

    /**
     * Check if a cell [i, j] is in a list of cells
     * @param {*} list 
     * @param {*} cell 
     * @returns 
     */
    includeCell(list, cell){
        for(let i = 0; i < list.length; i++){
            if(list[i][0] === cell[0] && list[i][1] === cell[1]) return true;
        }
        return false;
    }

    findCells(i, j, cells, dist, far, depth){
        if(depth > far) return {cells: cells, dist: dist};
        let ns = this.getNeighbors(i, j);
        for(let ni = 0; ni < ns.length; ni++){
            let n = ns[ni];
            if(!this.includeCell(cells, n)) {
                cells.push(n);
                dist.push(depth);
            }
            this.findCells(n[0], n[1], cells, dist, far, depth + 1);
        }
    }

    /**
     * Find cells within the range of distance (near to far)
     * @param {Number} i 
     * @param {Number} j 
     * @param {Number} near 
     * @param {Number} far 
     * @returns
     */
    findCellsWithDist(i, j, near, far){
        let cells = [];
        let dist = [];
        let depth = 1;
        cells.push([i, j]);
        dist.push(0);
        this.findCells(i, j, cells, dist, far, depth);
        // console.log(cells, dist);
        for(let d = 0; d < dist.length; d++){
            if(dist[d] < near){
                dist.splice(d, 1);
                cells.splice(d, 1);
            }
        }
        return {
            cells: cells,
            dist: dist
        }
    }

    clearColoredCells(type="route"){
        for(let i = 0; i < this.coloredCells[type].length; i++){
            this.coloredCells[type][i].ui.remove();
            if(type === "attack"){
                this.attackRange = [];
            }
        }
    }
}

function Game(ui, width, height){
    this.world = planck.World();
    this.grid = new Grid();
    const getGrid = () => {return this.grid;}

    let player;
    let enemies = [];

    let moveWASD = false;
    let acceptClick = true;
    const setAcceptClick = (accept) => {
        acceptClick = accept;
    }
    const getAcceptClick = () => {
        return acceptClick;
    }

    // let globalTime = 0;
    // this.tick = function(dt){
    //     globalTime += dt;
    // }

    const ROLES = {
        default: 0,
        player: 3,
        enemy: 1,
        companion: 2
    }

    this.start = function(){
        // 1. draw hexagon grid
        for(let i = 0; i < width; i ++){
            for(let j = 0; j < height; j++){
                new Hexagon(i, j).insert();
            }
        }

        // 2. draw player
        let x = Math.floor(width/2);
        let y = Math.floor(height/2);
        new Character(ROLES.player).insert(x, y);

        // 3. draw enemies
        let [enemy_x, enemy_y] = this.grid.getRandomCell(width, height);
        new Character(ROLES.enemy).insert(enemy_x, enemy_y);
        setAcceptClick(true);
    }

    this.handleKeys = function(){
        let i = player.position[0];
        let j = player.position[1];
        if(moveWASD){
            if(ui.active_keys.ArrowLeft || ui.active_keys.a){
                console.log("Key pressed: <- or A");
                player.move(i-1, j);
            }
            if(ui.active_keys.ArrowRight || ui.active_keys.d){
                console.log("Key pressed: -> or D");
                player.move(i+1, j);
            }
            if(ui.active_keys.ArrowUp || ui.active_keys.w){
                console.log("Key pressed: Up or W");
                player.move(i, j-1);
            }
            if(ui.active_keys.ArrowDown || ui.active_keys.s){
                console.log("Key pressed: Down or S");
                player.move(i, j+1);
            }
        }
        if(ui.active_keys.Space){
            console.log("Key pressed: Space");
        }
    }

    class Hexagon{
        constructor(i=0, j=0, type=null){
            this.grid = getGrid();
            this.i = i;
            this.j = j;
            this.identity = ROLES.default;
            if(type){
                this.changeIdentity(type);
            }else{
                this.ui = ui.hex(this);
            }
        }
        click(){
            console.log("Hexagon - click", getAcceptClick(), player.canMove(this.i,this.j));
            if(getAcceptClick() && player.getTurn()){
                if(!player.canMove(this.i, this.j)){
                    console.log("can click, but cannot move");
                }else{
                    this.grid.clearColoredCells("move");
                    setAcceptClick(false);
                    player.stepMove(this.i, this.j);
                }
            }
        }
        insert(){
            this.grid.add(this);
            this.grid.setHex(this.i, this.j, this.identity);
            this.ui.add();
        }
        move(i, j){
            this.grid.moveChar(this.i, this.j, i, j, this.identity);
            this.i = i;
            this.j = j;
            this.ui.add();
        }
        changeIdentity(type){
            let color = "white";
            if(type == "move"){
                color = "blue";
            }else if(type == "route"){
                color = "red";
            }
            this.ui = ui.hex_color(this, color);
        }
    }

    class Character{
        constructor(identity){
            this.grid = getGrid();
            this.identity = identity;
            this.position = [0, 0];
            this.hp = 0;
            this.lives = 0;
            this.level = 0;
            this.range = 0;
            this.isTurn = false;
            if(identity === ROLES.player){
                this.ui = ui.circle(this);
            }
            else if(identity === ROLES.enemy){
                this.ui = ui.circle(this,"red");
            }
        }

        setTurn(turn){
            this.isTurn = turn;
            if(turn){
                this.displayMoveRange();
            }
        }

        getTurn(){
            return this.isTurn;
        }

        /**
         * Insert the character shape to the hexagon map.
         * @param {*} i 
         * @param {*} j 
         */
        insert(i=0, j=0){
            this.hp = 100;
            this.level = 1;
            this.lives = 1;
            this.range = 3;
            if(this.identity == ROLES.player){
                this.move(i, j);
                this.lives = 3;
                player = this;
                this.setTurn(true);
            }
            else if(this.identity == ROLES.enemy){
                enemies.push(this);
                this.move(i, j);
            }
            this.ui.add();
        }

        /**
         * Check if the target cell is in current attack range.
         * @param {Number} i 
         * @param {Number} j 
         * @returns true if is under attack
         */
         canAttack(i, j){
            if(includeCell(attackRange, [i, j])) return true;
            return false;
        }

        /**
         * Check if current character can move to cell (i, j).
         * @param {Number} i 
         * @param {Number} j 
         * @returns true if can move
         */
        canMove(i, j){
            if(this.grid.getHex(i, j) !== 0) return false;
            return true;
        }

        move(i, j){
            let prev_i = this.position[0];
            let prev_j = this.position[1];
            // console.log("grid, identity", this.grid.getHex(i, j), this.identity);
            if(this.canMove(i, j)){
                this.position[0] = i;
                this.position[1] = j;
                this.grid.moveChar(prev_i, prev_j, i, j, this.identity);
                this.ui.move();
            }else{
                console.log("Cannot move");
            }
        }

        displayMoveRange(){
            let x = this.position[0];
            let y = this.position[1];
            let range = this.grid.findCellsWithDist(x, y, 1, this.range).cells;
            this.grid.clearColoredCells("move");
            for(let i = 0; i < range.length; i++){
                let cell = range[i];
                let hex = new Hexagon(cell[0], cell[1], "move");
                this.grid.addColoredCell("move", hex);
                hex.ui.add();
            }
        }

        getDist(x1, y1, x2, y2){
            const cellToGrid = (x, y) => {
                let grid = x%2 === 0 ? [x*2, y*2] : [x*2, y*2 + 1];
                return grid;
            }
            let p1 = cellToGrid(x1, y1);
            let p2 = cellToGrid(x2, y2);
            return (Math.abs(p1[0]-p2[0])+Math.abs(p1[1]-p2[1]))/2;
        }

        /**
         * Get shortest route from current position to target (i, j).
         * @param {Number} i 
         * @param {Number} j 
         * @returns route from one cell to another
         */
        route(i, j){
            let path = [];
            let ci = this.position[0];
            let cj = this.position[1];
            path.push([ci, cj]);
            let dist = this.getDist(ci, cj, i, j);
            let maxDist = dist;
            while(dist > 0 && path.length <= maxDist){
                let dists = [];
                let ns = this.grid.getNeighbors(ci, cj);
                for(let n = 0; n < ns.length; n++){
                    let ni = ns[n][0];
                    let nj = ns[n][1];
                    if(this.canMove(ni, nj)){
                        dists.push(this.getDist(ni, nj, i, j));
                    }else{
                        dists.push(maxDist);
                    }
                }
                // console.log("dists - ",dists);
                let next_i = dists.indexOf(Math.min(...dists));
                let next = ns[next_i];
                path.push(next);
                ci = next[0];
                cj = next[1];
                dist = this.getDist(ci, cj, i, j);
            }
            return path;
        }

        /**
         * Move player from original to goal with cells colored
         * @param {number} i 
         * @param {number} j 
         */
        stepMove(i, j){
            // move player to the clicked hexagon
            let route = player.route(i, j);
            setAcceptClick(false);
            for(let r = 0; r < route.length; r++){
                // color cells in the route
                let hex = new Hexagon(route[r][0], route[r][1], "route");
                this.grid.addColoredCell("route", hex);
                hex.move(route[r][0], route[r][1]);
                hex.ui.add();
                // move player to cells in the route one by one
                setTimeout(()=>{
                    player.move(route[r][0], route[r][1]);
                }, r * 500)
            }
            // clear all colored cells after arrival
            setTimeout(()=>{
                this.grid.clearColoredCells("route");
                this.setTurn(false);
                setAcceptClick(true);
            }, route.length * 500)
        }
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
        "d": false,
        "q": false
    }

    stage.background('#eeeeee');
    stage.viewbox(500, 500);
    // let width = 20, height = 9;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let width = windowWidth / (1.5 * W);
    let height = windowHeight / (2 * W);

    let board = Stage.create().appendTo(stage).pin({
        width: width,
        height: height,
        align: 0.01
    });

    let getPos = (i,j) => {
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
        circle: function(circle, color="green"){
            let img_name = "o-"+color;
            let img = Stage.image(img_name).pin({
                align: 0
            });
            return {
                add: function(){
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                },
                move: function(){
                    let [x, y] = getPos(circle.position[0], circle.position[1]);
                    img.appendTo(board).offset(x, y);
                },
                remove: function(){
                    board.remove(img);
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
                    let [x, y] = getPos(hex.i, hex.j);
                    img.alpha(0.2);
                    img.appendTo(board).offset(x, y);
                },
                remove: function(){
                    board.remove(img);
                }
            }
        },
        win: function(){
            let winMessage = document.getElementsByClassName("win");
            for(let i = 0, length = winMessage.length; i < length; i++) {
                winMessage[i].style.display = "block";
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
        if(KEY_NAMES.hasOwnProperty(evt.key)){
            evt.preventDefault();
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