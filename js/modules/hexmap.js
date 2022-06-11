class Hexagon{
    constructor(ui, map, i=0, j=0, color=null){
        this.map = map;
        this.i = i;
        this.j = j;
        if(color){
            this.ui = ui.hex_color(this, color);
        }else{
            this.ui = ui.hex(this);
        }
    }
    click(){
        return [this.i, this.j];
    }
    insert(){
        this.ui.add();
    }
    move(i, j){
        this.i = i;
        this.j = j;
        this.ui.add();
    }
}

export default class HexMap{
    constructor(ui){
        this.ui = ui;
        this.hexmap = [];
        this.track = {};
        this.coloredCells = {
            route: [],
            move: [],
            attack: []
        };
        this.attackRange = [];
        this.types = {
            "route": "yellow",
            "move": "blue",
            "": "red"
        }
        this.acceptClick = true;
    }

    initialize(width, height){
        for(let i = 0; i < width; i ++){
            for(let j = 0; j < height; j++){
                let hex = new Hexagon(this.ui, this, i, j);
                // this.add(hex);
                this.hexmap.push(hex);
                this.clearChar(i, j);
                hex.insert();
            }
        }
    }

    setAcceptClick(accept){
        this.acceptClick = accept;
    }

    canClick(){
        return this.acceptClick;
    }

    addColor(i, j, type){
        const color = this.types.hasOwnProperty(type) ? this.types[type] : this.types[""];
        let hex = new Hexagon(this.ui, this, i, j, color);
        if(!this.coloredCells[type]){
            console.log("new type");
            this.coloredCells[type] = [hex];
        }else{
            this.coloredCells[type].push(hex);
        }
        hex.insert();
    }

    clearType(type){
        for(let i = 0; i < this.coloredCells[type].length; i++){
            this.coloredCells[type][i].ui.remove();
        }
        this.coloredCells[type] = [];
    }

    getChar(i, j){
        return this.track[i+":"+j];
    }

    clearChar(i, j){
        this.track[i+":"+j] = 0;
    }

    setChar(i, j, role){
        this.track[i+":"+j] = role;
    }

    moveChar(prev_i, prev_j, i, j, role){
        this.clearChar(prev_i, prev_j);
        this.setChar(i, j, role);
    }

    /**
     * Get a random cell [x, y] that is not currently occupied
     * @returns [x, y]
     */
    getRandomCell(width, height){
        let x = Math.floor(Math.random() * width);
        let y = Math.floor(Math.random() * height);
        while(this.getChar(x, y) > 0){
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

    // Use [i, j] as center of range
    colorRange(type, ci, cj, range){
        let hexs = this.findCellsWithDist(ci, cj, 1, range).cells;
        this.#colorHex(type, hexs);
    }

    colorPath(type, path){
        this.#colorHex(type, path);
    }

    #colorHex(type, hexagons){
        for(let i = 0; i < hexagons.length; i++){
            let hex = hexagons[i];
            this.addColor(hex[0], hex[1], type);
        }
    }
}