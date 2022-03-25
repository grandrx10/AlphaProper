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
            this.bulletSize = 10
        } else if (this.name == "dev"){
            this.cooldown = 1; // 100
            this.lastFired = 0;
            this.damage = 20;
            this.speed = 20;
            this.expireTime = 200;
            this.colour = "white"
            this.bulletSize = 10
        } 
        else if (this.name == "fist"){
            this.cooldown = 500;
            this.lastFired = 0;
            this.damage = 10;
            this.speed = 8;
            this.expireTime = 300;
            this.colour = "red"
            this.bulletSize = 10
        } else if (this.name == "bow"){
            this.cooldown = 700;
            this.lastFired = 0;
            this.damage = 10;
            this.speed = 10;
            this.expireTime = 700;
            this.colour = "pink"
            this.bulletSize = 10
        }
    }
}