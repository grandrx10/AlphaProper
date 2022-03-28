export class Wall {
    constructor (type, x, y, length, width, colour){
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
    }


    draw(){
        fill(this.colour);
        rect(this.x - xRange + shake.x, this.y - yRange + shake.y, this.length, this.width);
    }

    update(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

}