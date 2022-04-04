import { Wall } from "./wall.js"
import { Entity } from "./entity.js"
import { Interactable } from "./interactable.js"
import { EnemyStats } from "./enemyStats.js"

export class LevelGeneration {
    generateLevel(levelName, x, y, length, walls, entities, game, interactables, gameTime) {
        var segmentLength;
        var segmentHeight;
        var listOfRooms = [];
        var possibleMobs = [];
        var finalPortal = "lobby"
        var bossRoom = false;
        var roomsToNotSpawnExit = ["lobby", "Warlord's Lair", "High Priest's Quarters"]
        var enemyNumber = {
            max: 0,
            min: 0
        }
        switch(levelName){
            case "Goblin Forest":
                segmentLength = 800;
                segmentHeight = 500;
                listOfRooms = ["overArch", "house", "tree"];
                possibleMobs = ["Goblin Grunt", "Goblin Archer", "Goblin Brute"]
                finalPortal = "Warlord's Lair"
                enemyNumber.min = 1;
                enemyNumber.max = 3;
                break;
            case "Crusader Encampment":
                segmentLength = 1000;
                segmentHeight = 500;
                listOfRooms = ["checkpoint", "camp", "highWall"];
                possibleMobs = ["Silver Knight", "Recruiter", "Ranger"]
                finalPortal = "High Priest's Quarters"
                enemyNumber.min = 2;
                enemyNumber.max = 4;
                break;
            case "The Theatre":
                segmentLength = 800;
                segmentHeight = 600;
                listOfRooms = ["curtains"];
                possibleMobs = []
                finalPortal = "lobby"
                enemyNumber.min = 4;
                enemyNumber.max = 6;
                walls.push(new Wall("wall", x + 300, y - 600, 20, 300, "rgb(49, 114, 130)"));
                walls.push(new Wall("wall", x + 300, y - 300, 300, 20, "rgb(49, 114, 130)"));
                walls.push(new Wall("wall", x + 580, y - 600, 20, 300, "rgb(49, 114, 130)"));
                this.summonEnemy("Captive Damsel", x+ 450, y - 500, x+ 450, y - 500, game, entities, gameTime, walls);
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
                walls.push(new Wall("wall", x + 200, y - 100, 200, 100, "silver"));
                walls.push(new Wall("wall", x + 800, y - 100, 200, 100, "silver"));
                walls.push(new Wall("wall", x + 550, y - 300, 100, 20, "silver"));
                this.summonEnemy("Goblin Warlord", x+ 600, y-60, x+ 600, y-60, game, entities, gameTime, walls)
                break;
            case "High Priest's Quarters":
                segmentLength = 2000;
                segmentHeight = 1000;
                walls.push(new Wall("wall", x, y - 200, 300, 200, "silver"));
                walls.push(new Wall("wall", x + 300, y - 150, 500, 150, "silver"));
                walls.push(new Wall("wall", x + 800, y - 100, 800, 100, "silver"));
                walls.push(new Wall("wall", x + 1600, y - 200, 400, 200, "silver"));

                walls.push(new Wall("wall", x + 350, y - 400, 200, 20, "silver"));
                walls.push(new Wall("wall", x + 750, y - 450, 200, 20, "silver"));
                walls.push(new Wall("wall", x + 1350, y - 400, 200, 20, "silver"));
                bossRoom = true;
                this.summonEnemy("High Priest", x+ 1800, y-250, x+ 1800, y-250, game, entities, gameTime, walls)// High Priest
                break;
        }

        for (var i = 0; i < length/segmentLength; i ++){
            var roomToGenerate = listOfRooms[this.randint(0, listOfRooms.length-1)];
            var lastRoom = length/segmentLength -1;
            var xLocation = x + segmentLength*(i);
            if (i == lastRoom && levelName != "lobby" && !bossRoom){
                walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
                interactables.push(new Interactable(finalPortal, xLocation + 700, y - 40, 30, 40, "blue", "portal", gameTime, game.n))
                game.n ++;
            }
            else if (roomToGenerate == "empty"){
                walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
            } else if (i == 0 && !roomsToNotSpawnExit.includes(levelName)){
                interactables.push(new Interactable("lobby", xLocation + 100, y - 40, 30, 40, "blue", "portal", gameTime, game.n))
                game.n ++;
                walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
            }
            
            if (i != 0 && i != lastRoom){
                switch (roomToGenerate){
                    case "house":
                        walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
                        walls.push(new Wall("wall", xLocation + 100, y - 300, 20, 200, "silver"));
                        walls.push(new Wall("wall", xLocation + 70, y - 150, 30, 20, "silver"));
                        walls.push(new Wall("wall", xLocation + 700, y - 150, 30, 20, "silver"));
                        walls.push(new Wall("wall", xLocation + 680, y - 300, 20, 200, "silver"));
                        walls.push(new Wall("wall", xLocation + 100, y - 300, 580, 20, "silver"));
                        walls.push(new Wall("wall", xLocation + 400, y - 150, 20, 150, "silver"));
                        walls.push(new Wall("wall", xLocation + 350, y - 150, 120, 20, "silver"));
                        break;
                    case "tree":
                        walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "darkgreen"));
                        walls.push(new Wall("wall", xLocation + 205, y - 100, 40, 100, "brown"));
                        walls.push(new Wall("wall", xLocation + 175, y - 200, 100, 100, "green"));
                        walls.push(new Wall("wall", xLocation + 505, y - 100, 40, 100, "brown"));
                        walls.push(new Wall("wall", xLocation + 475, y - 200, 100, 100, "green"));
                        break;
                    case "overArch":
                        walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "silver"));
                        walls.push(new Wall("wall", xLocation + 100, y - segmentHeight, 50, segmentHeight-100, "silver"));
                        walls.push(new Wall("wall", xLocation + 150, y - segmentHeight, 500, segmentHeight-300, "silver"));
                        walls.push(new Wall("wall", xLocation + 650, y - segmentHeight, 50, segmentHeight-100, "silver"));
                        walls.push(new Wall("wall", xLocation + 300, y-100, 200, 100, "silver"));
                        break;
                    case "checkpoint":
                        walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "rgb(78, 112, 33)"));
                        walls.push(new Wall("wall", xLocation + 100, y - segmentHeight + 20, 20, 400, "rgb(130, 106, 86)"));
                        walls.push(new Wall("wall", xLocation + 100, y - segmentHeight + 400, 500, 20, "rgb(130, 106, 86)"));
                        walls.push(new Wall("wall", xLocation + 700, y - 300, 20, 300, "rgb(130, 106, 86)"));
                        walls.push(new Wall("wall", xLocation + 400, y - 300, 300, 20, "rgb(130, 106, 86)"));
                        walls.push(new Wall("wall", xLocation + 100, y - 300, 200, 20, "rgb(130, 106, 86)"));
                        walls.push(new Wall("wall", xLocation + 700, y - 150, 70, 20, "rgb(130, 106, 86)"));
                        walls.push(new Wall("wall", xLocation + 700, y - segmentHeight + 20, 20, 100, "rgb(130, 106, 86)"));
                        walls.push(new Wall("wall", xLocation + 900, y - segmentHeight + 20, 50, segmentHeight - 120, "rgb(161, 68, 50)"));
                        walls.push(new Wall("wall", xLocation + 915, y - 100, 20, 100, "blue", game.n));
                        interactables.push(new Interactable("Switch", xLocation + 150, y - segmentHeight + 40, 30, 20,
                        "rgb(136, 189, 181)", "button", gameTime, game.n))
                        game.n ++;
                        break;
                    case "camp":
                        walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "rgb(78, 112, 33)"));
                        walls.push(new Wall("wall", xLocation + 100, y - 150, 20, 150, "rgb(117, 102, 83)"));
                        walls.push(new Wall("wall", xLocation + 100, y - 150, 200, 20, "rgb(117, 102, 83)"));
                        walls.push(new Wall("wall", xLocation + 300, y - 150, 20, 100, "rgb(117, 102, 83)"));

                        walls.push(new Wall("wall", xLocation + 600, y - 150, 20, 100, "rgb(117, 102, 83)"));
                        walls.push(new Wall("wall", xLocation + 600, y - 150, 200, 20, "rgb(117, 102, 83)"));
                        walls.push(new Wall("wall", xLocation + 800, y - 150, 20, 150, "rgb(117, 102, 83)"));

                        walls.push(new Wall("wall", xLocation + 600, y - 80, 20, 80, "blue", game.n));
                        walls.push(new Wall("wall", xLocation + 300, y - 80, 20, 80, "blue", game.n));
                        interactables.push(new Interactable("Switch", xLocation + 440, y - segmentHeight + 40, 30, 20,
                        "rgb(136, 189, 181)", "button", gameTime, game.n))
                        game.n ++;

                        walls.push(new Wall("wall", xLocation + 900, y - segmentHeight + 20, 50, segmentHeight - 120, "rgb(161, 68, 50)"));
                        walls.push(new Wall("wall", xLocation + 900, y - 100, 20, 100, "blue", game.n));
                        interactables.push(new Interactable("Switch", xLocation + 200, y - 40, 30, 20,
                        "rgb(136, 189, 181)", "button", gameTime, game.n))
                        game.n ++;

                        walls.push(new Wall("wall", xLocation + 930, y - 100, 20, 100, "blue", game.n));
                        interactables.push(new Interactable("Switch", xLocation + 700, y - 40, 30, 20,
                        "rgb(136, 189, 181)", "button", gameTime, game.n))
                        game.n ++;
                        break;
                    case "highWall":
                        walls.push(new Wall("wall", xLocation, y, segmentLength, 50, "rgb(78, 112, 33)"));
                        walls.push(new Wall("wall", xLocation + 100, y - segmentHeight + 100, 200, segmentHeight - 100 , "gray"));
                        walls.push(new Wall("wall", xLocation + 300, y - 150, 50, 20 , "gray"));
                        walls.push(new Wall("wall", xLocation + 50, y - 150, 50, 20 , "gray"));
                        walls.push(new Wall("wall", xLocation + 300, y - 300, 50, 20 , "gray"));
                        walls.push(new Wall("wall", xLocation + 50, y - 300, 50, 20 , "gray"));
                        
                        walls.push(new Wall("wall", xLocation + 900, y - segmentHeight + 20, 50, segmentHeight - 120, "rgb(161, 68, 50)"));
                        walls.push(new Wall("wall", xLocation + 900, y - 100, 20, 100, "blue", game.n));
                        interactables.push(new Interactable("Switch", xLocation + 450, y - 40, 30, 20,
                        "rgb(136, 189, 181)", "button", gameTime, game.n))
                        game.n ++;
                    break;

                }
            }
            if (roomToGenerate != "empty" && i != 0 && i != lastRoom){
                for (var c =0; c < this.randint(enemyNumber.min,enemyNumber.max); c ++){
                    this.summonEnemy(possibleMobs[this.randint(0, possibleMobs.length-1)], xLocation, y,
                    x+segmentLength*(i+1), y- segmentHeight, game, entities, gameTime, walls);
                }
            }
        }
    }

    summonEnemy(name, x, y, xLimit, yLimit, game, entities, gameTime, walls){
        if (xLimit == null){
            xLimit = x;
            yLimit = y;
        }
    
        var enemyStats = new EnemyStats().getStats(name);
        entities[game.n] = new Entity(name, "npc", this.randint(x, xLimit), this.randint(y, yLimit), enemyStats.length, enemyStats.width, 
        enemyStats.hp, enemyStats.weaponName, enemyStats.colour,
        -1, gameTime, game.n, enemyStats.xSpeed, enemyStats.ySpeed, enemyStats.engageRange);
        entities[game.n].attacks = enemyStats.attacks
        entities[game.n].drops = enemyStats.drops
        entities[game.n].speechList = enemyStats.speechList
        entities[game.n].boss = enemyStats.boss
        entities[game.n].travelMap.detectRange = enemyStats.detectRange
        entities[game.n].deathAttack = enemyStats.deathAttack;
        if (entities[game.n].attacks[0][0] == "speech"){
            entities[game.n].invincible = true;
        }
        if (enemyStats.setHp != null){
            entities[game.n].stats.hp[1] = enemyStats.setHp;
        }
        while (!this.checkAvailable(entities[game.n], walls)){
            entities[game.n].x = this.randint(x, xLimit);
            entities[game.n].y = this.randint(y, yLimit);  
        }
    
        game.n ++;
    }

    randint(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    checkAvailable (rect, arrayOfRect){
        for(var i = 0; i < arrayOfRect.length; i ++){
            if (this.rectRectDetect(rect, arrayOfRect[i]) && rect != arrayOfRect[i]){
                return false;
            }
        }
        return true;
    }

    rectRectDetect(rect, rect2){
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
}