import { Bullet } from "./bullet.js";

export class AttackPattern {

    preformAttack(attack, weaponIndex, bullets, entities, entity, gameTime, aimX, aimY){
        if (gameTime - entity.weapons[weaponIndex].lastFired > entity.weapons[weaponIndex].cooldown*(1- 0.1*entity.stats.dex[1])
        && entity.stats.mana[1] >= entity.weapons[weaponIndex].manaCost){
            entity.stats.mana[1] -= entity.weapons[weaponIndex].manaCost
            entity.weapons[weaponIndex].lastFired = gameTime;
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
                case "healPool":
                    for (var i = 0; i < 3; i ++){
                        this.createBullet(entity, "rect", weaponIndex, aimX, aimY, bullets, gameTime)
                    }
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
                    this.createBullet(entity, "circle", weaponIndex,entity.x, entity.y +entity.width/2, bullets, gameTime, )
                    // bullet to the right
                    this.createBullet(entity, "circle", weaponIndex,entity.x + entity.length, entity.y +entity.width/2, bullets, gameTime)
                    break;
                // END OF GOBLIN WARLORD BOSS 
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

    createBulletComplex(x, y, bulletType, weaponIndex, aimX, aimY, bullets, gameTime, entity, speed){
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
        entity.weapons[weaponIndex].gravity, entity.weapons[weaponIndex].stay);
    }

    createBulletError(x, y, aimX, aimY, speed, damage, type, duration, team, bullets, gameTime, id, colour, length, width, gravity, stay){
        bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id, colour, length, width, gravity, stay));
    }

    randint(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
