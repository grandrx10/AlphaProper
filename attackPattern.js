import { Bullet } from "./bullet.js";

export class AttackPattern {

    preformAttack(attack, bullets, entities, entity, gameTime, aimX, aimY){
        
        if (gameTime - entity.weapon.lastFired > entity.weapon.cooldown*(1- 0.1*entity.stats.dex[1])){
            entity.weapon.lastFired = gameTime;
            switch(attack){
                case "shoot":
                    this.createBullet(entity.x + entity.length/2, entity.y+ entity.width/2, 
                    aimX, aimY, entity.weapon.speed, entity.weapon.damage * (1 + 0.1*entity.stats.atk[1]),
                    "circle", entity.weapon.expireTime, entity.team, bullets, gameTime, entity.id, entity.weapon.colour,
                    entity.weapon.bulletSize, entity.weapon.bulletSize, false, false)
                    break;
                case "tripleShot":
                    for (var i = 0; i < 3; i ++){
                        this.createBullet(entity.x + entity.length/2, entity.y+ entity.width/2, 
                        aimX + this.randint(-20, 20), aimY + this.randint(-20, 20), entity.weapon.speed,
                        entity.weapon.damage * (1 + 0.1*entity.stats.atk[1]),
                        "circle", entity.weapon.expireTime, entity.team, bullets, gameTime, entity.id, entity.weapon.colour,
                        entity.weapon.bulletSize, entity.weapon.bulletSize, false, false)
                    }
                    break;
                default:
                    break;
            }
        }
    }
    createBullet(x, y, aimX, aimY, speed, damage, type, duration, team, bullets, gameTime, id, colour, length, width, gravity, stay){
        bullets.push(new Bullet(x, y, aimX, aimY, speed, damage, type, duration, team, gameTime,id, colour, length, width, gravity, stay));
    }
    randint(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
