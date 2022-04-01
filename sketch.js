var gameTime = 0;
var entities = [new Entity("Player", "Player", 100, 100, 20, 30, 100, "smg", "purple", 0)];
entities.push(new Entity("Enemy","npc", 500, 100, 20, 30, 100, "pistol", "red", 1))
entities.push(new Entity("Enemy","npc", 800, 100, 20, 30, 100, "pistol", "red", 1))
entities.push(new Entity("Enemy","npc", 870, 100, 20, 30, 100, "pistol", "red", 1))
entities.push(new Entity("Enemy","npc", 1200, -60, 20, 30, 100, "pistol", "red", 1))
entities.push(new Entity("Enemy","npc", 1300, 180, 20, 30, 100, "pistol", "red", 1))
entities.push(new Entity("Enemy","npc", 1850, 25, 20, 30, 100, "pistol", "red", 1))
entities.push(new Entity("Enemy","npc", 2200, 220, 20, 30, 100, "pistol", "red", 1))
var walls = []
walls.push(new Wall("wall", 100, 300, 3200, 50, "white"));
walls.push(new Wall("wall", 50, -200, 50, 550, "white"));
walls.push(new Wall("wall", 50, -200, 3250, 50, "white"));
walls.push(new Wall("wall", 456,172,269, 128, "white"))
walls.push(new Wall("wall", 456,-200,269, 128, "white"))
walls.push(new Wall("wall", 1007,7,366, 53, "white"))
walls.push(new Wall("wall", 1652,183,380, 117, "white"))
walls.push(new Wall("wall", 927,207,60, 94, "white"))
walls.push(new Wall("wall", 2474,12,86, 289, "white"))
walls.push(new Wall("wall", 2420,127,53, 34, "white"))
walls.push(new Wall("wall", 2763,130,337, 43, "white"))
walls.push(new Wall("wall", 705,-70,19, 117, "white"))
walls.push(new Wall("wall", 455,-72,23, 120, "white"))


var bullets = []

var xRange;
var yRange;

var shake = {
    x: 0,
    y: 0,
    shakeStart: 0,
    shakeDuration: 0
}; // How much does the screen shake?

var width = 1400;
var height = 600;

let dev1 = [-1,0]
let dev2 = [-1,0]

function setup(){
    createCanvas(1400, 600);
}

function draw(){
    gameTime += 1;
    background(28, 28, 28);
    cameraShake();
    
    xRange = entities[0].x - width/2;
    yRange = entities[0].y - height/2;

    for (let i = bullets.length-1; i >= 0; i --){
        if (bullets[i] != null){
            bullets[i].show();
            bullets[i].updateBulletLocation();
        }
    }

    for (let i = entities.length-1; i >= 0; i --){
        entities[i].update(walls, entities);
        entities[i].accelerate();
        entities[i].draw();
        entities[i].aiMovement();
        entities[i].checkDeath();
    }

    for (var i = 0; i < walls.length; i ++){
        walls[i].update();
        walls[i].draw();
    }

    if (keyIsDown(32)){
        entities[0].move("Attack")
    } else if (keyIsDown(68)){ // Go right (D)
        entities[0].move("right")
    } else if (keyIsDown(65)){ // Go left (A)
        entities[0].move("left")
    }

    if (keyIsDown(87)){ // go up (w)
        entities[0].move("jump")
    }

    if (mouseIsPressed){
        entities[0].shoot(mouseX + xRange, mouseY + yRange);
    }


    // dev tools ----------------------

    if (dev1[0] != -1 && dev2[0] != -1){
        walls.push(new Wall("wall", dev1[0],dev1[1], dev2[0] - dev1[0], dev2[1] - dev1[1], "white"))
        console.log('walls.push(new Wall("wall", '+ dev1[0] + ','+ dev1[1] + ','+ (dev2[0] - dev1[0]) + ', '+ (dev2[1] - dev1[1]) + ', "white"))')
        dev1[0] = -1
        dev2[0] = -1
    }
    // -------------------------------

};

function keyPressed() {
    if (keyCode == 90){ // (z)
        dev1[0] = Math.round(mouseX+xRange)
        dev1[1] = Math.round(mouseY+yRange)
    } else if (keyCode == 88){ // (x)
        dev2[0] = Math.round(mouseX+xRange)
        dev2[1] = Math.round(mouseY+yRange)
    } else if (keyCode == 67){ // (x)
        console.log(Math.round(mouseX + xRange), Math.round(mouseY + yRange))
    }
}


function rectRectDetect(rect, rect2){
    leftSide = rect.x;
    rightSide = rect.x + rect.length;
    topSide = rect.y;
    botSide = rect.y + rect.width;
    if (rect2.x + rect2.length > leftSide && rect2.x < rightSide && rect2.y + rect2.width> topSide && rect2.y < botSide){
        return true;
    } else {
        return false;
    }
}

function rectCircDetect(rect, circle){
    leftSide = rect.x;
    rightSide = rect.x + rect.length;
    topSide = rect.y;
    botSide = rect.y + rect.width;
    if (circle.x + circle.r/2 > leftSide && circle.x - circle.r/2 < rightSide && circle.y + circle.r/2> topSide && circle.y - circle.r/2< botSide){
        return true;
    } else {
        return false;
    }
}

function createBullet(x, y, aimX, aimY, speed, damage, type, duration, team){
    bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team));
}

function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function cameraShake(){
    if (gameTime - shake.shakeStart <= shake.shakeDuration){
        shake.x = randint(-5, 5);
        shake.y = randint(-5, 5);
    } else {
        shake.x = 0;
        shake.y = 0;
    }
}
