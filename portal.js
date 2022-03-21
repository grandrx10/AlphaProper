export class Portal {
    constructor (name, x, y, length, width, colour, maxOccupants){
        this.name = name;
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = width;
        this.colour = colour;
        this.maxOccupants = maxOccupants;
        this.occupants = 0;
    }
}