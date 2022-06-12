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
import { HexMap } from "./modules/hexmap.js";
import { NormalSkill } from "./modules/skill.js";

export const W = 60; //width of whole hexagon
let Mouse = Stage.Mouse;
const SQRT3 = Math.sqrt(3);

function Game(ui, width, height){
    this.world = planck.World();
    this.hexmap = new HexMap(ui);
    const getMap = () => {return this.hexmap;}

    // let globalTime = 0;
    // this.tick = function(dt){
    //     globalTime += dt;
    // }

    let player;
    let enemies = [];
    let target = -1;
    let moveWASD = false;

    const CHAR_ROLES = {
        default: 0,
        player: 3,
        enemy: 1,
        companion: 2
    }

    this.start = function(){
        // 1. draw hexagon grid
        this.hexmap.initialize(width, height);

        // 2. draw player
        let x = Math.floor(width/2);
        let y = Math.floor(height/2);
        new Character(CHAR_ROLES.player).insert(x, y);

        // 3. draw enemies
        let [enemy_x, enemy_y] = this.hexmap.getRandomCell(width, height);
        new Character(CHAR_ROLES.enemy).insert(enemy_x, enemy_y);
        this.hexmap.setAcceptClick(true);

        // 4. initialize skills
        let normalSkill = new NormalSkill(this.hexmap, player);
        player.addSkill("1", normalSkill);
    }

    this.handleKeys = function(){
        let i = player.position[0];
        let j = player.position[1];
        if(moveWASD){
            if(ui.activeKeys.ArrowLeft || ui.activeKeys.a){
                console.log("Key pressed: <- or A");
                player.move(i-1, j);
            }
            if(ui.activeKeys.ArrowRight || ui.activeKeys.d){
                console.log("Key pressed: -> or D");
                player.move(i+1, j);
            }
            if(ui.activeKeys.ArrowUp || ui.activeKeys.w){
                console.log("Key pressed: Up or W");
                player.move(i, j-1);
            }
            if(ui.activeKeys.ArrowDown || ui.activeKeys.s){
                console.log("Key pressed: Down or S");
                player.move(i, j+1);
            }
        }
        if(ui.activeKeys.Space){
            console.log("Key pressed: Space");
        }
        if(ui.activeKeys.Tab){
            console.log("Key pressed: Tab");
            this.toggleEnemyTarget();
        }
        if(ui.activeKeys["1"]){
            console.log("Key pressed: 1");
        }
    }

    this.handleClicks = function(clicked){
        let ci = clicked[0];
        let cj = clicked[1];
        console.log(ci, cj);
        if(this.hexmap.canClick() && player.getTurn()){
            if(!this.hexmap.canMove(ci, cj)){
                console.log("can click, but cannot move");
            }else{
                this.hexmap.clearType("move");
                this.hexmap.setAcceptClick(false);
                player.stepMove(ci, cj);
            }
        }
    }

    this.toggleEnemyTarget = function(){
        target = (target === enemies.length - 1) ? -1 : target + 1;
        // console.log("toggleEnemyTarget(), target =", target);
        if(target >= 0){
            player.aim(enemies[target]);
        }
    }

    class Character{
        constructor(identity){
            this.hexmap = getMap();
            this.identity = identity;
            this.position = [0, 0];
            this.hp = 0;
            this.lives = 0;
            this.level = 0;
            this.range = 0;
            this.isTurn = false;
            if(identity === CHAR_ROLES.player){
                this.ui = ui.circle(this);
            }
            else if(identity === CHAR_ROLES.enemy){
                this.ui = ui.circle(this,"red");
            }
            this.skills = {};
        }

        /**
         * Insert the character shape to the hexagon map.
         * @param {*} i 
         * @param {*} j 
         */
        insert(i=0, j=0){
            const fullHP = 100;
            this.hp = fullHP;
            this.level = 1;
            this.lives = 1;
            this.range = 3;
            this.strength = this.level * 100;
            if(this.identity == CHAR_ROLES.player){
                this.move(i, j);
                // this.lives = 3;
                player = this;
                this.setTurn(true);
            }
            else if(this.identity == CHAR_ROLES.enemy){
                enemies.push(this);
                this.move(i, j);
            }
            this.ui.add();
        }

        addSkill(key, skill){
            this.skills[key] = skill;
        }

        /**
         * Aim at an enemy and verify all skills.
         * @param {Character} enemy 
         */
        aim(enemy){
            for(const key in this.skills){
                let skill = this.skills[key];
                let valid = skill.setAttackee(enemy);
                console.log("aim with skill", key, "valid ?", valid);
            }
        }

        getTurn(){
            return this.isTurn;
        }

        setTurn(turn){
            this.isTurn = turn;
            if(turn){
                this.hexmap.colorRange("move", this.position[0], this.position[1], this.range);
            }
        }

        getHP(){
            return this.hp;
        }

        setHP(hp){
            this.hp = hp;
        }

        getLevel(){
            return this.level;
        }

        setLevel(level){
            this.level = level;
        }

        reduceLives(){
            this.lives--;
            this.hp = fullHP;
        }

        getLives(){
            return this.lives;
        }

        setLives(lives){
            this.lives = lives;
        }

        getStrength(){
            return this.strength;
        }

        setStrength(strength){
            this.strength = strength;
        }

        move(i, j){
            let prev_i = this.position[0];
            let prev_j = this.position[1];
            if(this.hexmap.canMove(i, j)){
                this.position[0] = i;
                this.position[1] = j;
                // this.hexmap.moveChar(prev_i, prev_j, i, j, this.identity);
                this.hexmap.moveChar(prev_i, prev_j, i, j);
                this.ui.move();
            }else{
                console.log("Cannot move");
            }
        }

        /**
         * Move player from original to goal with cells colored
         * @param {number} i 
         * @param {number} j 
         */
        stepMove(i, j){
            // move player to the clicked hexagon
            let route = this.hexmap.route(this.position[0], this.position[1], i, j);
            this.hexmap.setAcceptClick(false);
            this.hexmap.colorPath("route", route);
            // move player to cells in the route one by one
            for(let r = 1; r < route.length; r++){
                setTimeout(()=>{
                    player.move(route[r][0], route[r][1]);
                }, r * 500)
            }
            // clear all colored cells after arrival
            setTimeout(()=>{
                this.hexmap.clearType("route");
                this.setTurn(true);
                this.hexmap.setAcceptClick(true);
            }, route.length * 500)
        }
    }
}

Stage(function(stage){
    let activeKeys = {};
    let clicked = [];
    const KEY_NAMES = {
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
        "q": false,
        "1": false
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
        activeKeys: activeKeys,
        hex: function(hex){
            let img = Stage.image("hex-bg").pin({
                align: 0
            }).on(Mouse.CLICK, function(point){
                clicked = hex.click();
                // console.log("game click", clicked);
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
            activeKeys[evt.key] = true;
            game.handleKeys();
        }
    }

    document.onkeyup = function(evt){
        let key = evt.key;
        if(key === " ") key = "Space"
        activeKeys[key] = false;
    }

    document.onclick = function(evt){
        game.handleClicks(clicked);
        // console.log("onclick", clicked);
    }

    game.start();
});