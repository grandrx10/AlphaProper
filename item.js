export class Item {
    constructor(item){
        this.name = item;
        if (this.name == "Ranger Hat"){
            this.stats = {
                dex: ["DEX", 1],
                spd: ["SPD", 1]
            }
            this.slot = "Head"
            this.description = "A trusty ranger hat that will\nprotect you from the weather."
        } else if (this.name == "Mercenary Cap"){
            this.stats = {
                atk: ["ATK", 1]
            }
            this.slot = "Head"
            this.description = "A cap worn by mercenaries due\nto it's cheap production value"
        } else if (this.name == "Leather Tunic"){
            this.stats = {
                def: ["DEF", 1]
            }
            this.slot = "Chest"
            this.description = "A tunic crafted with cow skin\n that provides light protection."
        }
    }
}