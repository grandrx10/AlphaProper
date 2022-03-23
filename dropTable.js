export class DropTable {
    constructor (name){
        this.name = name;
        this.drops = [];

        if (this.name == "Goblin Grunt"){
            this.drops = [["Ranger Hat", 5],
                        ["Mercenary Cap", 5]]
        }
    }
}