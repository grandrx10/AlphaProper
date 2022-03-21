// This is the start of combat program
export class Bullet {
    constructor (x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id) {
        this.x = x;
        this.y = y;
        this.aimX = aimX;
        this.aimY = aimY;
        this.r = 10;
        this.travel = [aimX - x, aimY - y];
        this.speed = speed;
        this.damage = damage;
        this.startTime = gameTime;
        this.duration = duration;
        this.type = type;
        this.team = team;
        this.id = id;
    }

    updateBulletLocation (entities, walls, bullets){
        this.x = this.x + this.speed*this.travel[0]
        /Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));
        this.y = this.y + this.speed*this.travel[1]
        /Math.sqrt(Math.pow(this.travel[0],2) + Math.pow(this.travel[1],2));


        this.checkBulletCollisionEntities(entities, bullets, this);
        if (this != null){
            this.checkBulletCollision(walls, bullets);
        }
    }

    show(){
        fill(255)
        ellipse(this.x -xRange, this.y -yRange, this.r, this.r)
    }

    checkBulletCollision(walls, bullets){
        for (let i = walls.length-1; i >= 0; i--){
            if (this.rectCircDetect(walls[i], this)) {
                bullets.splice(bullets.indexOf(this), 1);
                break;
            }
        }
    }

    checkBulletCollisionEntities(entities, bullets, bullet){
        Object.keys(entities).forEach(function(key) {
            if (bullet.rectCircDetect(entities[key], bullet) && entities[key].team != bullet.team && entities[key].type != "blood") {
                if (entities[key].hp != null){
                    entities[key].hp -= bullet.damage;
                    entities[key].lastHurtBy = bullet.id;
                }
                bullets.splice(bullets.indexOf(bullet), 1);
            }
        });
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