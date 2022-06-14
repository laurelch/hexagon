const CHAR_ROLES = {
    default: 0,
    player: 3,
    enemy: 1,
    companion: 2
}

class Character{
    constructor(ui, hexmap, identity){
        this.ui = ui;
        this.hexmap = hexmap;
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
        this.target = null;
        this.attackeeValid = false;
        this.fullHP = 100;
    }

    /**
     * Draw the character shape on the hexagon map.
     * @param {*} i 
     * @param {*} j 
     */
    draw(i=0, j=0){
        this.hp = this.fullHP;
        this.level = 1;
        this.lives = 1;
        this.range = 3;
        this.strength = this.level * 100;
        if(this.identity == CHAR_ROLES.player){
            this.move(i, j);
            // this.lives = 3;
            // player = this;
            this.setTurn(true);
        }
        else if(this.identity == CHAR_ROLES.enemy){
            // enemies.push(this);
            this.move(i, j);
        }
        this.hexmap.setChar(i, j, this.identity);
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
            this.attackeeValid = skill.setAttackee(enemy);
            if(this.attackeeValid) skill.ui.valid();
            else skill.ui.invalid();
            this.target = enemy;
            console.log("aim with skill", key, "valid ?", this.attackeeValid);
        }
    }

    unaim(){
        console.log("unaim");
        this.target = null;
        for(const key in this.skills){
            this.skills[key].unsetAttackee();
        }
    }

    attack(skillKey){
        if(!this.attackeeValid) return true;
        let skill = this.skills[skillKey];
        let targetAlive = skill.perform(this.target);
        if(!targetAlive) this.target = null;
        return targetAlive;
    }

    getTurn(){
        return this.isTurn;
    }

    setTurn(turn){
        this.isTurn = turn;
        if(turn){
            // this.hexmap.colorRan ge("move", this.position[0], this.position[1], this.range);
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
        this.hp = this.fullHP;
    }

    die(){
        this.ui.remove();
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
        if(this.target) this.aim(this.target);
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
                this.move(route[r][0], route[r][1]);
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

export { CHAR_ROLES, Character }