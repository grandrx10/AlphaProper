import { Bullet } from "./bullet.js";

export class AttackPattern {

    preformAttack(attack, weaponIndex, bullets, entities, entity, gameTime, aimX, aimY){
        if (gameTime - entity.weapons[weaponIndex].lastFired > entity.weapons[weaponIndex].cooldown*(1- 0.1*entity.stats.dex[1])){
            entity.weapons[weaponIndex].lastFired = gameTime;
            switch(attack){
                case "shoot":
                    this.createBullet(entity, "circle",weaponIndex, aimX, aimY, bullets, gameTime)
                    break;
                case "tripleShot":
                    for (var i = 0; i < 3; i ++){
                        this.createBullet(entity, "circle", weaponIndex, aimX + this.randint(-20, 20), aimY + this.randint(-20, 20), bullets, gameTime)
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
                    this.createBullet(entity, "circle", weaponIndex,entity.x, entity.y +entity.width/2, bullets, gameTime)
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
        this.createBulletError(entity.x + entity.length/2, entity.y+ entity.width/2, 
        aimX, aimY, entity.weapons[weaponIndex].speed,
        entity.weapons[weaponIndex].damage * (1 + 0.1*entity.stats.atk[1]),
        bulletType, entity.weapons[weaponIndex].expireTime, entity.team, bullets, gameTime, 
        entity.id, entity.weapons[weaponIndex].colour,
        entity.weapons[weaponIndex].bulletSize, entity.weapons[weaponIndex].bulletSize, false, false);
    }

    createBulletError(x, y, aimX, aimY, speed, damage, type, duration, team, bullets, gameTime, id, colour, length, width, gravity, stay){
        bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id, colour, length, width, gravity, stay));
    }

    randint(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
