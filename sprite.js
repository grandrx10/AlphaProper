class Sprite {
    constructor(animation, x, y){
        this.x = x;
        this.y = y;
        this.attacking = false;
        this.attackTime = 0;
        this.attackDuration = 0;
        this.animation = animation;
        this.index = 0;
        this.xSpeed = 0;
        this.dir = "right";
    }

    displayAnimation (){
        if (this.attacking){
            this.show("attack");
            this.animate("attack");
        }
        else if (this.xSpeed == 0){
            this.show("idle");
            this.animate("idle");
        } else {
            this.show("run");
            this.animate("run");
        }
    }


    show(actionToShow){
        let tempX = this.x;
        if (this.dir == "left"){
            push();
            scale(-1, 1);
            tempX = -tempX;
        }
        if (actionToShow == "attack"){
            let len = this.animation.attack.length;
            let index = floor(this.index) % len;
            image(this.animation.attack[index], tempX, this.y);
        } else if (actionToShow == "run"){
            let len = this.animation.run.length;
            let index = floor(this.index) % len;
            image(this.animation.run[index], tempX, this.y);
        } else if (actionToShow == "idle"){
            let len = this.animation.idle.length;
            let index = floor(this.index) % len;
            image(this.animation.idle[index], tempX, this.y);
        }
        if (this.dir == "left"){
            pop();
        }
    }

    animate(actionToShow){
        if (actionToShow == "attack"){
            this.animateSpeed = 0.2
        } else if (actionToShow == "run"){
            this.animateSpeed = 0.3
        } else {
            this.animateSpeed = 0.3
        }
        this.index += this.animateSpeed;
    }

}