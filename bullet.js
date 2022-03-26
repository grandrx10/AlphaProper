import { Particle } from "./particle.js";

// This is the start of combat program
export class Bullet {
    constructor (x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id, colour, length, width, gravity, stay) {
        this.x = x; // required
        this.y = y; // required
        this.aimX = aimX;
        this.aimY = aimY;
        this.r = length;// required
        this.length = length;// required
        this.width = width;// required
        this.travel = [aimX - x, aimY - y];
        this.speed = speed;
        this.damage = damage;
        this.startTime = gameTime;
        this.duration = duration;
        this.type = type;
        this.team = team;
        this.id = id;
        this.colour = colour// required
        this.gravity = gravity;
        this.stay = stay;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }

    updateBulletLocation (entities, walls, bullets, gameTime, particles){
        this.x = this.x + this.speed*this.travel[0]
        /Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));
        this.y = this.y + this.speed*this.travel[1]
        /Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));

        if (this.gravity){
            this.deaccelerate();
            this.update(walls)
        }


        this.checkBulletCollisionEntities(entities, bullets, this, particles, gameTime);

        this.checkBulletCollision(walls, bullets);

        this.checkBulletDuration(bullets, gameTime);

    }

    show(){
        fill(255)
        ellipse(this.x -xRange, this.y -yRange, this.r, this.r)
    }

    checkBulletDuration(bullets, gameTime){
        if (this != null){
            if(gameTime - this.startTime > this.duration && !this.stay){
                bullets.splice(bullets.indexOf(this), 1)
                
            }
        }
    }

    checkBulletCollision(walls, bullets){
        if (this != null){
            var deleted = false;
            for (let i = walls.length-1; i >= 0 && !deleted; i--){
                if (!this.stay && ((this.rectCircDetect(walls[i], this) && this.type == "circle") ||
                (this.rectRectDetect(walls[i], this) && this.type == "rect"))) {
                    bullets.splice(bullets.indexOf(this), 1);
                    deleted = true;
                }
            }
        }
    }

    checkBulletCollisionEntities(entities, bullets, bullet, particles, gameTime){
        if (this != null){
            var bulletDeleted = false;
            Object.keys(entities).forEach(function(key) {
                if (!bulletDeleted && ((bullet.rectCircDetect(entities[key], bullet)&& bullet.type == "circle") ||
                (bullet.rectRectDetect(entities[key], bullet)&& bullet.type == "rect"))
                && entities[key].team != bullet.team) {
                    if (entities[key].stats.hp[1] != null){
                        if (bullet.damage > 0){
                            var bulletDamage = bullet.damage*(1 - 0.05*entities[key].stats.def[1]);
                        } else{
                            var bulletDamage = bullet.damage
                        }
                        if (!entities[key].invincible){
                            entities[key].stats.hp[1] -= bullet.damage;
                            particles.push(new Particle(bulletDamage, "text", bullet.x + bullet.length/2 + entities[key].randint(-10, 10),
                            bullet.y + bullet.width/2 + entities[key].randint(-10, 10), 10, 10, 300, gameTime, "white", entities[key].randint(-10, 10),
                            entities[key].randint(-5, -1)));
                            entities[key].lastHurtBy = bullet.id;
                        }
                    }
                    if (!bullet.stay){
                        bullets.splice(bullets.indexOf(bullet), 1);
                        bulletDeleted = true;
                    }
                }
            });
        }
    }

    update(blocks) {
        this.x += this.xSpeed;
        for (var c = 0; c < blocks.length; c ++){
            if (this.rectRectDetect(this, blocks[c]) && this != blocks[c]){
                this.x += -this.xSpeed;
                this.xSpeed = 0;
            }
        }
        
        this.y += this.ySpeed;
        for (var c = 0; c < blocks.length; c ++){
            if (this.rectRectDetect(this, blocks[c]) && this != blocks[c]){
                this.y += -this.ySpeed;
                this.ySpeed = 0;
            }
        }
    }

    deaccelerate(){
        this.ySpeed += 0.3;
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
}