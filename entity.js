import { Weapon } from "./weapon.js"
import { Bullet } from "./bullet.js"
import { ItemFrame } from "./itemFrame.js"
import { Interactable } from "./interactable.js"
import { Rect } from "./rect.js"
import { Particle } from "./particle.js"
import { AttackPattern } from "./attackPattern.js"

export class Entity {
    constructor (name, type, x, y, length, width, health, weapon, colour, team, gameTime, id, maxAccelX, maxAccelY, engageRange){
        this.name = name;// required
        this.type = type;// required
        this.x = x;// required
        this.y = y;// required
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.dir;// required
        this.length = length;// required
        this.width = width;// required
        this.xAccel = 0;
        this.yAccel = 0;
        this.xOrigA = maxAccelX;
        this.yOrigA = maxAccelY;
        this.invincible = false;

        this.weapons = []//[new Weapon(weapon)];
        for (var i = 0; i < weapon.length; i ++){
            this.weapons.push(new Weapon(weapon[i]));
        }

        this.colour = colour;// required
        this.canJump = true;
        this.team = team;
        this.creationTime = gameTime;
        this.id = id;
        this.location = "";// required
        this.room;
        this.interact;// required
        this.expireTime = -1;
        this.shake = {// required
            shakeStart: 0,
            shakeDuration: 0
        } 
        this.lastHurtBy;
        this.deathTime = 0;
        this.deathDuration = 5000;
        this.attackInfo = new AttackPattern();
        this.attackIndex = 0
        this.attacks = [["shoot", -1], ["", -1]]
        this.deathAttack;
        this.deathWeaponIndex;
        this.speech = ""; // REQUIRED
    

        this.stats = { // required
            atk: ["ATK", 0],
            spd: ["SPD", 0],
            dex: ["DEX", 0],
            def: ["DEF", 0],
            maxHp: ["MAXHP", health],
            hp: ["HP", health],
            vit: ["VIT", 0],
            mana: ["MANA", 100],
            maxMana: ["MAXMANA", 100],
            wis: ["WIS", 0],
        }

        this.defaultStats = {
            atk: ["ATK", 0],
            spd: ["SPD", 0],
            dex: ["DEX", 0],
            def: ["DEF", 0],
            maxHp: ["MAXHP", health],
            hp: ["HP", health],
            vit: ["VIT", 0],
            mana: ["MANA", 100],
            maxMana: ["MAXMANA", 100],
            wis: ["WIS", 0],
        }

        this.effects = { // required
            atk: {amount: 0, startTime: 0, duration: 0, colour: "red"},
            spd: {amount: 0, startTime: 0, duration: 0, colour: "green"},
            def: {amount: 0, startTime: 0, duration: 0, colour: "gray"},
            hp: {amount: 0, startTime: 0, duration: 0, colour: "pink"},
            dex: {amount: 0, startTime: 0, duration: 0, colour: "orange"},
            mana: {amount: 0, startTime: 0, duration: 0, colour: "blue"},
            wis: {amount: 0, startTime: 0, duration: 0, colour: "cyan"},
            maxHp: {amount: 0, startTime: 0, duration: 0, colour: "darkred"},
            maxMana: {amount: 0, startTime: 0, duration: 0, colour: "yellow"},
            vit: {amount: 0, startTime: 0, duration: 0, colour: "darkred"},
            gold: {amount: 0, startTime: 0, duration: 0, colour: ""},
        }

        this.negativeEffects = { // required
            slow: {amount: 0, startTime: 0, duration: 0, colour: "rgb(139, 189, 134)"},
            vulnerable: {amount: 0, startTime: 0, duration: 0, colour: "rgb(255, 56, 69)"},
            bleed:{amount: 0, startTime: 0, duration: 0, colour: "rgb(153, 0, 0)"}
        }

        if (this.type == "npc"){
            this.drops = [];
            this.engageRange = engageRange;
            this.speechList = []
            this.speechIndex = 0;
            this.chase = true;
            this.travelMap = {x:-1, y:-1, detectRange: 600, aimX: -1, aimY:-1}; // ai only
            this.fightTime = 0;
            this.boss = false;
        }

        if (this.type == "Player"){ 
            this.closestBoss;
            this.inventory = { // required
                inventorySize: 8,
                items: [],
                inventoryOpen: false,
                itemSelected: null,
                rects: [new Rect(100, 50, 400, 400), new Rect(150, 450, 300, 100)]
            };
            for (var i = 0; i < this.inventory.inventorySize; i ++){
                if (i <this.inventory.inventorySize/2){
                    this.inventory.items.push(new ItemFrame("", i, 125 + i*(350/(this.inventory.inventorySize/2)), 100, 80, 80));
                } else {
                    this.inventory.items.push(new ItemFrame("", i, 125 + (i-this.inventory.inventorySize/2)*
                    (350/(this.inventory.inventorySize/2)), 190, 80, 80));
                }
            }
            let equipSpot = ["Head", "Chest", "Ability", "Weapon"]
            for (var i = 0; i < 4; i ++){
                this.inventory.items.push(new ItemFrame("", equipSpot[i], 125 + i*(350/(this.inventory.inventorySize/2)), 310, 80, 80));
            }

            var i = 3
            this.inventory.items[this.inventory.items.length-1] = new ItemFrame("dev",
            equipSpot[i], 125 + i*(350/(this.inventory.inventorySize/2)), 310, 80, 80)

            // var i = 2
            // this.inventory.items[this.inventory.items.length-2] = new ItemFrame("Teleportation Crystal",
            // equipSpot[i], 125 + i*(350/(this.inventory.inventorySize/2)), 310, 80, 80)
            this.updateStats()
        }
    }

    checkEffects(gameTime){
        if (this != null){
            if (this.room != null && this.room.name == "lobby"){
                this.stats.mana[1] += 1;
            }

            for (var effect in this.effects){
                if (gameTime - this.effects[effect].startTime > this.effects[effect].duration && this.effects[effect].startTime != 0){
                    this.effects[effect].amount = 0;
                    this.effects[effect].startTime = 0
                }
            }
            for (var effect in this.negativeEffects){
                if (gameTime - this.negativeEffects[effect].startTime > this.negativeEffects[effect].duration 
                    && this.negativeEffects[effect].startTime != 0){
                    this.negativeEffects[effect].amount = 0;
                    this.negativeEffects[effect].startTime = 0
                }
            }
        }
    }

    checkInteract(interactables){
        var detected = false;
        for (var i = 0; i< interactables.length; i++){
            if (this.rectRectDetect(interactables[i], this)){
                this.interact = interactables[i]
                detected = true;
            }
        }
        
        if (!detected){
            this.interact = null
        }
    }

    aiMovement(entities, entity, bullets, gameTime, particles, game, walls){
        if (this.type == "npc"){
            if (this.fightTime != 0){
                if (gameTime - this.fightTime > this.attacks[this.attackIndex][1]){
                    if (this.attackIndex < this.attacks.length-1){
                        this.attackIndex ++;
                        this.fightTime = gameTime;
                    } else if (this.attacks[this.attackIndex][0] == "speech"){
                        this.attackIndex ++
                    } else {
                        this.attackIndex = 0;
                    }
                }
            }

            this.locateEnemy(entities,entity);
            if (this.chase)
                this.moveTowardsMap();
            if(this.travelMap.aimX != -1){
                if (this.fightTime == 0 && this.attacks[this.attackIndex][0] != "speech"){
                    this.fightTime = gameTime;
                }
                this.attackInfo.preformAttack(this.attacks[this.attackIndex][0], this.attackIndex, bullets, entities, entity, gameTime,
                    this.travelMap.aimX, this.travelMap.aimY, particles,game, walls);
            }
        }
    }

    clearInventorySlot(inventorySlot){
        if (this != null){
            for (var i = 0; i < this.inventory.items.length; i ++){
                if (this.inventory.items[i].slot == inventorySlot){
                    this.inventory.items[i].itemName = "";
                    this.inventory.items[i].refreshItem();
                    this.updateStats();
                }
            }
        }
    }

    updateStats(){
        if (this.type == "Player"){
            var healthTemp = this.stats.hp[1];
            var manaTemp = this.stats.mana[1];
            this.stats = JSON.parse(JSON.stringify(this.defaultStats));
            this.stats.hp[1] = healthTemp;
            this.stats.mana[1] = manaTemp;

            for (var i = this.inventory.items.length-1; i > this.inventory.items.length-5; i --){
                
                for (var entityStat in this.stats){
                    for (var itemStat in this.inventory.items[i].item.stats){
                        if (entityStat == itemStat){
                            this.stats[entityStat][1] += this.inventory.items[i].item.stats[itemStat][1];
                        }
                    }   
                }

                if (this.inventory.items[i].slot == "Weapon"){
                    this.weapons[0] = new Weapon(this.inventory.items[i].item.name)
                    this.attacks[0][0] =  this.inventory.items[i].item.attackType
                } else if (this.inventory.items[i].slot == "Ability"){
                    this.weapons[1] = new Weapon(this.inventory.items[i].item.name)
                    this.attacks[1][0] =  this.inventory.items[i].item.attackType
                }
            }
        }
    }

    moveTowardsMap(){
        if (this.travelMap.x != -1 && this.travelMap.y != -1){
            if (this.x + this.length/2 + this.engageRange < this.travelMap.x){
                this.move("right");
            } else if (this.x + this.length/2 - this.engageRange > this.travelMap.x){
                this.move("left");
            } else if (this.x + this.length/2 + this.engageRange > this.travelMap.x && this.x + this.length/2 < this.travelMap.x){
                this.move("left");
            }else if (this.x + this.length/2 - this.engageRange < this.travelMap.x && this.x + this.length/2 > this.travelMap.x){
                this.move("right");
            }

            if ((this.xSpeed == 0||this.y + this.width/2> this.travelMap.y) && this.canJump && this.randint(1,40) == 1){
                this.move("jump");
            }
        }
    }

    locateEnemy(entities, entity){
        var closest = -1;
        var closestDistance = -1;
        Object.keys(entities).forEach(function(key) {
            let distanceBetween = entity.distance(entity.x + entity.length/2, entity.y+ entity.width/2,
                 entities[key].x + entities[key].length/2, entities[key].y + entities[key].width/2);
            if ((distanceBetween < closestDistance || closestDistance < 0) && entities[key].stats.hp[1] > 0
            && entities[key].team != entity.team 
            && entity.travelMap.detectRange >= distanceBetween){
                closest = key;
                closestDistance = distanceBetween;
            }
        });

        if (closest != -1){
            this.travelMap.x = entities[closest].x + entities[closest].length/2;
            this.travelMap.y = entities[closest].y + entities[closest].width/2;
            this.travelMap.aimX = entities[closest].x + entities[closest].length/2;
            this.travelMap.aimY = entities[closest].y + entities[closest].width/2;
        } else {
            this.travelMap.x = -1
            this.travelMap.y = -1
            this.travelMap.aimX = -1
            this.travelMap.aimY = -1
        }
    }

    checkDeath(entities, gameTime, interactables, particles, bullets, walls, game){
        if (this != null){
            if (this.stats.hp[1] < 0){
                this.stats.hp[1] = 0
            } else if (this.stats.hp[1] > this.stats.maxHp[1]){
                this.stats.hp[1] = this.stats.maxHp[1];
            } else if (this.stats.hp[1] > 0){
                this.stats.hp[1] += 0.01 + 0.01*this.stats.vit[1];
            }

            if (this.negativeEffects.bleed.amount > 0){
                this.stats.hp[1] -= 0.1*this.negativeEffects.bleed.amount;
                particles.push(new Particle(0.1*this.negativeEffects.bleed.amount, "text", this.x + this.length/2,
                            this.y + this.width/2, 10, 10, 300, gameTime, "white", this.randint(-10, 10),
                            this.randint(-5, -1)));
            }
    
            if (this.stats.mana[1] > this.stats.maxMana[1]){
                this.stats.mana[1] = this.stats.maxMana[1]
            } else {
                this.stats.mana[1] += 0.02 + 0.02*this.stats.wis[1];
            }
    
            if (this.stats.hp[1] <= 0 && this.deathTime == 0){
                for (var i = 0; i < 5; i++){
                    particles.push(new Particle("","blood", this.x, this.y, 10, 10, 700, gameTime,"darkred",
                    this.randint(-10, 10), this.randint(-10, 10)));
                }
    
                if (entities[entities[this.id].lastHurtBy] != null){
                    entities[entities[this.id].lastHurtBy].shake.shakeStart = gameTime;
                    entities[entities[this.id].lastHurtBy].shake.shakeDuration = 100;
                }
    
                if (entities[this.id].type != "Player"){
                    if (this.deathAttack == null){
                        var lootDrop = new Interactable("Loot", entities[this.id].x + entities[this.id].length/2 - 7,
                        entities[this.id].y + entities[this.id].width/2, 15, 15, "brown", "bag", gameTime)
        
                        for (var i = 0; i < entities[this.id].drops.length; i ++){
                            if (this.randint(1, 100) <= entities[this.id].drops[i][1]){
                                lootDrop.addToInventory(entities[this.id].drops[i][0]);
                            }
                        }
                        
                        if (!lootDrop.checkEmpty()){
                            interactables.push(lootDrop)
                        }
        
                        if (entities[this.id].boss){
                            interactables.push(new Interactable("lobby", entities[this.id].x, entities[this.id].y - 20, 
                            30, 40, "blue", "portal", gameTime, -2))
                        }
                    } else {
                        if (this != null){
                            this.attackInfo.preformAttack(this.deathAttack, this.deathWeaponIndex, bullets, entities, this, gameTime,
                                this.travelMap.aimX, this.travelMap.aimY, particles,game, walls, true);
                        }
                    }
    
                    delete entities[this.id];
    
                } else if (entities[this.id].deathTime == 0){
                    this.deathTime = gameTime;
                    var temp = entities[this.id].width;
                    entities[this.id].width = entities[this.id].length;
                    entities[this.id].length = temp;
                    entities[this.id].inventory.inventoryOpen = false;
                }
            } else if ((gameTime - this.deathTime) > this.deathDuration && this.deathTime != 0){
                entities[this.id].x = 100 + this.randint(-20, 20)
                entities[this.id].y = 100
                entities[this.id].stats.hp[1] = 100;
                entities[this.id].length = 20;
                entities[this.id].width = 30;
                entities[this.id].deathTime = 0;
                entities[this.id].deathDuration = 5000;
            }
    
            if (this.expireTime != -1 && gameTime - this.creationTime > this.expireTime){
                delete entities[this.id];
            }
        }
    }

    draw(){
        fill(this.colour);
        rect(this.x - xRange, this.y - yRange, this.length, this.width);
        if (this.type != "blood"){
            fill("grey");
            rect(this.x - xRange, this.y - yRange - 20, this.length, 8);
            fill("green");
            rect(this.x - xRange, this.y - yRange - 20, this.length*(this.stats.hp[1]/this.stats.maxHp[1]), 8);
        }
    }

    move(dir){
        if (dir == "left"){
            this.xAccel = -this.xOrigA*(1 + 0.1*(this.stats.spd[1] + this.effects.spd.amount- this.negativeEffects.slow.amount));
            this.dir = dir
        } else if (dir == "right"){
            this.xAccel = this.xOrigA*(1 + 0.1*(this.stats.spd[1] + this.effects.spd.amount- this.negativeEffects.slow.amount));
            this.dir = dir
        }else if (dir == "jump" && this.canJump){
            this.yAccel = -this.yOrigA*(1 + 0.1*(this.stats.spd[1] + this.effects.spd.amount - this.negativeEffects.slow.amount));
            this.canJump = false;
        }
    }

    setRoom(rooms){
        for (var i = 0; i < rooms.length; i ++){
            if (this.rectRectDetect(this, rooms[i])){
                this.location = rooms[i].name;
                this.room = rooms[i]
            }
        }
    }

    findBoss(entities, entity){
        var bossFound = false;
        if (entity != null && entity.type == "Player"){
            Object.keys(entities).forEach(function(key) {
                if (entities[key].room == entity.room && entities[key].boss){
                    entity.closestBoss = entities[key]
                    bossFound = true;
                }
            });

            if (!bossFound){
                entity.closestBoss = null;
            }
        }
    }

    update(blocks) {
        this.x += this.xSpeed;
        for (var c = 0; c < blocks.length; c ++){
            if (this.rectRectDetect(this, blocks[c]) && this != blocks[c] && blocks[c].type != "blood"){
                this.x += -this.xSpeed;
                this.xSpeed = 0;
                if (this.type == "npc" && this.canJump){
                    this.yAccel = -this.yOrigA;
                    this.canJump = false
                }
            }
        }
        
        this.y += this.ySpeed;
        for (var c = 0; c < blocks.length; c ++){
            if (this.rectRectDetect(this, blocks[c]) && this != blocks[c] && blocks[c].type != "blood"){
                this.y += -this.ySpeed;
                this.ySpeed = 0;
                if (blocks[c].y > this.y){
                    this.canJump = true;
                }
            }
        }

    }
        
    accelerate(){
        this.deaccelerate();
        this.ySpeed += this.yAccel;
        this.xSpeed += this.xAccel;
        this.yAccel = 0;
        this.xAccel = 0;
    }

    deaccelerate(){
        this.ySpeed += 0.3;

        if (this.xSpeed >= 0.4){
            this.xSpeed -= 0.4;
        } else if (this.xSpeed <= -0.4) {
            this.xSpeed += 0.4
        } else {
            this.xSpeed = 0
        }

        if (this.type != "blood"){
            if (this.xSpeed > 5*(1+0.1*(this.stats.spd[1] + this.effects.spd.amount - this.negativeEffects.slow.amount))){
                this.xSpeed = 5*(1+0.1*(this.stats.spd[1] + this.effects.spd.amount - this.negativeEffects.slow.amount))
            }
            if (this.xSpeed < -5*(1+0.1*(this.stats.spd[1] + this.effects.spd.amount - this.negativeEffects.slow.amount))){
                this.xSpeed = -5*(1+0.1*(this.stats.spd[1] + this.effects.spd.amount - this.negativeEffects.slow.amount))
            }
        }
    }

    rectCircDetect(rect, circle){
        var leftSide = rect.x;
        var rightSide = rect.x + rect.length;
        var topSide = rect.y;
        var botSide = rect.y + rect.width;
        if (circle.x + circle.r/2 > leftSide && circle.x - circle.r/2 < rightSide && circle.y + circle.r/2> topSide && circle.y - circle.r/2< botSide){
            return true;
        } else {
            return false;
        }
    }
    rectRectDetect(rect, rect2){
        var leftSide = rect.x;
        var rightSide = rect.x + rect.length;
        var topSide = rect.y;
        var botSide = rect.y + rect.width;
        if (rect2.x + rect2.length > leftSide && rect2.x < rightSide && rect2.y + rect2.width> topSide && rect2.y < botSide){
            return true;
        } else {
            return false;
        }
    }

    randint(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    distance(x1, y1, x2, y2){
        return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
    }

    createBullet(x, y, aimX, aimY, speed, damage, type, duration, team, bullets, gameTime, id, colour, length, width, gravity, stay){
        bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id, colour, length, width, gravity, stay));
    }
}
