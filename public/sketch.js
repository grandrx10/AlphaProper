
var socket;

var gameStart = [false, ""];
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
var currentSong = [""]

let goblinWarlordSong;
let goblinForestSong;
let crusadeSong;
let paladinSong;
let theatreSong;
let stageSong;
var songList = [];

let song;

function setup(){
    createCanvas(1400, 600);
    socket = io();
    preload();
    socket.on('gameStart', startGame);
    socket.on('displayName', displayName);
    socket.on('sendingUpdate', update);

}

function preload(){
    clientFont = loadFont('RedHatMono-Regular.ttf')
    goblinWarlordSong = createAudio("Assets/WarlordBossTheme.mp3")
    goblinForestSong = createAudio("Assets/GoblinForestTheme.mp3")
    crusadeSong = createAudio("Assets/CrusadeTheme.mp3")
    paladinSong = createAudio("Assets/PaladinTheme.mp3")
    theatreSong = createAudio("Assets/TheatreTheme.mp3")
    stageSong = createAudio("Assets/StageTheme.mp3")
    songList = [[goblinForestSong, "Goblin Forest"], [goblinWarlordSong, "Warlord's Lair"],
    [crusadeSong, "Crusader Encampment"], [paladinSong, "High Priest's Quarters"],
    [theatreSong, "The Theatre"], [stageSong, "The Stage"],]
}

function playMusic(){
    // Optimize this
    for (var i = 0; i < songList.length; i ++){
        if (entities[socket.id].location == songList[i][1] && currentSong[0] != entities[socket.id].location){
            if (song != null){
                song.stop();
            }
            song = songList[i][0]
            song.play()
            song.volume(0.05);
            song.loop();
            currentSong[0] = songList[i][1]
        } else if (entities[socket.id].location == "lobby"){
            if (song != null){
                song.stop();
            }
            currentSong[0] = "lobby"
        }
    }
}

function draw(){
    frameRate(144)
    background(28, 28, 28);

    if (!gameStart[0]){
        textSize(20)
        textAlign(CENTER)
        fill("white")
        text("Enter The Adventurer's Name: ", LENGTH/2, WIDTH/2)
        textSize(16)
        fill("white")
        text(gameStart[1], LENGTH/2, WIDTH/2 + 40)
    }

    if (gameStart[0]){

        if (entities[socket.id] != null){
            playMusic();
            cameraShake();
            xRange = entities[socket.id].x - LENGTH/2;
            yRange = entities[socket.id].y - WIDTH/2;
        }

        for (let i = bullets.length-1; i >= 0; i --){
            if (bullets[i] != null){
                if (bullets[i].delay != null){
                    fill("WHITE");
                    strokeWeight(20)
                    line(bullets[i].x-xRange, bullets[i].y-yRange, bullets[i].aimX-xRange, bullets[i].aimY-yRange)
                    strokeWeight(1)
                } else {
                    fill(bullets[i].colour)
                    if (bullets[i].type == "circle")
                        ellipse(bullets[i].x -xRange, bullets[i].y -yRange, bullets[i].r, bullets[i].r)
                    else {
                        rect(bullets[i].x -xRange, bullets[i].y -yRange, bullets[i].length, bullets[i].width)
                    }
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
                    let slot = entities[entity].inventory.items[i].slot
                    switch(slot){
                        case "Head":
                            drawItem(entities[entity].inventory.items[i].itemName, entities[entity].x - xRange,
                                entities[entity].y - yRange, true, entity, slot)
                            break;
                        case "Chest":
                            drawItem(entities[entity].inventory.items[i].itemName, entities[entity].x - xRange,
                                entities[entity].y - yRange + 10, true, entity, slot)
                            break;
                        case "Weapon":
                            drawItem(entities[entity].inventory.items[i].itemName, entities[entity].x - xRange + entities[entity].length,
                                entities[entity].y - yRange, true, entity, slot)
                            break;
                        case "Ability":
                            drawItem(entities[entity].inventory.items[i].itemName, entities[entity].x - xRange,
                                entities[entity].y - yRange + 10, true, entity, slot)
                            break;
                    }
                }
            } else if (entities[entity].type == "npc" && entities[entity].stats.hp[1] > 0){
                drawEnemy(entities[entity].name, entities[entity].x- xRange, entities[entity].y- yRange, entity)
            }

            drawEffects(entities[entity].effects, 50);
            drawEffects(entities[entity].negativeEffects, 70);

            // Health Bars
            fill("grey");
            rect(entities[entity].x - xRange, entities[entity].y - yRange - 25, entities[entity].length, 8);
            fill("green");
            rect(entities[entity].x - xRange, entities[entity].y - yRange - 25, 
                entities[entity].length*(entities[entity].stats.hp[1]/entities[entity].stats.maxHp[1]), 8)

            // Mana bars
            if (entities[entity].type == "Player"){
                fill("grey");
                rect(entities[entity].x - xRange, entities[entity].y - yRange - 17, entities[entity].length, 4);
                fill("cyan");
                rect(entities[entity].x - xRange, entities[entity].y - yRange - 17, 
                    entities[entity].length*(entities[entity].stats.mana[1]/entities[entity].stats.maxMana[1]), 4)
            }
            
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

            displayBossBar();
            fill("white")
            textSize(20);
            text("Location: " + entities[socket.id].location, 200, 30);


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

            if (keyIsDown(32)){
                socket.emit('castAbility', [mouseX + xRange, mouseY + yRange]);
            }
        }

        if (mouseIsPressed){
            socket.emit('shoot', [mouseX + xRange, mouseY + yRange]);
        }
    }

};

function keyPressed() {
    if (!gameStart[0]){
        socket.emit('sendName', [socket.id, key]);
    }

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
    text("YOU ARE DEAD", LENGTH/2, 150)
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
        if (stat != "maxMana" && stat != "maxHp"){
            if (num < 4){
                text(entities[socket.id].stats[stat][0] + ": " + 
                Math.round(entities[socket.id].stats[stat][1] + entities[socket.id].effects[stat].amount), 160 + num*75, 470)
            } else if (num < 8) {
                text(entities[socket.id].stats[stat][0] + ": " + Math.round(entities[socket.id].stats[stat][1] + 
                    entities[socket.id].effects[stat].amount), 160 + (num-4)*75, 500)
            } else {
                text(entities[socket.id].stats[stat][0] + ": " + Math.round(entities[socket.id].stats[stat][1] + 
                    entities[socket.id].effects[stat].amount), 160 + (num-8)*75, 530)
            }
            num ++;
        }
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

function update(returnList){
    entities = returnList[1];
    gameTime = returnList[0];
    walls = returnList[2];
    bullets = returnList[3];
    interactables = returnList[4];
    particles = returnList[5];
}

function drawEnemy(enemyName, x, y,id){
    push();
    if (entities[id].dir == "left"){
        scale(-1, 1)
        x = -x - 20
    }

    if (enemyName == "Paladin Of The Order" || enemyName == "Fallen Paladin"){
        fill("rgb(237, 133, 133)")
        rect(x  - 2, y, 24, 12)
        rect(x - 7, y - 5, 10, 10)
        rect(x - 13, y - 2, 8, 20)
        fill("black")
        rect(x + 5, y+ 12, 4, 4)
        fill("black")
        rect(x + 15, y + 12, 4, 4)
    } else if (enemyName == "The Ascended Paladin"){
        fill("rgb(237, 133, 133)")
        rect(x  - 2, y, 24, 12)
        rect(x - 7, y - 5, 10, 10)
        rect(x - 13, y - 2, 8, 20)
        fill("red")
        rect(x + 5, y+ 12, 4, 4)
        fill("black")
        rect(x + 15, y + 12, 4, 4)
    }
    pop();
}

function drawItem(itemName, x, y, flip, id, slot){
    push();
    if (entities[id].dir == "left" && flip){
        scale(-1, 1)
        if (slot == "Weapon"){
            x = -x + 20
        }
        else {
            x = -x - 20
        }
    }
    switch(itemName){
        case "Ranger Hat":
            fill("brown");
            rect(x, y - 5, 20, 5);
            rect(x-10, y, 40, 5);
            break;
        case "Mercenary Cap":
            fill("#464749");
            rect(x, y - 8, 20, 8);
            rect(x, y, 25, 5);
            break;
        case "Knight's Helm":
            fill("silver");
            rect(x, y, 20, 12);
            fill("gray")
            rect(x + 5, y + 2, 18, 6);
            break;
        case "Puppet's Wig":
            fill("brown");
            rect(x, y-10, 20, 13);
            rect(x-2, y, 2, 6);
            rect(x + 20, y, 2, 6);
            break;
        case "Leather Tunic":
            fill(138, 50, 0);
            rect(x, y, 20, 20);
            break;
        case "Puppet's Robes":
            fill(147, 196, 182);
            rect(x, y, 20, 20);
            fill("black");
            rect(x + 5, y + 5, 10, 3);
            rect(x + 5, y + 12, 10, 3);
            break;
        case "Steel Armour":
            fill("silver");
            rect(x, y, 20, 20);
            break;
        case "Ranger's Cloak":
            fill("black");
            rect(x, y, 20, 4);
            fill("rgb(161, 102, 179)");
            rect(x, y, 8, 20);
            rect(x+12, y, 8, 20);
            break;
        case "Gluttonous Coat":
            fill("rgb(62, 94, 59)");
            rect(x, y, 8, 20);
            rect(x+12, y, 8, 20);
            break;
        case "Warlord's Vest":
            fill(150, 150, 150);
            rect(x, y, 20, 20);
            fill(33, 128, 9);
            rect(x + 5, y+5, 10, 10);
            break;
        case "Adventurer's Sword":
            fill(entities[id].colour)
            rect(x, y + entities[id].width/2, 5, 5);
            fill("silver");
            rect(x + 5, y, 4, 15);
            fill("brown");
            rect(x + 5, y + 15, 4, 6);
            break;
        case "Silver Longsword":
            fill(entities[id].colour)
            rect(x, y + entities[id].width/2, 5, 5);
            fill("white");
            rect(x + 5, y - 5, 4, 20);
            fill("brown");
            rect(x + 5, y + 15, 4, 6);
            break;
        case "Holy Blade":
            fill(entities[id].colour)
            rect(x, y + entities[id].width/2, 5, 5);
            fill("gold");
            rect(x + 5, y - 5, 4, 20);
            fill("brown");
            rect(x + 5, y + 15, 4, 6);
            break;
        case "Hearthwood Bow":
            fill(entities[id].colour)
            rect(x, y + entities[id].width/2, 8, 5);
            fill("rgb(45, 133, 23)");
            rect(x + 8, y+6, 4, 20);
            rect(x+3, y + 2, 4, 4);
            rect(x+3, y+26, 4, 4);
            break;
        case "Ranger's Bow":
            fill(entities[id].colour)
            rect(x, y + entities[id].width/2, 8, 5);
            fill("rgb(121, 93, 133)");
            rect(x + 8, y+6, 4, 20);
            rect(x+3, y + 2, 4, 4);
            rect(x+3, y+26, 4, 4);
            break;
        case "Hefty Club":
            fill(entities[id].colour)
            rect(x, y + entities[id].width/2, 5, 5);
            fill("brown");
            rect(x + 5, y+1, 6, 20);
            break;
        case "Vomit":
            fill(entities[id].colour)
            rect(x, y + entities[id].width/2, 5, 5);
            fill("green");
            rect(x + 5, y+4, 20, 20);
            break;
        case "Spell of Mending":
            fill("white");
            rect(x-3, y, 10, 15);
            fill("gray");
            rect(x-1, y+2, 6, 2);
            rect(x-1, y+6, 6, 2);
            rect(x-1, y+10, 6, 2);
            break;
        case "Flamestrike Spell":
            fill("white");
            rect(x-3, y, 10, 15);
            fill("red");
            rect(x-1, y+2, 6, 2);
            rect(x-1, y+6, 6, 2);
            rect(x-1, y+10, 6, 2);
            break;
        case "Steel Hammer":
            fill("brown");
            rect(x-7, y + 5, 15, 5);
            fill("gray");
            rect(x+3, y-2, 10, 15);
            fill(entities[id].colour)
            rect(x-5, y +2, 5, 8);
            break;
        case "Legion Shield":
            fill("red");
            rect(x - 3, y, 15, 20);
            fill("gray");
            rect(x-1, y+2, 11, 16)
            break;
        case "Teleportation Crystal":
            fill("rgb(215, 217, 115)");
            rect(x - 3, y, 10, 10);
            break;
        case "Summoning Banner":
            fill("gray");
            rect(x-3, y-5, 4, 22);
            fill("white");
            rect(x-7, y - 2, 12, 10)
            break;
        case "Minor Health Potion":
            fill("gray");
            rect(x-5, y + 2, 10, 12);
            rect(x-3, y - 2, 4, 4);
            fill("red");
            rect(x-3, y + 4, 6, 8);
            break;
        case "Minor Mana Potion":
            fill("gray");
            rect(x-5, y + 2, 10, 12);
            rect(x-3, y - 2, 4, 4);
            fill("cyan");
            rect(x-3, y + 4, 6, 8);
            break;
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
        statsMessage += chosenItem.item.stats[stat][0] + ":+" + 
        chosenItem.item.stats[stat][1] + " "
    }

    if ((chosenItem.item.slot == "Ability" || chosenItem.item.slot == "Weapon") && chosenItem.item.manaCost != null){
        statsMessage += "Mana Cost: " + chosenItem.item.manaCost
    }

    text(statsMessage, mouseX + i*150, mouseY + 80)
    text("Slot: " + chosenItem.item.slot, mouseX + i*150, mouseY + 95)
}

function startGame(boolean){
    gameStart[0] = boolean;
}

function displayName(name){
    gameStart[1] = name;
}

function displayBossBar(){
    if (entities[socket.id].closestBoss != null){
        fill("black");
        rect(200, 50, 1000, 40);
        fill("red");
        rect(200, 50, 1000*(entities[socket.id].closestBoss.stats.hp[1]/
        entities[socket.id].closestBoss.stats.maxHp[1]), 40);

        fill("white")
        textSize(20)
        text(Math.round(entities[socket.id].closestBoss.stats.hp[1]) + "/" + 
        Math.round(entities[socket.id].closestBoss.stats.maxHp[1]),
        LENGTH/2, 75);
        textSize(25)
        text(entities[socket.id].closestBoss.name,
        LENGTH/2, 35);
        
    }
}

function drawEffects(effects, yLevel){
    var count = 0;
    for (var effect in effects){
        if (effects[effect].amount > 0){
            count ++;
        }
    }

    for (var effect in effects){
        if (effects[effect].amount > 0){
            fill(effects[effect].colour);
            rect(entities[entity].x + entities[entity].length/2 - xRange - 8*(count-1) - 4, entities[entity].y - yRange - yLevel, 8, 8)
            count -= 2;
        }
    }
    
}