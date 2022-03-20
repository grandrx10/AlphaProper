import { Bullet } from "./bullet.js"
import { Wall } from "./wall.js"
import { Entity } from "./entity.js"
import { Weapon } from "./weapon.js"
import express from "express"
import { Server } from "socket.io"
import { Room } from "./room.js"

// var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));
console.log("MY server is running!");

// var socket = require('socket.io');

var io = new Server(server);

io.sockets.on('connection', newConnection);

var entities = {};
var rooms = []
entities[-1] = new Entity("Enemy", "npc", 40, 100, 20, 30, 100, "pistol", "purple", -1, gameTime,-1, 0.5,3);
var walls = []
createSection("lobby", 0, 0, 3200, 500)
var bullets = []
var gameTime = 0;
var n = 0;

function newConnection(socket){
    socket.on("disconnect", () => {
        delete entities[socket.id];
    });
    
    console.log("new connection: " + socket.id);
    entities[socket.id] = new Entity(socket.id, "Player", 100 + randint(-20, 20), 100, 20, 30, 100, "smg", 
    "purple", socket.id, gameTime, socket.id,1,6)

    socket.on("key", keyMsg);
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
}

setInterval(update, 10);

function update(){
    gameTime ++;
    io.sockets.emit("sendingUpdate", [gameTime, entities, walls, bullets]);
    
    if (Object.keys(entities).length != 0){
        Object.keys(entities).forEach(function(key) {
            entities[key].update(walls);
            entities[key].setRoom(rooms);
            entities[key].accelerate();
            entities[key].aiMovement(entities, entities[key], bullets, gameTime);
            entities[key].checkDeath(entities, gameTime, n);
            n ++;
        });
    }

    for (var i = 0; i < bullets.length; i ++){
        bullets[i].updateBulletLocation(entities, walls, bullets)
    }
}

function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime));
}

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
}

function createSection(name, x, y, length, width){
    rooms.push(new Room(name, x, y, length, width));
    
    if (name == "lobby"){
        walls.push(new Wall("wall", x, y+300, 1600, 50, "silver"));
        walls.push(new Wall("wall", x-50, y-200, 50, 550, "silver"));
        walls.push(new Wall("wall", x-50, y-200, 1650, 50, "silver"));
        walls.push(new Wall("wall", x+456,y+172,269, 128, "silver"))
        walls.push(new Wall("wall", x+456,y-200,269, 128, "silver"))
        walls.push(new Wall("wall", x+705,y-70,19, 117, "silver"))
        walls.push(new Wall("wall", x+455,y-72,23, 120, "silver"))
        walls.push(new Wall("wall", x+900, y+70, 500, 30, "silver"))
        walls.push(new Wall("wall", x+1600, y-200, 50, 550, "silver"))
    } else if (name == "dungeon01"){
        generateLevel("dungeon01", x, y + width, length);
    }
}

function generateLevel(levelName, x, y, length){
    var segmentLength;
    var listOfRooms;
    if (levelName == "dungeon01"){
        segmentLength = 800;
        listOfRooms = ["empty", "house"];
    }

    walls.push(new Wall("wall", x, y, length, 20,"silver"));
    walls.push(new Wall("wall", x, y, 20, width,"silver"));
    walls.push(new Wall("wall", x, y + width, length, 20,"silver"));
    walls.push(new Wall("wall", x+ length, y, 20, width,"silver"));

    for (var i = 0; i < length/segmentLength; i ++){
        var roomToGenerate = listOfRooms[randint(0, listOfRooms.length-1)];
        if (roomToGenerate == "empty" || i == 0){
            walls.push(new Wall("wall", x + segmentLength*(i), y, segmentLength, 50, "silver"));
        } else if (roomToGenerate == "house"){
            walls.push(new Wall("wall", x + segmentLength*(i), y, segmentLength, 50, "silver"));
            walls.push(new Wall("wall", x + segmentLength*(i) + 100, y - 300, 20, 200, "silver"));
            walls.push(new Wall("wall", x + segmentLength*(i) + 70, y - 150, 30, 20, "silver"));
            walls.push(new Wall("wall", x + segmentLength*(i) + 700, y - 150, 30, 20, "silver"));
            walls.push(new Wall("wall", x + segmentLength*(i) + 680, y - 300, 20, 200, "silver"));
            walls.push(new Wall("wall", x + segmentLength*(i) + 100, y - 300, 580, 20, "silver"));
            walls.push(new Wall("wall", x + segmentLength*(i) + 400, y - 150, 20, 150, "silver"));
            walls.push(new Wall("wall", x + segmentLength*(i) + 350, y - 150, 120, 20, "silver"));
        }
    }
}