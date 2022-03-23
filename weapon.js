export class Weapon {
    constructor (name){
        this.name = name;
        if (this.name == "smg"){
            this.cooldown = 100;
            this.lastFired = 0;
            this.damage = 20;
            this.speed = 20;
        } else if (this.name == "pistol"){
            this.cooldown = 700;
            this.lastFired = 0;
            this.damage = 10;
            this.speed = 10;
        }
    }
}