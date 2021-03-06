export class Weapon {
    constructor (name){
        this.name = name;
        this.lastFired = 0;
        this.manaCost = 0;
        this.bulletLength = 10
        this.bulletWidth = 10
        this.spawnBullet = [0,0] // alter where the bullet spawns
        this.gravity = false
        this.cooldown = 0 
        this.stay = false
        this.teleport;
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
            case "Silver Longsword":
                this.cooldown = 100; // 100
                this.damage = 25;
                this.speed = 20;
                this.expireTime = 150; // 200
                this.colour = "silver"
                break;
            case "Holy Blade":
                this.cooldown = 100; // 100
                this.damage = 22;
                this.speed = 22;
                this.expireTime = 150; // 200
                this.colour = "gold"
                break;
            case "Hearthwood Bow":
                this.cooldown = 180;
                this.damage = 25;
                this.speed = 22;
                this.expireTime = 300; // 200
                this.colour = "rgb(110, 245, 76)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "Vomit":
                this.manaCost = 1
                this.cooldown = 90;
                this.damage = 15;
                this.speed = 5;
                this.expireTime = 1000; // 200
                this.colour = "rgb(139, 189, 134)"
                break;
            case "Ranger's Bow":
                this.cooldown = 200;
                this.damage = 20;
                this.speed = 8;
                this.expireTime = 300; // 200
                this.colour = "rgb(210, 105, 255)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "Steel Hammer":
                this.cooldown = 500;
                this.damage = 20;
                this.manaCost = 20;
                this.speed = 3;
                this.expireTime = 1000; // 200
                this.colour = "rgb(103, 179, 55)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "Flamestrike Spell":
                this.cooldown = 500;
                this.damage = 30;
                this.manaCost = 30;
                this.speed = 7;
                this.expireTime = 2000; // 200
                this.colour = "red"
                break;
            case "Spell of Mending":
                this.cooldown = 1000;
                this.damage = -0.3;
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
                this.cooldown = 250;
                this.damage = 12;
                this.speed = 18;
                this.expireTime = 250;
                this.colour = "rgb(110, 245, 76)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;

            case "Legion Shield":
                this.cooldown = 4000;
                this.manaCost = 30;
                break;
            case "Summoning Banner":
                this.cooldown = 1000;
                this.manaCost = 30;
                break;
            case "Teleportation Crystal":
                this.cooldown = 1000;
                this.damage = 50;
                this.speed = 10;
                this.manaCost = 20;
                this.expireTime = 500;
                this.colour = "yellow"
                this.bulletLength = 30
                this.bulletWidth = 30
                this.teleport = true;
                break;
            case "dev":
                this.cooldown = 1; // 100
                this.damage = 20;
                this.speed = 20;
                this.expireTime = 200;
                this.colour = "white"
                break;
            
            // AI WEAPONS HERE ----------------------
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
            case "knightBlade":
                this.cooldown = 400;
                this.damage = 12;
                this.speed = 12;
                this.expireTime = 200;
                this.colour = "rgb(191, 188, 178)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "squireBlade":
                this.cooldown = 400;
                this.damage = 6;
                this.speed = 10;
                this.expireTime = 200;
                this.colour = "rgb(191, 188, 178)"
                break;
            case "armourUp":
                this.cooldown = 500;
                break;
            case "summonSquire":
                this.cooldown = 4000;
                break;
            case "tripleBow":
                this.cooldown = 1000;
                this.damage = 8;
                this.speed = 5;
                this.expireTime = 600;
                this.colour = "rgb(193, 122, 255)"
                this.bulletLength = 10
                this.bulletWidth = 10
                break;
            case "oneTime":
                this.cooldown = 1500;
                break;
            case "once":
                this.cooldown = 100000;
                break;
            case "holyBlade":
                this.cooldown = 200;
                this.damage = 8;
                this.speed = 7;
                this.expireTime = 600;
                this.colour = "rgb(230, 184, 48)"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "futureBullets":
                this.cooldown = 300;
                this.damage = 6;
                this.speed = 5;
                this.expireTime = 10000;
                this.colour = "cyan"
                this.bulletLength = 12
                this.bulletWidth = 12
                break;
            case "explosion":
                this.cooldown = 1000;
                this.damage = 8;
                this.speed = 5;
                this.expireTime = 10000;
                this.colour = "rgb(255, 234, 173)"
                this.bulletLength = 15
                this.bulletWidth = 15
                break;
            case "glutton":
                this.cooldown = 800;
                this.damage = 5;
                this.speed = 8;
                this.expireTime = 200;
                this.colour = "rgb(139, 189, 134)"
                this.bulletLength = 15
                this.bulletWidth = 15
                break;
            case "sloth":
                this.cooldown = 600;
                this.damage = 6;
                this.speed = 10;
                this.expireTime = 300;
                this.colour = "rgb(159, 252, 226)"
                this.negativeEffects = {
                    slow: {amount: 3, startTime: 0, duration: 2000, colour: "rgb(139, 189, 134)"}
                }
                break;
            case "envy":
                this.cooldown = 900;
                this.damage = 6;
                this.speed = 10;
                this.expireTime = 400;
                this.colour = "rgb(255, 56, 69)"
                this.negativeEffects = {
                    vulnerable: {amount: 3, startTime: 0, duration: 2000, colour: "rgb(255, 56, 69)"}
                }
                break;
            case "bleedWeapon":
                this.cooldown = 200;
                this.damage = 3;
                this.speed = 6;
                this.expireTime = 2000;
                this.colour = "red"
                this.negativeEffects = {
                    bleed: {amount: 1, startTime: 0, duration: 1000, colour: "rgb(153, 0, 0)"}
                }
                break;
            case "puppetSpawnRate":
                this.cooldown = 800;
                break;
            case "teleport":
                this.cooldown = 1000;
                this.damage = 0.1;
                this.speed = 0;
                this.expireTime = 1000;
                this.colour = "rgb(255, 251, 0)"
                this.stay = true;
                this.bulletLength = 30
                this.bulletWidth = 30
                this.teleport = true;
                break;
            
        }
    }
}