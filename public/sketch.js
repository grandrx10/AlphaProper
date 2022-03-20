var socket;

var gameStart = false;
var gameTime;

var entities = {}
var walls = []
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
    socket = io.connect('http://localhost:3000');
}

function draw(){
    background(28, 28, 28);
    //cameraShake();
    
    socket.on('sendingUpdate', update);

    if (gameStart){
        if (entities[socket.id] != null){
            xRange = entities[socket.id].x - width/2;
            yRange = entities[socket.id].y - height/2;
        }

        for (let i = bullets.length-1; i >= 0; i --){
            if (bullets[i] != null){
                fill(255)
                ellipse(bullets[i].x -xRange, bullets[i].y -yRange, bullets[i].r, bullets[i].r)
            }
        }

        for (wall in walls){
            //walls[i].update();
            fill(walls[wall].colour);
            rect(walls[wall].x - xRange + shake.x, walls[wall].y - yRange + shake.y, walls[wall].length, walls[wall].width);
        }

        for (entity in entities){
            fill(entities[entity].colour);
            rect(entities[entity].x - xRange, entities[entity].y - yRange, entities[entity].length, entities[entity].width);
            if (entities[entity].type != "blood"){
                fill("grey");
                rect(entities[entity].x - xRange, entities[entity].y - yRange - 20, entities[entity].length, 8);
                fill("green");
                rect(entities[entity].x - xRange, entities[entity].y - yRange - 20, entities[entity].length*(entities[entity].hp/entities[entity].maxHp), 8)
                fill("white")
                textAlign(CENTER);
                textSize(12);
                text(entities[entity].name, entities[entity].x +entities[entity].length/2- xRange, entities[entity].y - yRange - 30)
            }
        }

        if (entities[socket.id] != null){
            fill("white")
            textSize(20);
            text("Location: " + entities[socket.id].location, 150, 50);


            if (keyIsDown(68)){ // go right (D)
                var key = "right"
                socket.emit('key', key);
            } 
            else if (keyIsDown(65)){ // go left (A)
                var key = "left"
                socket.emit('key', key);
            }

            if (keyIsDown(87)){ // go up (w)
                var key = "jump"
                socket.emit('key', key);
            }
        }

        if (mouseIsPressed){
            socket.emit('shoot', [mouseX + xRange, mouseY + yRange]);
        }
    }

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

// function cameraShake(){
//     if (gameTime - shake.shakeStart <= shake.shakeDuration){
//         shake.x = randint(-5, 5);
//         shake.y = randint(-5, 5);
//     } else {
//         shake.x = 0;
//         shake.y = 0;
//     }
// }


function update(returnList){
    entities = returnList[1];
    gameTime = returnList[0];
    walls = returnList[2];
    bullets = returnList[3];
    gameStart = true;
}