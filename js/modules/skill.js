/**
 * Types of attack skills:
 * 1. Normal
 * 2. Line
 * 3. Fan
 * 4. Round
 */

class Skill{
    constructor(ui, map, holder){
        this.map = map;
        this.holder = holder;
    }
}

class NormalSkill extends Skill{
    constructor(ui, map, holder, effectiveDist=6){
        super(ui, map, holder);
        this.effectiveDist = effectiveDist;
        this.attackee = null;
        this.ui = ui.skill("1");
        // this.ui.add();
        this.uiAim = ui.aim();
        this.valid = false;
    }

    attack(enemies){
        if(!this.attackee){
            console.log("NormalSkill - attack(), has not set attackee");
        }
        // apply the attack skill to all enemies within the attack range
        for(let i = 0; i < this.range().length; i++){
            for(let e = 0; e < enemies.length; e++){
                let enemy = enemies[e];
                if(this.range[i] == enemy.position){
                    this.perform(enemy);
                }
            }
        }
    }

    /**
     * Get damage based on skill holder's combat properties.
     */
    damage(){
        return this.holder.getStrength();
    }

    /**
     * Perform the skill and update attackee's combat properties.
     * @param {Object} attackee 
     * @returns updated attackee
     */
    perform(attackee){
        if(!this.valid) return false;
        let hp = Math.max(0, attackee.getHP() - this.damage());
        if(hp === 0){
            if(attackee.getLives() > 1){
                attackee.reduceLives();
                return true;
            }else{
                attackee.die();
                this.unsetAttackee();
                return false;
            }
        }else{
            attackee.setHP(hp);
        }
        return true;
    }

    /**
     * Get range of attack.
     * @returns [][]
     */
    range(){
        let range = [];
        range.push(attackee.position);
        return range;
    }

    /**
     * Verify if the potential skill is valid.
     * @returns true if is valid
     */
    validify(attackee){
        let x = attackee.position[0];
        let y = attackee.position[1];
        let i = this.holder.position[0];
        let j = this.holder.position[1];
        let distance = this.map.getDist(i, j, x, y);
        this.uiAim.move(x,y);
        return distance <= this.effectiveDist;
    }

    /**
     * Set attackee character.
     * @param {Character} attackee 
     * @returns true on valid attackee
     */
    setAttackee(attackee){
        if(this.validify(attackee)){
            this.attackee = attackee;
            this.valid = true;
            return true;
        }
        return false;
    }

    unsetAttackee(){
        this.attackee = null;
        this.valid = false;
        this.uiAim.remove();
        this.ui.invalid();
    }
}

export { NormalSkill }