export class DropTable {
    constructor (name){
        this.name = name;
        this.drops = [];

        if (this.name == "Goblin Grunt"){
            this.drops = [["Ranger Hat", 5],
                        ["Mercenary Cap", 5]]
        } else if (this.name == "Goblin Archer"){
            this.drops = [["Ranger Hat", 10],
                        ["Mercenary Cap", 2]]
        }

    }
}