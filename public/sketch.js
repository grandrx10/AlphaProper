
var socket;

var gameStart = false;
var gameTime;

var entities = {}
var walls = []
var bullets = []
var interactables = []
var particles = []

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
                fill(bullets[i].colour)
                if (bullets[i].type == "circle")
                    ellipse(bullets[i].x -xRange, bullets[i].y -yRange, bullets[i].r, bullets[i].r)
                else {
                    rect(bullets[i].x -xRange, bullets[i].y -yRange, bullets[i].length, bullets[i].width)
                }
            }
        }

        for (wall in walls){
            fill(walls[wall].colour);
            rect(walls[wall].x - xRange + shake.x, walls[wall].y - yRange + shake.y, walls[wall].length, walls[wall].width);
        }

        for (interactable in interactables){
            fill(interactables[interactable].colour);
            rect(interactables[interactable].x - xRange + shake.x, interactables[interactable].y - yRange + shake.y, 
                interactables[interactable].length, interactables[interactable].width);
            textAlign(CENTER);
            fill("white")
            textSize(12);
            text(interactables[interactable].name, interactables[interactable].x +interactables[interactable].length/2- xRange, 
            interactables[interactable].y - yRange - 30)

            if (interactables[interactable].expireTime != -1){
                textSize(12);
                var tempText = Math.round((interactables[interactable].expireTime - gameTime + 
                    interactables[interactable].creationTime)/1000)
                text("Closing in: " + tempText, interactables[interactable].x +interactables[interactable].length/2- xRange, 
                interactables[interactable].y - yRange - 50)
            }
        }

        for (entity in entities){
            fill(entities[entity].colour);
            rect(entities[entity].x - xRange, entities[entity].y - yRange, entities[entity].length, entities[entity].width);
            if (entities[entity].type == "Player" && entities[entity].stats.hp[1] > 0){
                for (var i = 0; i < entities[entity].inventory.items.length; i ++){
                    if (entities[entity].inventory.items[i].slot == "Head"){
                        drawItem(entities[entity].inventory.items[i].itemName, entities[entity].x - xRange, entities[entity].y - yRange, true, entity)
                    } else if (entities[entity].inventory.items[i].slot == "Chest"){
                        drawItem(entities[entity].inventory.items[i].itemName, entities[entity].x - xRange, entities[entity].y - yRange + 10, true, entity)
                    }
                }
            }

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
                text(entities[entity].interact.text, entities[entity].x +entities[entity].length/2- xRange, entities[entity].y - yRange - 50)
            }

            if (entities[entity].speech != ""){
                fill("white");
                rect(entities[entity].x - xRange - 120, entities[entity].y - yRange - 100, 240 + entities[entity].length, 40);
                fill("black");
                textSize(12);
                text(entities[entity].speech, entities[entity].x + entities[entity].length/2 - xRange,
                entities[entity].y -85 - yRange)
            }

        }
        
        for(var i = 0; i < particles.length; i++){
            if (particles[i].type == "text"){
                textSize(12);
                fill(particles[i].colour);
                text(particles[i].name, particles[i].x - xRange, particles[i].y-yRange);
            }else {
                fill(particles[i].colour);
                rect(particles[i].x - xRange, particles[i].y-yRange, particles[i].length, particles[i].width);
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

            if (keyIsDown(69) && entities[socket.id].interact != null){ // interact (e)
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
    for (var i = 0; i < entities[socket.id].inventory.rects.length; i ++){
        rect(entities[socket.id].inventory.rects[i].x, entities[socket.id].inventory.rects[i].y, entities[socket.id].inventory.rects[i].length,
            entities[socket.id].inventory.rects[i].width)
    }
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

    // Draw out the loot bag
    if (entities[socket.id].interact != null){
        if (entities[socket.id].interact.type == "bag"){
            fill("#A45939");
            for (var i = 0; i < entities[socket.id].interact.inventory.rects.length; i ++){
                rect(entities[socket.id].interact.inventory.rects[i].x, entities[socket.id].interact.inventory.rects[i].y, 
                    entities[socket.id].interact.inventory.rects[i].length,
                    entities[socket.id].interact.inventory.rects[i].width)
            }
            fill("black");
            textSize(20);
            text("Bag", 1100, 80)
            for(var i = 0; i < entities[socket.id].interact.inventory.items.length; i++){
                fill ("grey")
                rect(entities[socket.id].interact.inventory.items[i].x, entities[socket.id].interact.inventory.items[i].y,
                    entities[socket.id].interact.inventory.items[i].length, entities[socket.id].interact.inventory.items[i].width)
                
                // draw out the items themselves
                drawItem(entities[socket.id].interact.inventory.items[i].itemName, entities[socket.id].interact.inventory.items[i].x + 30,
                    entities[socket.id].interact.inventory.items[i].y + 40, false, socket.id)

            }
            for(var i = 0; i < entities[socket.id].interact.inventory.items.length; i++){
                if (contains(mouseX, mouseY, entities[socket.id].interact.inventory.items[i]) 
                && entities[socket.id].interact.inventory.items[i].itemName != ""){
                    describeItem(entities[socket.id].interact.inventory.items[i], "#B34B1E")
                }
            }
        }
    }
    
    
    // write stats
    var num = 0;
    for (var stat in entities[socket.id].stats){
        fill("black")
        textSize(12)
        textAlign(LEFT)
        if (num < 4){
            text(entities[socket.id].stats[stat][0] + ": " + Math.round(entities[socket.id].stats[stat][1]), 160 + num*70, 470)
        } else {
            text(entities[socket.id].stats[stat][0] + ": " + Math.round(entities[socket.id].stats[stat][1]), 160 + (num-4)*70, 500)
        }
        num ++;
        textAlign(CENTER)
    }

    //describe items when hovering
    for(var i = 0; i < entities[socket.id].inventory.items.length; i++){
        if (contains(mouseX, mouseY, entities[socket.id].inventory.items[i]) && entities[socket.id].inventory.items[i].itemName != ""){
            describeItem(entities[socket.id].inventory.items[i], "#2282FF")
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
    interactables = returnList[4];
    particles = returnList[5];
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
    } else if (itemName == "Leather Tunic"){
        fill(138, 50, 0);
        rect(x, y, 20, 20);
    } else if (itemName == "Warlord's Vest"){
        fill(150, 150, 150);
        rect(x, y, 20, 20);
        fill(33, 128, 9);
        rect(x + 5, y+5, 10, 10);
    }
    pop();
}

function contains(x, y, rect){
    return (x >= rect.x && x <= rect.x + rect.length && y >= rect.y && y <= rect.y + rect.width)
}

function describeItem(chosenItem, colour){
    var i = 1;
    if (mouseX > LENGTH/2){
        i = -1;
    }
    fill(colour);
    rect(mouseX, mouseY, i*300, 100);
    fill("black");
    textSize(15);
    text(chosenItem.itemName, mouseX + i*150, mouseY + 20)
    textSize(10);
    text(chosenItem.item.description, mouseX + i*150, mouseY + 40)
    var statsMessage = "";
    for (stat in chosenItem.item.stats){
        statsMessage += chosenItem.item.stats[stat][0] + ": " + 
        chosenItem.item.stats[stat][1] + " "
    }
    text(statsMessage, mouseX + i*150, mouseY + 80)
}