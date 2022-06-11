export default class HexMap{
    constructor(){
        this.hexmap = [];
        this.track = {};
        this.coloredCells = {
            route: [],
            move: [],
            attack: []
        };
        this.attackRange = [];
    }

    add(hexagon){
        this.hexmap.push(hexagon);
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