export class Item {
    constructor(item){
        this.name = item;
        this.stats = {};
        this.slot = "none";
        this.description = "none"
        this.attackType = ""
        switch(this.name){
            case "Ranger Hat":
                this.stats = {
                    dex: ["DEX", 1],
                    spd: ["SPD", 1]
                }
                this.slot = "Head"
                this.description = "A trusty ranger hat that will\nprotect you from the weather."
                break;
            case "Mercenary Cap":
                this.stats = {
                    atk: ["ATK", 1]
                }
                this.slot = "Head"
                this.description = "A cap worn by mercenaries due\nto its cheap production value"
                break;
            case "Leather Tunic":
                this.stats = {
                    def: ["DEF", 1]
                }
                this.slot = "Chest"
                this.description = "A tunic crafted with cow skin\n that provides light protection."
                break;
            case "Warlord's Vest":
                this.stats = {
                    def: ["DEF", 2]
                }
                this.slot = "Chest"
                this.description = "A chainvest crafted from fine steel.\nIt will protect you well."
                break;
            case "Adventurer's Sword":
                this.slot = "Weapon"
                this.description = "A useful blade for any adventurer."
                this.attackType = "shoot"
                break;
            case "Hearthwood Bow":
                this.slot = "Weapon"
                this.description = "A finely crafted bow made by the\nfinest goblin smiths."
                this.attackType = "shoot"
                break;
            case "Hefty Club":
                this.slot = "Weapon"
                this.description = "A really big stick of wood."
                this.attackType = "tripleShot"
                break;
            case "Spell of Mending":
                this.slot = "Ability"
                this.description = "This contains an ancient Goblin chant\nthat allows for the healing of wounds."
                this.attackType = "healPool"
                break;
        }
    }
}