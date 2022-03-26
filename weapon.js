export class Weapon {
    constructor (name){
        this.name = name;
        this.lastFired = 0;
        switch(name){
            case "none":
                this.cooldown = 0; // 100
                this.damage = 0;
                this.speed = 0;
                this.expireTime = 0;
                this.colour = "white"
                this.bulletSize = 10
                break;
            case "smg":
                this.cooldown = 100; // 100
                this.damage = 20;
                this.speed = 20;
                this.expireTime = 200;
                this.colour = "white"
                this.bulletSize = 10
                break;
            case "dev":
                this.cooldown = 1; // 100
                this.damage = 20;
                this.speed = 20;
                this.expireTime = 200;
                this.colour = "white"
                this.bulletSize = 10
                break;
            case "fist":
                this.cooldown = 500;
                this.damage = 10;
                this.speed = 8;
                this.expireTime = 300;
                this.colour = "red"
                this.bulletSize = 10
                break;
            case "bow":
                this.cooldown = 700;
                this.damage = 10;
                this.speed = 10;
                this.expireTime = 700;
                this.colour = "pink"
                this.bulletSize = 10
                break;
            case "club":
                this.cooldown = 900;
                this.damage = 8;
                this.speed = 10;
                this.expireTime = 700;
                this.colour = "rgb(130, 255, 186)"
                this.bulletSize = 10
                break;
            case "Warlord's Club":
                this.cooldown = 700;
                this.damage = 6;
                this.speed = 10;
                this.expireTime = 700;
                this.colour = "rgb(169, 255, 77)"
                this.bulletSize = 14
                break;
            case "Warlord's Stomp":
                this.cooldown = 100;
                this.damage = 6;
                this.speed = 12;
                this.expireTime = 4000;
                this.colour = "rgb(214, 71, 109)"
                this.bulletSize = 12
                break;
        }
    }
}