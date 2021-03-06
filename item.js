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
                    def: ["DEF", 2]
                }
                this.slot = "Head"
                this.description = "Steel has made this item a perfect choice\nfor protecting one's head."
                break;
            case "Steel Armour":
                this.stats = {
                    def: ["DEF", 3]
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

            case "Gluttonous Coat":
                this.stats = {
                    maxHp: ["MAXHP", 30],
                    vit: ["VIT", 2]
                }
                this.slot = "Chest"
                this.description = "A putrid coat that is in size\nXXL."
                break;
            case "Puppet's Robes":
                this.stats = {
                    maxMana: ["MAXMANA", 40],
                    wis: ["WIS", 1]
                }
                this.slot = "Chest"
                this.description = "Magically enchanted robes that\nresonate with mana."
                break;
            case "Puppet's Wig":
                this.stats = {
                    wis: ["WIS", 2]
                }
                this.slot = "Head"
                this.description = "A wig flowing with magical\nenergy, waiting to be unleashed."
                break;
        
            // END OF ARMOURS
        
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
            case "Ranger's Bow":
                this.slot = "Weapon"
                this.description = "A bow capable of reverberating shots.\nExtremely deadly in the right hands."
                this.attackType = "tripleStraight"
                break;
            case "dev":
                this.slot = "Weapon"
                this.description = "dev"
                this.attackType = "shoot"
                break;
            case "Silver Longsword":
                this.slot = "Weapon"
                this.description = "A quality blade that will cut through\ncountless forces before it bends."
                this.attackType = "shoot"
                this.stats = {
                    atk: ["ATK", 1]
                }
                break;
            case "Holy Blade":
                this.slot = "Weapon"
                this.description = "A legendary weapon that serves to\neradicate evil from this land."
                this.attackType = "doubleShot"
                this.stats = {
                    atk: ["ATK", 1],
                    vit: ["VIT", 1]
                }
                break;
            case "Hefty Club":
                this.slot = "Weapon"
                this.description = "A really big stick of wood."
                this.attackType = "tripleShot"
                break;
            case "Vomit":
                this.stats = {
                    vit: ["VIT", 1]
                }
                this.manaCost = 1
                this.slot = "Weapon"
                this.description = "A disgusting pile of\nregenerating vomit."
                this.attackType = "tripleShot"
                break;
            case "Spell of Mending":
                this.slot = "Ability"
                this.description = "This contains an ancient Goblin chant\nthat allows for the healing of wounds.\nSpawn a healing pool on use."
                this.attackType = "healPool"
                this.manaCost = 20;
                break;
            case "Flamestrike Spell":
                this.slot = "Ability"
                this.description = "This arcane spell will unleash a\nmassive storm of crimson fire."
                this.attackType = "flameBurst"
                this.manaCost = 30;
                this.stats = {
                    wis: ["WIS", 1]
                }
                break;
            case "Teleportation Crystal":
                this.slot = "Ability"
                this.description = "This ability will allow the user to\nflash away in an instant."
                this.attackType = "shoot"
                this.manaCost = 20;
                this.stats = {
                    wis: ["WIS", 1]
                }
                break;
            case "Steel Hammer":
                this.slot = "Ability"
                this.description = "A large steel hammer that provides great\nslamming force. You slam the ground on use."
                this.attackType = "hammerFall"
                this.manaCost = 20;
                this.stats = {
                    atk: ["ATK", 2]
                }
                break;
            case "Legion Shield":
                this.slot = "Ability"
                this.description = "A solid steel shield that will protect its users.\nGrants increased defence on use."
                this.attackType = "shieldArmour"
                this.manaCost = 30;
                this.stats = {
                    def: ["DEF", 1],
                    maxHp: ["MAXHP", 20]
                }
                break;
            case "Summoning Banner":
                this.slot = "Ability"
                this.description = "They cannot resist the urge to answer the call.\nJust one call and they will come\nto your aid."
                this.attackType = "summonMinion"
                this.stats = {
                    wis: ["WIS", 1],
                    maxMana: ["MAXMANA", 1]
                }
                this.manaCost = 30;
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
            case "Fruit of Strength":
                this.slot = "Ability"
                this.description = "A fruit that grants permenant\nstrength (ATK) to those who eat it.\nOne time use."
                this.attackType = "gainAtk"
                break;
            case "Fruit of Vitality":
                this.slot = "Ability"
                this.description = "A fruit that grants permenant\nvitality (VIT) to those who eat it.\nOne time use."
                this.attackType = "gainVit"
                break;
            case "Fruit of Durability":
                this.slot = "Ability"
                this.description = "A fruit that grants permenant\ndurability (DEF) to those who eat it.\nOne time use."
                this.attackType = "gainDef"
                break;
            case "Fruit of Quickness":
                this.slot = "Ability"
                this.description = "A fruit that grants permenant\nquickness (SPD) to those who eat it.\nOne time use."
                this.attackType = "gainSpd"
                break;
        }
    }
}