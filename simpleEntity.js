export class SimpleEntity {
    constructor (name, type, x, y, length, width, dir, stats, colour, location, interact,
        shake, inventory, deathTime, deathDuration, speech, closestBoss, effects, negativeEffects){
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = width;
        this.dir = dir;
        this.stats = stats;
        this.colour = colour;
        this.location = location;
        this.interact = interact;
        this.shake = shake;
        this.deathTime = deathTime;
        this.deathDuration = deathDuration;
        if (this.type == "Player"){
            this.inventory = inventory;
            this.closestBoss = closestBoss;
        }
        this.speech = speech;
        this.effects = effects;
        this.negativeEffects = negativeEffects;
    }
}