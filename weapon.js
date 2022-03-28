export class Weapon {
    constructor (name){
        this.name = name;
        this.lastFired = 0;
        this.manaCost = 0;
        this.bulletLength = 10
        this.bulletWidth = 10
        this.spawnBullet = [0,0] // alter where the bullet spawns
        this.gravity = false
        this.stay = false
        switch(name){
            case "none":
                this.cooldown = 0; // 100
                this.damage = 0;
                this.speed = 0;
                this.expireTime = 0;
                this.colour = "white"
                break;
            case "Adventurer's Sword":
                this.cooldown = 120; // 100
                this.damage = 18;
                this.speed = 20;
                this.expireTime = 200; // 200
                this.colour = "white"
                break;
            case "Hearthwood Bow":
                this.cooldown = 150; // 100
                this.damage = 25;
                this.speed = 22;
                this.expireTime = 300; // 200
                this.colour = "rgb(110, 245, 76)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "Spell of Mending":
                this.cooldown = 1000; // 100
                this.damage = -0.1;
                this.manaCost = 20;
                this.speed = 0;
                this.expireTime = 1000; // 200
                this.colour = "rgb(110, 245, 76)"
                this.bulletLength = 100
                this.bulletWidth = 12
                this.gravity = true
                this.stay = true
                this.spawnBullet = [-50,0]
                break;
            case "Hefty Club":
                this.cooldown = 250; // 100
                this.damage = 12;
                this.speed = 18;
                this.expireTime = 300; // 200
                this.colour = "rgb(110, 245, 76)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "dev":
                this.cooldown = 1; // 100
                this.damage = 20;
                this.speed = 20;
                this.expireTime = 200;
                this.colour = "white"
                break;
            case "fist":
                this.cooldown = 500;
                this.damage = 10;
                this.speed = 8;
                this.expireTime = 300;
                this.colour = "red"
                break;
            case "bow":
                this.cooldown = 700;
                this.damage = 10;
                this.speed = 10;
                this.expireTime = 700;
                this.colour = "pink"
                break;
            case "club":
                this.cooldown = 900;
                this.damage = 6;
                this.speed = 10;
                this.expireTime = 700;
                this.colour = "rgb(130, 255, 186)"
                break;

            // WARLORD WEAPONS --------------------------------------
            case "Warlord's Club":
                this.cooldown = 700;
                this.damage = 4;
                this.speed = 10;
                this.expireTime = 700;
                this.colour = "rgb(169, 255, 77)"
                this.bulletLength = 14
                this.bulletWidth = 14
                break;
            case "Warlord's Stomp":
                this.cooldown = 100;
                this.damage = 6;
                this.speed = 12;
                this.expireTime = 4000;
                this.colour = "rgb(214, 71, 109)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            // ------------------------------------------------------
        }
    }
}