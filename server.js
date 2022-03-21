import { Bullet } from "./bullet.js"
import { Wall } from "./wall.js"
import { Entity } from "./entity.js"
import { Weapon } from "./weapon.js"
import { Portal } from "./portal.js"
import express from "express"
import { Server } from "socket.io"
import { Room } from "./room.js"

// var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
console.log("MY server is running!");

// var socket = require('socket.io');

var io = new Server(server);

io.sockets.on('connection', newConnection);

var entities = {};
var game = {
    n:0
};
var rooms = []
//entities[-1] = new Entity("Enemy", "npc", 100, 100, 20, 30, 100, "pistol", "purple", -1, gameTime,-1, 0.5,6);
var walls = []
var bullets = []
var portals = [];
portals.push(new Portal("dungeon01", 1200, 230, 30, 40, "cyan", 5))
var gameTime = 0;
createSection("lobby", 0, 0, 1650, 500)

function newConnection(socket){
    socket.on("disconnect", () => {
        delete entities[socket.id];
    });
    
    console.log("new connection: " + socket.id);
    entities[socket.id] = new Entity(socket.id, "Player", 100 + randint(-20, 20), 100, 20, 30, 100, "smg", 
    "purple", 0, gameTime, socket.id,1,6)

    socket.on("key", keyMsg);
    socket.on("interact", enterPortal);
    socket.on("openInventory", openInventory);
    socket.on("shoot", triggerBullet);

    function keyMsg(key) {
        //data is the key pressed
        if (Object.keys(entities).indexOf(socket.id) != -1) {
          entities[socket.id].move(key);
          // socket.broadcast.emit('key', data); // this sends to everyone minus the client that sent the message
        }
    }

    function triggerBullet(aimPos){
        if (entities[socket.id] != null){
            entities[socket.id].shoot(gameTime, bullets, aimPos)
        }
    }

    function enterPortal(id){
        if (entities[id].interact != null){
            findPortalDestination(entities[id].interact.name, id)
        }
    }

    function openInventory(id){
        if(entities[id] != null){
            entities[id].inventory.inventoryOpen = !entities[id].inventory.inventoryOpen;
        }
    }
}

setInterval(update, 15);

function update(){
    gameTime ++;
    io.sockets.emit("sendingUpdate", [gameTime, entities, walls, bullets, portals]);
    
    if (Object.keys(entities).length != 0){
        Object.keys(entities).forEach(function(key) {
            entities[key].update(walls);
            entities[key].setRoom(rooms);
            entities[key].accelerate();
            entities[key].checkInteract(portals);
            entities[key].aiMovement(entities, entities[key], bullets, gameTime);
            entities[key].checkDeath(entities, gameTime, game.n);
            game.n ++;
        });
    }

    for (var i = 0; i < bullets.length; i ++){
        bullets[i].updateBulletLocation(entities, walls, bullets)
    }

    for (var i = rooms.length-1; i >= 0; i --){
        if (gameTime - rooms[i].lastChecked > 100){
            rooms[i].lastChecked = gameTime;
            if (rooms[i].checkEmpty(entities, rooms[i]) && rooms[i].name != "lobby"){
                rooms[i].deleteArray(walls);
                rooms[i].deleteDictionary(entities, rooms[i]);
                rooms.splice(i, 1);
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

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function findPortalDestination(nameOfPortal, id){
    var foundRoom = false;
    for (var i = 0; i < rooms.length; i ++){
        if (nameOfPortal == rooms[i].name){
            entities[id].x = rooms[i].x + 100
            entities[id].y = rooms[i].y + 50;
            foundRoom = true;
        }
    }
    if (!foundRoom){
        createSection(nameOfPortal, randint(0, 1000), randint(0, 1000));
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

function createSection(name, x, y){
    if (name == "lobby"){
        var length = 1650;
        var width = 500;
    } else if (name == "dungeon01"){
        var length = 6400;
        var width = 500;
    }
    rooms.push(new Room(name, x, y, length + 50, width + 50, gameTime));
    while(!checkAvailable(rooms[rooms.length-1], rooms)){
        rooms[rooms.length-1].x = randint(0, 1000);
        rooms[rooms.length-1].y = randint(0, 1000);
    }
    x = rooms[rooms.length-1].x
    y = rooms[rooms.length-1].y
    
    walls.push(new Wall("wall", x, y, length, 20,"silver"));
    walls.push(new Wall("wall", x, y, 20, width,"silver"));
    walls.push(new Wall("wall", x, y + width, length, 20,"silver"));
    walls.push(new Wall("wall", x+ length, y, 20, width,"silver"));
    generateLevel(name, x, y + width, length);
}

function generateLevel(levelName, x, y, length){
    var segmentLength;
    var segmentHeight;
    var listOfRooms;
    if (levelName == "dungeon01"){
        segmentLength = 800;
        segmentHeight = 500;
        listOfRooms = ["house", "tree"];
    } else if (levelName == "lobby"){
        segmentLength = 1650;
        listOfRooms = []
        walls.push(new Wall("wall", x, y, 1600, 50, "silver"));
        walls.push(new Wall("wall", x, y-500, 50, 550, "silver"));
        walls.push(new Wall("wall", x, y-500, 1650, 50, "silver"));
        walls.push(new Wall("wall", x+506,y-128,269, 128, "silver"))
        walls.push(new Wall("wall", x+506,y-500,269, 128, "silver"))
        walls.push(new Wall("wall", x+755,y-370,19, 117, "silver"))
        walls.push(new Wall("wall", x+505,y-372,23, 120, "silver"))
        walls.push(new Wall("wall", x+950, y-230, 500, 30, "silver"))
        walls.push(new Wall("wall", x+1650, y-500, 50, 550, "silver"))
    }

    for (var i = 0; i < length/segmentLength; i ++){
        var roomToGenerate = listOfRooms[randint(0, listOfRooms.length-1)];
        var lastRoom = length/segmentLength -1;
        var xLocation = x + segmentLength*(i);
        if (i == lastRoom && levelName != "lobby"){
            walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
            portals.push(new Portal("lobby", xLocation + 700, y - 40, 30, 40, "blue", 5))
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
            for (var c =0; c < randint(3,5); c ++){
                summonEnemy("Grunt", xLocation, y, x+segmentLength*(i+1), y- segmentHeight);
            }
        } else if (roomToGenerate == "tree"){
            walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
            walls.push(new Wall("wall", xLocation + 205, y - 100, 40, 100, "brown"));
            walls.push(new Wall("wall", xLocation + 175, y - 200, 100, 100, "green"));
            walls.push(new Wall("wall", xLocation + 505, y - 100, 40, 100, "brown"));
            walls.push(new Wall("wall", xLocation + 475, y - 200, 100, 100, "green"));
            for (var c =0; c < randint(3,5); c ++){
                summonEnemy("Grunt", xLocation, y, x+segmentLength*(i+1), y- segmentHeight);
            }
        }
    }
}

function summonEnemy(name, x, y, xLimit, yLimit){
    if (name == "Grunt"){
        var length = 20;
        var width = 30;
        var hp = 100;
        var weaponName = "pistol";
        var colour = "red"
        var xSpeed = 0.5;
        var ySpeed = 6;
    }
    entities[game.n] = new Entity(name, "npc", randint(x, xLimit), randint(y, yLimit), length, width, hp, weaponName, colour,
    -1, gameTime, game.n, xSpeed, ySpeed);
    while (!checkAvailable(entities[game.n], walls)){
        entities[game.n].x = randint(x, xLimit);
        entities[game.n].y = randint(y, yLimit);  
    }

    game.n ++;
}