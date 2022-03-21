// This is the start of combat program
export class Room {
    constructor (name, x, y, length, width, gameTime) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = width;
        this.name = name
        this.lastChecked = gameTime + 100;
    }

    checkEmpty(entities, room){
        var detectedEntity = false;
        Object.keys(entities).forEach(function(key) {
            if(room.rectRectDetect(room, entities[key]) && entities[key].type == "Player"){
                detectedEntity = true;
            }
        });
        return !detectedEntity;
    }
    
    deleteArray(array){
        for (var i = array.length-1; i>=0; i--){
            if (this.rectRectDetect(array[i], this)){
                array.splice(i, 1);
            }
        }
    }
    deleteDictionary(dict, room){
        Object.keys(dict).forEach(function(key) {
            if(room.rectRectDetect(room, dict[key])){
                delete dict[key];
            }
        });
    }

    rectRectDetect(rect, rect2){
        var leftSide = rect.x;
        var rightSide = rect.x + rect.length;
        var topSide = rect.y;
        var botSide = rect.y + rect.width;
        if (rect2.x + rect2.length > leftSide && rect2.x < rightSide && rect2.y + rect2.width> topSide && rect2.y < botSide){
            return true;
        } else {
            return false;
        }
    }
}