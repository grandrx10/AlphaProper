import { Bullet } from "./bullet.js"
import { Wall } from "./wall.js"
import { Entity } from "./entity.js"
import { Weapon } from "./weapon.js"
import { Interactable } from "./interactable.js"
import express from "express"
import { Server } from "socket.io"
import { Room } from "./room.js"
import { Item } from "./item.js"
import { SimpleEntity } from "./simpleEntity.js"
import { SimpleBullet } from "./simpleBullet.js"
import { Rect } from "./rect.js"
import { EnemyStats } from "./enemyStats.js"

// var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
console.log("MY server is running!");

// var socket = require('socket.io');

var io = new Server(server);

io.sockets.on('connection', newConnection);

let d = new Date();
let gameTime = d.getTime();

// setInterval(updateGameTime, 10);
// function updateGameTime(){
//     d = new Date();
//     gameTime = d.getTime()
// }

var entities = {};
var game = {
    n:0
};
var rooms = []
//entities[-1] = new Entity("Enemy", "npc", 100, 100, 20, 30, 100, "pistol", "purple", -1, gameTime,-1, 0.5,6);
var walls = []
var bullets = []
var particles = []
var interactables = [];
interactables.push(new Interactable("dungeon01", 1200, 230, 30, 40, "cyan", "portal", gameTime, game.n))
game.n++;
interactables.push(new Interactable("Loot", 100, 100, 15, 15, "brown", "bag", gameTime))
createSection("lobby", 0, 0, 1650, 500, -2)

function newConnection(socket){
    socket.on("disconnect", () => {
        delete entities[socket.id];
    });
    
    entities[socket.id] = new Entity(socket.id, "Player", 100 + randint(-20, 20), 100, 20, 30, 100, ["smg", ""], 
    "purple", 0, gameTime, socket.id,1,6)

    socket.on("key", keyMsg);
    socket.on("interact", interact);
    socket.on("openInventory", openInventory);
    socket.on("shoot", triggerBullet);
    socket.on("pickUpItem", pickUpItem);

    function keyMsg(key) {
        //data is the key pressed
        if (Object.keys(entities).indexOf(socket.id) != -1 && entities[socket.id].deathTime == 0) {
          entities[socket.id].move(key);
          // socket.broadcast.emit('key', data); // this sends to everyone minus the client that sent the message
        }
    }

    function triggerBullet(aimPos){
        if (entities[socket.id] != null && entities[socket.id].deathTime == 0 &&
            entities[socket.id].inventory.inventoryOpen == false){
            entities[socket.id].attackInfo.preformAttack(entities[socket.id].attacks[0][0],0,
                bullets,entities, entities[socket.id], gameTime,
                aimPos[0], aimPos[1])
        }
    }

    function interact(id){
        if (entities[id].interact != null && entities[socket.id].deathTime == 0){
            if (entities[id].interact.type == "portal"){
                findPortalDestination(id)
            } else if (entities[id].interact.type == "bag"){
                entities[id].inventory.inventoryOpen = true;
            } else if (entities[id].interact.type == "healStation"){
                if (!entities[id].interact.checkForDuplicate(bullets)){
                    bullets.push(new Bullet(entities[id].interact.x + entities[id].interact.length,
                        entities[id].interact.y, 0, 0, 0,-1,"rect", -1, -1,gameTime, entities[id].interact.id,"green", 100, 20, true, true));
                    }
            }
        }
    }

    function openInventory(id){
        if(entities[id] != null && entities[socket.id].deathTime == 0){
            if (entities[id].inventory.inventoryOpen && entities[id].inventory.itemSelected != null){
                var returnedItem = false;
                for (var i = 0; i < entities[id].inventory.items.length && !returnedItem; i++){
                    // return the item to its original slot if they have their inventory open
                    if (entities[id].inventory.items[i].itemName == "" && (Number.isInteger(entities[id].inventory.items[i].slot)
                    || entities[id].inventory.items[i].slot == entities[id].inventory.items[i].item.slot)){
                        entities[id].inventory.items[i].itemName = entities[id].inventory.itemSelected;
                        entities[id].inventory.items[i].refreshItem();
                        returnedItem = true;
                    }
                }
            }
            entities[id].inventory.inventoryOpen = !entities[id].inventory.inventoryOpen;
            entities[id].inventory.itemSelected = null;
        }
    }

    function pickUpItem(list){
        if (entities[list.id].interact != null){
            takeItem(list, entities[list.id].interact.inventory)
        }
        takeItem(list, entities[list.id].inventory)
        dropItem(list, entities[list.id].inventory, entities[list.id].interact)
    }
}

function dropItem(list, inventory1, inventory2){
    if ( entities[list.id].inventory.itemSelected != null){
        var dropped = true;
        if (inventory2 != null){
            inventory2 = inventory2.inventory
            for (var i = 0; i < inventory1.rects.length; i ++){
                for (var c = 0; c < inventory2.rects.length; c ++){
                    if (contains(list.x, list.y, inventory1.rects[i]) || contains(list.x, list.y, inventory2.rects[c])){
                        dropped = false;
                    }
                }
            }
        } else {
            for (var i = 0; i < inventory1.rects.length; i ++){
                if (contains(list.x, list.y, inventory1.rects[i])){
                    dropped = false;
                    
                }
            }
        }
        
        if (dropped){
            interactables.push(new Interactable("Loot", entities[list.id].x,
                entities[list.id].y, 15, 15, "brown", "bag", gameTime));
                interactables[interactables.length -1].addToInventory(entities[list.id].inventory.itemSelected)
                entities[list.id].inventory.itemSelected = null
                entities[list.id].updateStats();
        }
    }
}

function takeItem(list, inventory){
    // when they pick up the item
    for (var i = 0; i < inventory.items.length; i++){
        if ( entities[list.id].inventory.itemSelected == null){
            if (contains(list.x, list.y, inventory.items[i]) 
                && inventory.items[i].itemName != ""){
                entities[list.id].inventory.itemSelected = inventory.items[i].itemName;
                inventory.items[i].itemName = ""
                inventory.items[i].refreshItem();
                entities[list.id].updateStats();
            }
        } else {
            if (contains(list.x, list.y, inventory.items[i]) 
                && (Number.isInteger(inventory.items[i].slot)||
                inventory.items[i].slot == new Item(inventory.itemSelected).slot)){
                

                var temp = entities[list.id].inventory.itemSelected
                entities[list.id].inventory.itemSelected = inventory.items[i].itemName;
                inventory.items[i].itemName = temp
                inventory.items[i].refreshItem();
                if (entities[list.id].inventory.itemSelected == ""){
                    entities[list.id].inventory.itemSelected = null
                }
                entities[list.id].updateStats();
            } 
        }
    }
}

setInterval(update, 1);

var oldTime = 0
// UPDATE THE SERVER ---------------------------------------------------------------------------------//
function update(){
    d = new Date();
    gameTime = d.getTime()
    if (gameTime - oldTime > 14){

        oldTime = gameTime
        if (Object.keys(entities).length != 0){
            Object.keys(entities).forEach(function(key) {
                if (entities[key].type == "Player"){
                    // send update, optimize entities
                    var sendEntities = {};

                    if (Object.keys(entities).length != 0){
                        Object.keys(entities).forEach(function(id) {
                            if (distance(entities[key].x + entities[key].length/2, entities[key].y + entities[key].width/2,
                            entities[id].x + entities[id].length/2, entities[id].y + entities[id].width/2) < 1450){
                                sendEntities[id] = new SimpleEntity(entities[id].name, entities[id].type, 
                                    entities[id].x, entities[id].y, entities[id].length,
                                    entities[id].width, entities[id].dir, entities[id].stats,
                                    entities[id].colour, entities[id].location, entities[id].interact,
                                    entities[id].shake, entities[id].inventory, entities[id].deathTime, entities[id].deathDuration,
                                    entities[id].speech)
                            }
                        });
                    }

                    var simpleBullets = [];

                    for (var i = 0; i < bullets.length; i ++){
                        simpleBullets.push(new SimpleBullet(bullets[i].x, bullets[i].y, bullets[i].colour,
                            bullets[i].length, bullets[i].width));
                    }


                    io.to(key).emit('sendingUpdate', [gameTime, sendEntities, walls, bullets, interactables, particles])
                }

                entities[key].update(walls);
                entities[key].setRoom(rooms);
                entities[key].accelerate();
                entities[key].checkInteract(interactables);
                entities[key].aiMovement(entities, entities[key], bullets, gameTime);
                entities[key].checkDeath(entities, gameTime, interactables, particles);
                game.n ++;
            });
        }

        for (var i = 0; i < bullets.length; i ++){
            bullets[i].updateBulletLocation(entities, walls, bullets, gameTime, particles)
        }


        for (var i = particles.length-1; i >= 0; i --){
            particles[i].accelerate();
            particles[i].update(walls)
            particles[i].checkExpire(gameTime, particles);
        }

        sortList(interactables, "bag")
        for (var i = interactables.length-1; i >= 0; i --){
            interactables[i].update(walls);
            interactables[i].checkExpire(gameTime, interactables);
            if (interactables[i] != null && interactables[i].type == "bag" && interactables[i].checkEmpty()){
                interactables.splice(i, 1);
            }
        }

        for (var i = rooms.length-1; i >= 0; i --){
            var listOfDungeons = ["dungeon01"]
            for (var c = 0; c < listOfDungeons.length; c ++){
                if (rooms[i].name == "lobby" && !rooms[i].checkForPortal(interactables, listOfDungeons[c]) && randint(1, 1000) < 5){
                    interactables.push(new Interactable(listOfDungeons[c], randint(1000, 1300), 230, 30, 40, "cyan", "portal", gameTime, game.n))
                    game.n ++;
                }
            }

            if (gameTime - rooms[i].lastChecked > 100){
                rooms[i].lastChecked = gameTime;
                if (rooms[i].checkEmpty(entities, rooms[i]) && rooms[i].name != "lobby"){
                    rooms[i].deleteArray(walls);
                    rooms[i].deleteArray(interactables);
                    rooms[i].deleteDictionary(entities, rooms[i]);
                    rooms.splice(i, 1);
                }
            }
        }
    }
}

function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rectRectDetect(rect, rect2){
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
    bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime));
}

function contains(x, y, rect){
    return (x >= rect.x && x <= rect.x + rect.length && y >= rect.y && y <= rect.y + rect.width)
}

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function findPortalDestination(id){
    var foundRoom = false;
    for (var i = 0; i < rooms.length; i ++){
        if (entities[id].interact.id == rooms[i].id){
            entities[id].x = rooms[i].x + 100
            entities[id].y = rooms[i].y + 50;
            // CHANGE THIS LATER DO NOT DO THIS!
            if (rooms[i].name != "lobby" && rooms[i].name != "Warlord's Lair"){
                entities[id].interact.expireTime = 10000;
                entities[id].interact.creationTime = gameTime;
            }
            foundRoom = true;
        }
    }
    if (!foundRoom){
        createSection(entities[id].interact.name, randint(0, 10000), randint(0, 10000), entities[id].interact.id);
    }
}

function checkAvailable (rect, arrayOfRect){
    for(var i = 0; i < arrayOfRect.length; i ++){
        if (rectRectDetect(rect, arrayOfRect[i]) && rect != arrayOfRect[i]){
            return false;
        }
    }
    return true;
}

function createSection(name, x, y, id){
    if (name == "lobby"){
        var length = 1650;
        var width = 500;
        var id = -2
    } else if (name == "dungeon01"){
        var length = 6400;
        var width = 500;
    } else if (name == "Warlord's Lair"){
        var length = 1200;
        var width = 500;
    }
    rooms.push(new Room(name, x, y, length + 100, width + 50, gameTime, id));
    while(!checkAvailable(rooms[rooms.length-1], rooms)){
        rooms[rooms.length-1].x = randint(0, 1000);
        rooms[rooms.length-1].y = randint(0, 1000);
    }
    x = rooms[rooms.length-1].x
    y = rooms[rooms.length-1].y
    
    walls.push(new Wall("wall", x, y, length, 20,"silver"));
    walls.push(new Wall("wall", x, y, 20, width,"silver"));
    walls.push(new Wall("wall", x, y + width, length, 20,"silver"));
    walls.push(new Wall("wall", x+ length - 20, y, 20, width,"silver"));
    generateLevel(name, x, y + width, length);
}

function generateLevel(levelName, x, y, length){
    var segmentLength;
    var segmentHeight;
    var listOfRooms = [];
    var possibleMobs = [];
    var finalPortal = "lobby"
    var bossRoom = false;
    var enemyNumber = {
        max: 0,
        min: 0
    }
    switch(levelName){
        case "dungeon01":
            segmentLength = 800;
            segmentHeight = 500;
            listOfRooms = ["overArch", "house", "tree"];
            possibleMobs = ["Goblin Grunt", "Goblin Archer", "Goblin Brute"]
            finalPortal = "Warlord's Lair"
            enemyNumber.min = 1;
            enemyNumber.max = 3;
            break;
        case "lobby":
            segmentLength = 1650;
            walls.push(new Wall("wall", x, y, 1600, 50, "silver"));
            walls.push(new Wall("wall", x, y-500, 50, 550, "silver"));
            walls.push(new Wall("wall", x, y-500, 1650, 50, "silver"));
            walls.push(new Wall("wall", x+506,y-128,269, 128, "silver"))
            walls.push(new Wall("wall", x+506,y-500,269, 128, "silver"))
            walls.push(new Wall("wall", x+755,y-370,19, 117, "silver"))
            walls.push(new Wall("wall", x+505,y-372,23, 120, "silver"))
            walls.push(new Wall("wall", x+950, y-230, 500, 30, "silver"))
            walls.push(new Wall("wall", x+1650, y-500, 50, 550, "silver"))
            interactables.push(new Interactable("Healing Station", x+1000, y-40, 30, 40, "brown", "healStation", gameTime, game.n))
            game.n ++;
            break;
        case "Warlord's Lair":
            segmentLength = 1200;
            segmentHeight = 500;
            bossRoom = true;
            walls.push(new Wall("wall", x + 200, y - 100, 200, 20, "silver"));
            walls.push(new Wall("wall", x + 800, y - 100, 200, 20, "silver"));
            summonEnemy("Goblin Warlord", x+ 600, y-60)
    }

    for (var i = 0; i < length/segmentLength; i ++){
        var roomToGenerate = listOfRooms[randint(0, listOfRooms.length-1)];
        var lastRoom = length/segmentLength -1;
        var xLocation = x + segmentLength*(i);
        if (i == lastRoom && levelName != "lobby" && !bossRoom){
            walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
            interactables.push(new Interactable(finalPortal, xLocation + 700, y - 40, 30, 40, "blue", "portal", gameTime, game.n))
            game.n ++;
        }
        else if (roomToGenerate == "empty" || i == 0){
            walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
        } else if (roomToGenerate == "house"){
            walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
            walls.push(new Wall("wall", xLocation + 100, y - 300, 20, 200, "silver"));
            walls.push(new Wall("wall", xLocation + 70, y - 150, 30, 20, "silver"));
            walls.push(new Wall("wall", xLocation + 700, y - 150, 30, 20, "silver"));
            walls.push(new Wall("wall", xLocation + 680, y - 300, 20, 200, "silver"));
            walls.push(new Wall("wall", xLocation + 100, y - 300, 580, 20, "silver"));
            walls.push(new Wall("wall", xLocation + 400, y - 150, 20, 150, "silver"));
            walls.push(new Wall("wall", xLocation + 350, y - 150, 120, 20, "silver"));
        } else if (roomToGenerate == "tree"){
            walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "darkgreen"));
            walls.push(new Wall("wall", xLocation + 205, y - 100, 40, 100, "brown"));
            walls.push(new Wall("wall", xLocation + 175, y - 200, 100, 100, "green"));
            walls.push(new Wall("wall", xLocation + 505, y - 100, 40, 100, "brown"));
            walls.push(new Wall("wall", xLocation + 475, y - 200, 100, 100, "green"));
        } else if (roomToGenerate == "overArch"){
            walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
            walls.push(new Wall("wall", xLocation + 100, y - segmentHeight, 50, segmentHeight-100, "silver"));
            walls.push(new Wall("wall", xLocation + 150, y - segmentHeight, 500, segmentHeight-300, "silver"));
            walls.push(new Wall("wall", xLocation + 650, y - segmentHeight, 50, segmentHeight-100, "silver"));
            walls.push(new Wall("wall", xLocation + 300, y-100, 200, 100, "silver"));
        }
        if (roomToGenerate != "empty" && i != 0 && i != lastRoom){
            for (var c =0; c < randint(enemyNumber.min,enemyNumber.max); c ++){
                summonEnemy(possibleMobs[randint(0, possibleMobs.length-1)], xLocation, y, x+segmentLength*(i+1), y- segmentHeight);
            }
        }
    }
}

function summonEnemy(name, x, y, xLimit, yLimit){
    if (xLimit == null){
        xLimit = x;
        yLimit = y;
    }

    var enemyStats = new EnemyStats().getStats(name);
    entities[game.n] = new Entity(name, "npc", randint(x, xLimit), randint(y, yLimit), enemyStats.length, enemyStats.width, 
    enemyStats.hp, enemyStats.weaponName, enemyStats.colour,
    -1, gameTime, game.n, enemyStats.xSpeed, enemyStats.ySpeed, enemyStats.engageRange);
    entities[game.n].attacks = enemyStats.attacks
    entities[game.n].drops = enemyStats.drops
    entities[game.n].speechList = enemyStats.speechList
    entities[game.n].boss = enemyStats.boss
    entities[game.n].travelMap.detectRange = enemyStats.detectRange
    while (!checkAvailable(entities[game.n], walls)){
        entities[game.n].x = randint(x, xLimit);
        entities[game.n].y = randint(y, yLimit);  
    }

    game.n ++;
}

function sortList(list, keyInBack){
    var changed = true;
    while(changed){
        changed = false
        for(var i = 0; i < list.length - 1; i ++){
            if (list[i].type == keyInBack && list[i+1].type != keyInBack){
                var temp = list[i];
                list[i] = list[i+1];
                list[i+1] = temp
                changed = true;
            }
        }
    }
}
