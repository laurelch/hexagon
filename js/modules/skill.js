/**
 * Types of attack skills:
 * 1. Normal
 * 2. Line
 * 3. Fan
 * 4. Round
 */

class Skill{
    constructor(holder){
        this.update(holder);
        this.typeCode = this.types[type];
    }
    update(holder){
        this.position = holder.position;
        this.hp = holder.hp;
        this.strength = holder.strength;
    }
}

class NormalSkill extends Skill{
    constructor(holder, distance){
        super(holder);
        this.distance = distance;
    }
    available(attackee){

    }
    attackRange(){

    }
    attackDamage(){

    }
}