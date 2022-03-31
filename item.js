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
                    def: ["DEF", 1],
                    maxHp: ["MAXHP", 10]
                }
                this.slot = "Chest"
                this.description = "A tunic crafted with cow skin\n that provides light protection."
                break;
            case "Warlord's Vest":
                this.stats = {
                    def: ["DEF", 2],
                    maxHp: ["MAXHP", 20]
                }
                this.slot = "Chest"
                this.description = "A chainvest crafted from fine steel.\nIt will protect you well."
                break;
            case "Knight's Helm":
                this.stats = {
                    def: ["DEF", 1]
                }
                this.slot = "Head"
                this.description = "Steel has made this item a perfect choice\nfor protecting one's head."
                break;
            case "Steel Armour":
                this.stats = {
                    def: ["DEF", 2]
                }
                this.slot = "Chest"
                this.description = "Crafted from the finest crusader steel,\nthis will provide you great protection."
                break;
            case "Ranger's Cloak":
                this.stats = {
                    dex: ["DEX", 1],
                    spd: ["SPD", 1],
                }
                this.slot = "Chest"
                this.description = "A ranger's cloak may lack speed, but it\n allows for good mobility and damage."
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
            case "Silver Longsword":
                this.slot = "Weapon"
                this.description = "A quality blade that will cut through\ncountless forces before it bends."
                this.attackType = "shoot"
                break;
            case "Hefty Club":
                this.slot = "Weapon"
                this.description = "A really big stick of wood."
                this.attackType = "tripleShot"
                break;
            case "Spell of Mending":
                this.slot = "Ability"
                this.description = "This contains an ancient Goblin chant\nthat allows for the healing of wounds.\nSpawn a healing pool on use."
                this.attackType = "healPool"
                this.manaCost = 20;
                break;
            case "Steel Hammer":
                this.slot = "Ability"
                this.description = "A large steel hammer that provides great\nslamming force. You slam the ground on use."
                this.attackType = "hammerFall"
                this.manaCost = 20;
                break;
            case "Legion Shield":
                this.slot = "Ability"
                this.description = "A solid steel shield that will protect its users.\nGrants increased defence on use."
                this.attackType = "shieldArmour"
                this.manaCost = 40;
                this.stats = {
                    def: ["DEF", 1]
                }
                break;
            case "Summoning Banner":
                this.slot = "Ability"
                this.description = "They cannot resist the urge to answer the call.\nJust one call and they will come\nto your aid."
                this.attackType = "summonMinion"
                this.manaCost = 35;
                break;
            
            // CONSUMABLES --------------------------------------------------------------------------------------------
            case "Minor Health Potion":
                this.slot = "Ability"
                this.description = "A mixture of herbs and spices that\nprovide increased regeneration.\nOne time use."
                this.attackType = "minorHeal"
                break;
            case "Minor Mana Potion":
                this.slot = "Ability"
                this.description = "A mixture of insects and ink that\nincreases one's ability to use magic.\nOne time use."
                this.attackType = "minorMana"
                break;
        }
    }
}