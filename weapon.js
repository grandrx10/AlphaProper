export class Weapon {
    constructor (name){
        this.name = name;
        if (this.name == "smg"){
            this.cooldown = 100; // 100
            this.lastFired = 0;
            this.damage = 20;
            this.speed = 20;
            this.expireTime = 200;
            this.colour = "white"
        } else if (this.name == "dev"){
            this.cooldown = 1; // 100
            this.lastFired = 0;
            this.damage = 20;
            this.speed = 20;
            this.expireTime = 200;
            this.colour = "white"
        } 
        else if (this.name == "fist"){
            this.cooldown = 500;
            this.lastFired = 0;
            this.damage = 10;
            this.speed = 10;
            this.expireTime = 200;
            this.colour = "red"
        } else if (this.name == "bow"){
            this.cooldown = 700;
            this.lastFired = 0;
            this.damage = 10;
            this.speed = 15;
            this.expireTime = 700;
            this.colour = "darkred"
        }
    }
}