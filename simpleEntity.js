export class SimpleEntity {
    constructor (name, type, x, y, length, width, dir, stats, colour, location, interact, shake, inventory){
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
        if (this.type == "Player"){
            this.inventory = inventory;
        }
    }
}