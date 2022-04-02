import { Bullet } from "./bullet.js";
import { Particle } from "./particle.js";
import { EnemyStats } from "./enemyStats.js";
import { Entity } from "./entity.js";

export class AttackPattern {

    preformAttack(attack, weaponIndex, bullets, entities, entity, gameTime, aimX, aimY, particles, game, walls){
        if (weaponIndex == -1 || 
            (gameTime - entity.weapons[weaponIndex].lastFired > entity.weapons[weaponIndex].cooldown*(1- 0.1*entity.stats.dex[1])
        && entity.stats.mana[1] >= entity.weapons[weaponIndex].manaCost)){
            if (weaponIndex != -1){
                entity.stats.mana[1] -= entity.weapons[weaponIndex].manaCost
                entity.weapons[weaponIndex].lastFired = gameTime;
            }
            switch(attack){
                case "shoot":
                    this.createBullet(entity, "circle",weaponIndex, aimX, aimY, bullets, gameTime)
                    break;
                case "tripleShot":
                    for (var i = 0; i < 3; i ++){
                        this.createBullet(entity, "circle", weaponIndex, aimX + this.randint(-20, 20), aimY + this.randint(-20, 20),
                        bullets, gameTime)
                    }
                    break;
                case "doubleShot":
                    for (var i = 0; i < 2; i ++){
                        this.createBullet(entity, "circle", weaponIndex, aimX + this.randint(-10, 10), aimY + this.randint(-10, 10),
                        bullets, gameTime)
                    }
                    break;
                case "healPool":
                    this.createBullet(entity, "rect", weaponIndex, aimX, aimY, bullets, gameTime)
                    break;
                case "hammerFall":
                    for (var i = 0; i < 10; i ++){
                        this.createBulletComplex(entity.x + 10*i, entity.y + entity.width - 5, "circle",
                        weaponIndex, entity.x + 10*i, entity.y, 
                        bullets, gameTime, entity, entity.weapons[weaponIndex].speed*i)
                    }
                    for (var i = 0; i < 10; i ++){
                        this.createBulletComplex(entity.x + (-i)*10, entity.y + entity.width - 5, "circle",
                        weaponIndex, entity.x + (-i)*10, entity.y, 
                        bullets, gameTime, entity, entity.weapons[weaponIndex].speed*i)
                    }
                    break;
                case "minorHeal":
                    entity.stats.hp[1] += 50;
                    entity.clearInventorySlot("Ability");
                    break;
                case "minorMana":
                    entity.stats.mana[1] += 50;
                    entity.clearInventorySlot("Ability");
                    break;
                // BEGINNING OF GOBLIN WARLORD BOSS -----------------------------------------------------------------//
                case "warlordShot":
                    entity.chase = true;
                    for (var i = 0; i < 5; i ++){
                        this.createBullet(entity, "circle",weaponIndex, aimX + this.randint(-20, 20), aimY + this.randint(-20, 20), bullets, gameTime)
                    }
                    break;
                case "warlordSpray":
                    entity.chase = false;
                    //bullet to the left
                    this.createBullet(entity, "circle", weaponIndex,entity.x, entity.y +entity.width/2, bullets, gameTime)
                    // bullet to the right
                    this.createBullet(entity, "circle", weaponIndex,entity.x + entity.length, entity.y +entity.width/2, bullets, gameTime)
                    break;
                // END OF GOBLIN WARLORD BOSS
                case "knightChase":
                    entity.chase = true;
                    this.createBullet(entity, "circle",weaponIndex, aimX, aimY, bullets, gameTime)
                    break;
                case "armourUp":
                    entity.chase = false;
                    entity.effects.def.bonusAmount = 10;
                    entity.effects.def.duration = 3000;
                    entity.effects.def.startTime = gameTime;
                    particles.push(new Particle("+ DEF", "text", entity.x + entity.length/2, entity.y + entity.width/2, 0, 0, 700,
                    gameTime, "WHITE", 0, -5));
                    break;
                case "shieldArmour":
                    entity.effects.def.bonusAmount = 5;
                    entity.effects.def.duration = 4000;
                    entity.effects.def.startTime = gameTime;
                    particles.push(new Particle("+ DEF", "text", entity.x + entity.length/2, entity.y + entity.width/2, 0, 0, 700,
                    gameTime, "WHITE", 0, -5));
                    break;
                case "summonSquire":
                    this.summonEnemy("Squire", entity.x, entity.y, entity.x, entity.y, game, entities, gameTime,walls, entity.team)
                    break;
                case "summonMinion":
                    if (entity.location != "lobby")
                        this.summonEnemy("Minion", entity.x, entity.y, entity.x, entity.y, game, entities, gameTime,walls, entity.team)
                    break;
                case "tripleStraight":
                    for (var i = 1; i < 4; i ++){
                        this.createBulletComplex(entity.x + entity.length/2, entity.y + entity.width/2, "circle",
                        weaponIndex, aimX, aimY, 
                        bullets, gameTime, entity, entity.weapons[weaponIndex].speed*i)
                    }
                    break;
                // PALADIN BOSS FIGHT ------------------------------------------------------------------------------
                case "summonPaladinBoss":
                    this.summonEnemy("Paladin Of The Order", entity.x - 100, entity.y - 100, entity.x, entity.y, game, entities
                    , gameTime,walls, entity.team)
                    delete entities[entity.id];
                    break;
                case "paladinChase":
                    entity.chase = true;
                    entity.effects.spd.bonusAmount = 2;
                    entity.effects.spd.startTime = gameTime;
                    entity.effects.spd.duration = 1000;
                    this.createBullet(entity, "circle",weaponIndex, aimX, aimY, bullets, gameTime)
                    for(var i = 0; i < 5; i ++){
                        this.createBullet(entity, "circle",weaponIndex, entity.x + entity.length/2+ this.randint(-20, 20)
                        , entity.y + entity.width/2+ this.randint(-20, 20), bullets, gameTime)
                    }
                    break;
                case "paladinChaseV2":
                    entity.chase = true;
                    entity.effects.spd.bonusAmount = 2;
                    entity.effects.spd.startTime = gameTime;
                    entity.effects.spd.duration = 1000;
                    this.createBullet(entity, "circle",weaponIndex, aimX, aimY, bullets, gameTime)
                    for(var i = 0; i < 5; i ++){
                        this.createBullet(entity, "circle",weaponIndex, entity.x + entity.length/2+ this.randint(-20, 20)
                        , entity.y + entity.width/2+ this.randint(-20, 20), bullets, gameTime)
                    }
                    entity.attackInfo.preformAttack("warningShots", 4, bullets, entities,entity, gameTime,aimX, aimY,
                    particles, game, walls)
                    break;
                case "jump":
                    entity.chase = false;
                    entity.yAccel = -entity.yOrigA*5
                    break;
                case "explosion":
                    entity.chase = false;
                    for(var i = 0; i < 100; i ++){
                        this.createBulletComplex(entity.x + entity.length/2, entity.y + entity.width/2, "circle",
                        weaponIndex, entity.x + entity.length/2+ this.randint(-20, 20)
                        , entity.y + entity.width/2+ this.randint(-20, 20), 
                        bullets, gameTime, entity, entity.weapons[weaponIndex].speed*(this.randint(1, 6)));
                    }
                    break;
                case "warningShots":
                    entity.effects.def.bonusAmount = 3;
                    entity.effects.def.duration = 1000;
                    entity.effects.def.startTime = gameTime;
                    particles.push(new Particle("+ DEF", "text", entity.x + entity.length/2, entity.y + entity.width/2, 0, 0, 700,
                    gameTime, "WHITE", 0, -5));

                    var location1 = this.createLocationWithinRoom(1000, entity, walls);
                    var location2 = this.createLocationWithinRoom(1000, entity, walls);

                    while(this.distance(location1[0], location1[1], location2[0], location2[1]) <100){
                        location1 = this.createLocationWithinRoom(1000, entity, walls);
                        location2 = this.createLocationWithinRoom(1000, entity, walls);
                    }
                    
                    for (var i = 1; i < 6; i ++){
                        this.createBulletComplex(location1[0], location1[1], "circle",
                        weaponIndex, location2[0]
                        , location2[1], 
                        bullets, gameTime, entity, entity.weapons[weaponIndex].speed*i, 1000);
                        this.createBulletComplex(location2[0], location2[1], "circle",
                        weaponIndex, location1[0], location1[1], 
                        bullets, gameTime, entity, entity.weapons[weaponIndex].speed*i, 1000);
                    }
                    break;
                case "phase2Paladin":
                    this.summonEnemy("Fallen Paladin", entity.x, entity.y, entity.x, entity.y, game, entities
                    , gameTime,walls, entity.team)
                    delete entities[entity.id];
                    break;
                case "rise":
                    this.summonEnemy("The Ascended Paladin", entity.x, entity.y, entity.x, entity.y, game, entities
                    , gameTime,walls, entity.team)
                    delete entities[entity.id];
                    break;
                // SPEECH DEFAULT. DO NOT TOUCH
                case "speech":
                    entity.invincible = true;
                    entity.chase = false;
                    if (entity.speechIndex > entity.speechList.length-1){
                        entity.attackIndex++;
                        entity.speech = ""
                        entity.invincible = false;
                        entity.fightTime = gameTime
                    } else {
                        entity.weapons[weaponIndex].cooldown = entity.speechList[entity.speechIndex][1];
                        entity.speech = entity.speechList[entity.speechIndex][0];
                        entity.speechIndex += 1;
                    }
                case "none":
                    break;
            }
        }
    }

    createLocationWithinRoom(range, entity, walls){
        var location1 = [entity.x + entity.length/2+ this.randint(-range, range),
        entity.y + entity.width/2+ this.randint(-range, range)]

        for (var i = 0; i < walls.length; i ++){
            while (!this.contains(location1[0], location1[1], entity.room) || this.contains(location1[0], location1[1], walls[i])){
                location1 = [entity.x + entity.length/2+ this.randint(-range, range),
                entity.y + entity.width/2+ this.randint(-range, range)]
            }
        }
        return location1;
    }


    contains(x, y, rect){
        return (x >= rect.x && x <= rect.x + rect.length && y >= rect.y && y <= rect.y + rect.width)
    }

    createBullet(entity, bulletType, weaponIndex, aimX, aimY, bullets, gameTime){
        var team = entity.team;
        if (entity.weapons[weaponIndex].damage < 0){
            team = -1;
        }

        this.createBulletError(entity.x + entity.length/2 + entity.weapons[weaponIndex].spawnBullet[0],
        entity.y+ entity.width/2 + entity.weapons[weaponIndex].spawnBullet[1], 
        aimX, aimY, entity.weapons[weaponIndex].speed,
        entity.weapons[weaponIndex].damage * (1 + 0.1*entity.stats.atk[1]),
        bulletType, entity.weapons[weaponIndex].expireTime, team, bullets, gameTime, 
        entity.id, entity.weapons[weaponIndex].colour,
        entity.weapons[weaponIndex].bulletLength, entity.weapons[weaponIndex].bulletWidth,
        entity.weapons[weaponIndex].gravity, entity.weapons[weaponIndex].stay);
    }

    createBulletComplex(x, y, bulletType, weaponIndex, aimX, aimY, bullets, gameTime, entity, speed, delay){
        var team = entity.team;
        if (entity.weapons[weaponIndex].damage < 0){
            team = -1;
        }

        this.createBulletError(x, y, 
        aimX, aimY, speed,
        entity.weapons[weaponIndex].damage * (1 + 0.1*entity.stats.atk[1]),
        bulletType, entity.weapons[weaponIndex].expireTime, team, bullets, gameTime, 
        entity.id, entity.weapons[weaponIndex].colour,
        entity.weapons[weaponIndex].bulletLength, entity.weapons[weaponIndex].bulletWidth,
        entity.weapons[weaponIndex].gravity, entity.weapons[weaponIndex].stay, delay);
    }

    createBulletError(x, y, aimX, aimY, speed, damage, type, duration, team, bullets, gameTime, id, colour, length, width, gravity, stay, delay){
        bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id, colour, length, width, gravity, stay, delay));
    }

    randint(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    distance(x1, y1, x2, y2){
        return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
    }
}
