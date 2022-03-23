
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

var LENGTH = 1400;
var WIDTH = 600;

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
            xRange = entities[socket.id].x - LENGTH/2;
            yRange = entities[socket.id].y - WIDTH/2;
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
            if (entities[entity].type == "Player" && entities[entity].stats.hp[1] > 0){
                for (var i = 0; i < entities[entity].inventory.items.length; i ++){
                    if (entities[entity].inventory.items[i].slot == "Head"){
                        drawItem(entities[entity].inventory.items[i].itemName, entities[entity].x - xRange, entities[entity].y - yRange, true, entity)
                    }
                }
            }

            if (entities[entity].type != "blood"){
                fill("grey");
                rect(entities[entity].x - xRange, entities[entity].y - yRange - 20, entities[entity].length, 8);
                fill("green");
                rect(entities[entity].x - xRange, entities[entity].y - yRange - 20, entities[entity].length*(entities[entity].stats.hp[1]/entities[entity].stats.maxHp[1]), 8)
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
            if (entities[socket.id].deathTime != 0){
                displayDeathScreen();
            }

            if (entities[socket.id].inventory.inventoryOpen){
                displayInventory();
            }
            fill("white")
            textSize(20);
            text("Location: " + entities[socket.id].location, 150, 30);


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

function mousePressed(){
    if (entities[socket.id] != null && entities[socket.id].inventory.inventoryOpen){
        socket.emit('pickUpItem', {id: socket.id, x: mouseX, y: mouseY});
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

function displayDeathScreen(){
    fill("red");
    textSize(30);
    text("YOU ARE DEAD", LENGTH/2, 100)
    textSize(20);
    text("Respawning In: " + (entities[socket.id].deathDuration -(gameTime - entities[socket.id].deathTime))/1000 + " seconds", LENGTH/2, 200)
}

function displayInventory(){
    // draw the basic outline of the inventory
    fill("#62B2F7");
    rect(100, 50, 400, 400)
    rect(150, 450, 300, 100)
    fill("black");
    textSize(20);
    text("Inventory", 300, 80)
    // draw out all the inventory boxes
    for(var i = 0; i < entities[socket.id].inventory.items.length; i++){
        fill ("grey")
        rect(entities[socket.id].inventory.items[i].x, entities[socket.id].inventory.items[i].y,
            entities[socket.id].inventory.items[i].length, entities[socket.id].inventory.items[i].width)
        
        // draw out the items themselves
        drawItem(entities[socket.id].inventory.items[i].itemName, entities[socket.id].inventory.items[i].x + 30,
            entities[socket.id].inventory.items[i].y + 40, false, socket.id)
        
        // write the slot information
        if (!Number.isInteger(entities[socket.id].inventory.items[i].slot)){
            fill("black")
            text(entities[socket.id].inventory.items[i].slot, entities[socket.id].inventory.items[i].x + 
                entities[socket.id].inventory.items[i].length/2, entities[socket.id].inventory.items[i].y - 10);
        }
    }  
    
    // write stats
    var num = 0;
    for (var stat in entities[socket.id].stats){
        fill("black")
        textSize(12)
        textAlign(LEFT)
        if (num < 4){
            text(entities[socket.id].stats[stat][0] + ": " + entities[socket.id].stats[stat][1], 160 + num*70, 470)
        } else {
            text(entities[socket.id].stats[stat][0] + ": " + entities[socket.id].stats[stat][1], 160 + (num-4)*70, 500)
        }
        num ++;
        textAlign(CENTER)
    }

    //describe items when hovering
    for(var i = 0; i < entities[socket.id].inventory.items.length; i++){
        if (contains(mouseX, mouseY, entities[socket.id].inventory.items[i]) && entities[socket.id].inventory.items[i].itemName != ""){
            fill("#2282FF");
            rect(mouseX, mouseY, 300, 100);
            fill("black");
            textSize(15);
            text(entities[socket.id].inventory.items[i].itemName, mouseX + 150, mouseY + 20)
            textSize(10);
            text(entities[socket.id].inventory.items[i].item.description, mouseX + 150, mouseY + 40)
            var statsMessage = "";
            for (stat in entities[socket.id].inventory.items[i].item.stats){
                statsMessage += entities[socket.id].inventory.items[i].item.stats[stat][0] + ": " + 
                entities[socket.id].inventory.items[i].item.stats[stat][1] + " "
            }
            text(statsMessage, mouseX + 150, mouseY + 80)
        }
    }

    if (entities[socket.id].inventory.itemSelected != null){
        drawItem(entities[socket.id].inventory.itemSelected, mouseX, mouseY, false, socket.id)
    }
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

function drawItem(itemName, x, y, flip, id){
    push();
    if (entities[id].dir == "left" && flip){
        scale(-1, 1)
        x = -x - 20
    }
    if (itemName == "Ranger Hat"){
        fill("brown");
        rect(x, y - 5, 20, 5);
        rect(x-10, y, 40, 5);
    } else if (itemName == "Mercenary Cap"){
        fill("#464749");
        rect(x, y - 8, 20, 8);
        rect(x, y, 25, 5);
    }
    pop();
}

function contains(x, y, rect){
    return (x >= rect.x && x <= rect.x + rect.length && y >= rect.y && y <= rect.y + rect.width)
}