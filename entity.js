import { Weapon } from "./weapon.js"
import { Bullet } from "./bullet.js"

export class Entity {
    constructor (name, type, x, y, length, width, health, weapon, colour, team, gameTime, id, maxAccelX, maxAccelY){
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.length = length;
        this.width = width;
        this.hp = health;
        this.maxHp = health;
        this.xAccel = 0;
        this.yAccel = 0;
        this.xOrigA = maxAccelX;
        this.yOrigA = maxAccelY;
        this.weapon = new Weapon(weapon);
        this.colour = colour;
        this.canJump = true;
        this.team = team;
        this.creationTime = gameTime;
        this.id = id;
        this.location = "";
        this.expireTime = -1;
        this.travelMap = {x:-1, y:-1, detectRange: 500, aimX: -1, aimY:-1};
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

    moveTowardsMap(){
        if (this.travelMap.x != -1 && this.travelMap.y != -1){
            if (this.x + this.length/2 < this.travelMap.x){
                this.xAccel = this.xOrigA;
            } else {
                this.xAccel = -this.xOrigA;
            }


            if (this.y + this.width/2> this.travelMap.y && this.canJump){
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
            if ((distanceBetween > closestDistance || closestDistance <= 0) && entities[key].team != entity.team 
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

    checkDeath(entities, gameTime, n){
        if (this.hp <= 0){
            for (var i = 0; i < 5; i++){
                entities[n] = new Entity("Blood", "blood", this.x, this.y, 10, 10, 5, "none", "darkred", -1, gameTime, n);
                entities[n].xAccel = this.randint(-10, 10);
                entities[n].yAccel = this.randint(-10, 10);
                entities[n].expireTime = 100;
                n++;
            }

            delete entities[this.id];
            // shake.shakeStart = gameTime;
            // shake.shakeDuration = 10;
        }

        if (this.expireTime != -1 && gameTime - this.creationTime > this.expireTime){
            delete entities[this.id];
        }
    }

    

    shoot(gameTime, bullets, aimPos){
        if (gameTime - this.weapon.lastFired > this.weapon.cooldown){
            this.weapon.lastFired = gameTime;
            this.createBullet(this.x + this.length/2, this.y+ this.width/2
            , aimPos[0], aimPos[1], this.weapon.speed, this.weapon.damage,
            "default", 100, this.team, bullets, gameTime);
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
            rect(this.x - xRange, this.y - yRange - 20, this.length*(this.hp/this.maxHp), 8);
        }
    }

    move(dir){
        if (dir == "left"){
            this.xAccel = -this.xOrigA;
        } else if (dir == "right"){
            this.xAccel = this.xOrigA;
        }else if (dir == "jump" && this.canJump){
            this.yAccel = -this.yOrigA;
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

    update(blocks, blocks2) {
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

        // for (var c = 0; c < blocks2.length; c ++){
        //     if (this.rectRectDetect(this, blocks2[c]) && this != blocks2[c] && blocks2[c].type != "blood"){
        //         this.x += -this.xSpeed;
        //         this.xSpeed = 0;

        //         if (this.type == "npc" && this.canJump){
        //             this.yAccel = -this.yOrigA;
        //             this.canJump = false
        //         }
        //     }
        // }
        
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

        // for (var c = 0; c < blocks2.length; c ++){
        //     if (this.rectRectDetect(this, blocks2[c]) && this != blocks2[c] && blocks2[c].type != "blood"){
        //         this.y += -this.ySpeed;
        //         this.ySpeed = 0;
        //         if (blocks2[c].y > this.y){
        //             this.canJump = true;
        //         }
        //     }
        // }

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

        if (this.xSpeed > 0.2){
            this.xSpeed -= 0.2;
        } else if (this.xSpeed < -0.2) {
            this.xSpeed += 0.2
        } else {
            this.xSpeed = 0
        }

        if (this.type != "blood"){
            if (this.xSpeed > 5){
                this.xSpeed = 5
            }
            if (this.xSpeed < -5){
                this.xSpeed = -5
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

    createBullet(x, y, aimX, aimY, speed, damage, type, duration, team, bullets, gameTime){
        bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime));
    }
}
