export class DropTable {
    constructor (name){
        this.name = name;

        if (this.name == "Grunt"){
            this.drops = [["Ranger Hat", 5],
                        ["Mercenary Cap", 5]]
        }
    }
}