import { Weapon } from "./weapon.js"
import { Bullet } from "./bullet.js"
import { ItemFrame } from "./itemFrame.js"
import { DropTable } from "./dropTable.js"
import { Interactable } from "./interactable.js"
import { Rect } from "./rect.js"

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
        this.weapon = new Weapon(weapon);
        this.colour = colour;// required
        this.canJump = true;
        this.team = team;
        this.creationTime = gameTime;
        this.id = id;
        this.location = "";// required
        this.interact;// required
        this.expireTime = -1;
        this.shake = {// required
            shakeStart: 0,
            shakeDuration: 0
        } 
        this.lastHurtBy;
        this.travelMap = {x:-1, y:-1, detectRange: 500, aimX: -1, aimY:-1}; // ai only
        this.deathTime = 0;
        this.deathDuration = 5000;

        this.stats = { // required
            atk: ["ATK", 0],
            spd: ["SPD", 0],
            dex: ["DEX", 0],
            maxHp: ["MAXHP", health],
            hp: ["HP", health],
            def: ["DEF", 0],
            mana: ["MANA", 0],
            vit: ["VIT", 0]
        } 

        if (this.type == "npc"){
            this.dropTable = new DropTable(this.name);
            this.engageRange = engageRange;
        }

        if (this.type == "Player"){ 
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

    aiMovement(entities, entity, bullets, gameTime){
        if (this.type == "npc"){
            this.locateEnemy(entities,entity);
            this.moveTowardsMap();
            if(this.travelMap.aimX != -1){
                this.shoot(gameTime, bullets, [this.travelMap.aimX, this.travelMap.aimY]);
            }
        }
    }

    updateStats(){
        if (this.type == "Player"){
            var healthTemp = this.stats.hp[1];
            this.stats = { // required
                atk: ["ATK", 0],
                spd: ["SPD", 0],
                dex: ["DEX", 0],
                maxHp: ["MAXHP", 100],
                hp: ["HP", healthTemp],
                def: ["DEF", 0],
                mana: ["MANA", 0],
                vit: ["VIT", 0]
            }
            for (var i = this.inventory.items.length-1; i > this.inventory.items.length-5; i --){
                
                for (var entityStat in this.stats){
                    for (var itemStat in this.inventory.items[i].item.stats){
                        if (entityStat == itemStat){
                            this.stats[entityStat][1] += this.inventory.items[i].item.stats[itemStat][1];
                        }
                    }   
                }
            }
        }
    }

    moveTowardsMap(){
        if (this.travelMap.x != -1 && this.travelMap.y != -1){
            if (this.x + this.length/2 + this.engageRange < this.travelMap.x){
                this.xAccel = this.xOrigA;
            } else if (this.x + this.length/2 - this.engageRange > this.travelMap.x){
                this.xAccel = -this.xOrigA;
            }
            // else if (this.x + this.length/2 < this.travelMap.x) {
            //     this.xAccel = this.xOrigA;
            // }

            if ((this.xSpeed == 0||this.y + this.width/2> this.travelMap.y) && this.canJump && this.randint(1,40) == 1){
                this.yAccel = -this.yOrigA;
                this.canJump = false
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
            && entities[key].team != -1 && entity.travelMap.detectRange >= distanceBetween){
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

    checkDeath(entities, gameTime, n, interactables){
        if (this.stats.hp[1] < 0){
            this.stats.hp[1] = 0
        } else if (this.stats.hp[1] > this.stats.maxHp[1]){
            this.stats.hp[1] = this.stats.maxHp[1];
        }

        if (this.stats.hp[1] <= 0 && this.deathTime == 0){
            for (var i = 0; i < 5; i++){
                entities[n] = new Entity("Blood", "blood", this.x, this.y, 10, 10, 5, "none", "darkred", -1, gameTime, n);
                entities[n].xAccel = this.randint(-10, 10);
                entities[n].yAccel = this.randint(-10, 10);
                entities[n].expireTime = 700;
                n ++ ;
            }
            if (entities[entities[this.id].lastHurtBy] != null){
                entities[entities[this.id].lastHurtBy].shake.shakeStart = gameTime;
                entities[entities[this.id].lastHurtBy].shake.shakeDuration = 10;
            }

            if (entities[this.id].type != "Player"){
                var lootDrop = new Interactable("Loot", entities[this.id].x + entities[this.id].length/2,
                entities[this.id].y + entities[this.id].width/2, 15, 15, "brown", "bag")

                for (var i = 0; i < entities[this.id].dropTable.drops.length; i ++){
                    if (this.randint(1, 100) <= entities[this.id].dropTable.drops[i][1]){
                        lootDrop.addToInventory(entities[this.id].dropTable.drops[i][0]);
                    }
                }

                if (!lootDrop.checkEmpty()){
                    interactables.push(lootDrop)
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
            entities[this.id] = new Entity(this.id, "Player", 100 + this.randint(-20, 20), 100, 20, 30, 100, "smg", 
            "purple", 0, gameTime, this.id,1,6)
        }

        if (this.expireTime != -1 && gameTime - this.creationTime > this.expireTime){
            delete entities[this.id];
        }
    }

    

    shoot(gameTime, bullets, aimPos){
        if (gameTime - this.weapon.lastFired > this.weapon.cooldown*(1- 0.1*this.stats.dex[1])){
            this.weapon.lastFired = gameTime;
            this.createBullet(this.x + this.length/2, this.y+ this.width/2
            , aimPos[0], aimPos[1], this.weapon.speed, this.weapon.damage * (1 + 0.1*this.stats.atk[1]),
            "default", this.weapon.expireTime, this.team, bullets, gameTime, this.id, this.weapon.colour);
            return true
        }
        return false
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
            this.xAccel = -this.xOrigA*(1 + 0.1*this.stats.spd[1]);
            this.dir = dir
        } else if (dir == "right"){
            this.xAccel = this.xOrigA*(1 + 0.1*this.stats.spd[1]);
            this.dir = dir
        }else if (dir == "jump" && this.canJump){
            this.yAccel = -this.yOrigA*(1 + 0.1*this.stats.spd[1]);
            this.canJump = false;
        }
    }

    setRoom(rooms){
        for (var i = 0; i < rooms.length; i ++){
            if (this.rectRectDetect(this, rooms[i])){
                this.location = rooms[i].name;
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
            if (this.xSpeed > 5*(1+0.1*this.stats.spd[1])){
                this.xSpeed = 5*(1+0.1*this.stats.spd[1])
            }
            if (this.xSpeed < -5*(1+0.1*this.stats.spd[1])){
                this.xSpeed = -5*(1+0.1*this.stats.spd[1])
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

    createBullet(x, y, aimX, aimY, speed, damage, type, duration, team, bullets, gameTime, id, colour){
        bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id, colour));
    }
}
