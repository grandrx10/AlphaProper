var socket;

var gameStart = false;
var gameTime;

var entities = {}
var walls = []
var bullets = []
var portals = []

var xRange;
var yRange;

var shake = {
    x: 0,
    y: 0
}; // How much does the screen shake?

var width = 1400;
var height = 600;

var clientFont;

function setup(){
    createCanvas(1400, 600);
    socket = io();
    preload();
}

function draw(){
    frameRate(144)
    background(28, 28, 28);
    
    socket.on('sendingUpdate', update);

    if (gameStart){
        if (entities[socket.id] != null){
            cameraShake();
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
            fill(walls[wall].colour);
            rect(walls[wall].x - xRange + shake.x, walls[wall].y - yRange + shake.y, walls[wall].length, walls[wall].width);
        }

        for (portal in portals){
            fill(portals[portal].colour);
            rect(portals[portal].x - xRange + shake.x, portals[portal].y - yRange + shake.y, portals[portal].length, portals[portal].width);
            textAlign(CENTER);
            fill("white")
            textSize(12);
            text(portals[portal].name, portals[portal].x +portals[portal].length/2- xRange, portals[portal].y - yRange - 30)
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
                textFont(clientFont);
                textSize(12);
                text(entities[entity].name, entities[entity].x +entities[entity].length/2- xRange, entities[entity].y - yRange - 30)
                if (entities[entity].interact != null){
                    text("Press E to enter: " + entities[entity].interact.name, entities[entity].x +entities[entity].length/2- xRange, entities[entity].y - yRange - 50)
                }
            }
        }

        if (entities[socket.id] != null){
            if (entities[socket.id].inventory.inventoryOpen){
                displayInventory();
            }
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

            if (keyIsDown(69) && entities[socket.id].interact != null){ // enter portal (e)
                socket.emit('interact', socket.id);
            }
        }

        if (mouseIsPressed){
            socket.emit('shoot', [mouseX + xRange, mouseY + yRange]);
        }
    }

};

function keyPressed() {
    if (keyCode == 81){ // (q)
        socket.emit('openInventory', socket.id);
    }
}

function cameraShake(){
    if (gameTime - entities[socket.id].shake.shakeStart <= entities[socket.id].shake.shakeDuration){
        shake.x = randint(-10, 10);
        shake.y = randint(-10, 10);
    } else {
        shake.x = 0;
        shake.y = 0;
    }
}
function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayInventory(){
    fill("#62B2F7");
    rect(100, 100, 400, 400)
    fill("black");
    textSize(20);
    text("Inventory", 300, 120)
    // for(var i = 0; i < entities[socket.id].inventory.items.length; i++){
    //     entities[socket.id].inventory.items;
    // }
}

function preload(){
    clientFont = loadFont('RedHatMono-Regular.ttf')
}

function update(returnList){
    entities = returnList[1];
    gameTime = returnList[0];
    walls = returnList[2];
    bullets = returnList[3];
    gameStart = true;
    portals = returnList[4];
}

