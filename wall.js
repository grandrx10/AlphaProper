export class Wall {
    constructor (type, x, y, length, width, colour, id, room, entityToDependOn){
        this.type = type;
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.xAccel = 2;
        this.yAccel = 2;
        this.length = length;
        this.width = width;
        this.colour = colour;
        this.id = id;
        this.room = room;
        this.entityToDependOn = entityToDependOn;
    }


    draw(){
        fill(this.colour);
        rect(this.x - xRange + shake.x, this.y - yRange + shake.y, this.length, this.width);
    }

    checkExist(entities, walls){
        if (this.room != null && this.entityToDependOn != null){
            var exist = false;
            var wall = this
            Object.keys(entities).forEach(function(id) {
                
                if (entities[id].name == wall.entityToDependOn && wall.rectRectDetect(entities[id], wall.room)){ 
                    exist = true;
                }
            });

            if (!exist){
                walls.splice(walls.indexOf(this), 1);
            }
        }
    }

    update(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
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