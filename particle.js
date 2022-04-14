export class Particle {
    constructor (name, type, x, y, length, width, expireTime, gameTime, colour, xAccel, yAccel){
        this.name = name;
        this.type = type;// required
        this.x = x;// required
        this.y = y;// required
        this.length = length;
        this.width = width;
        this.expireTime = expireTime;
        this.creationTime = gameTime;
        this.colour = colour;
        this.xAccel = xAccel;
        this.yAccel = yAccel;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }

    checkExpire(gameTime, particles, particle, entities){
        if (this != null){
            var remove = false;
            if (this.type == "gold"){
                Object.keys(entities).forEach(function(key) {
                    if (particle.rectRectDetect(particle, entities[key]) && entities[key].type == "Player"){
                        remove = true;
                        entities[key].gold ++;
                    }
                });
            }
            if (gameTime - this.creationTime > this.expireTime){
                remove = true;
            }

            if (remove)
                particles.splice(particles.indexOf(this), 1);
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