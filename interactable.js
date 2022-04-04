import { ItemFrame } from "./itemFrame.js"
import { Rect } from "./rect.js";

export class Interactable {
    constructor (name, x, y, length, width, colour, type, gameTime, id){
        this.name = name;
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.length = length;
        this.width = width;
        this.colour = colour;
        this.type = type;
        this.id = id;
        this.expireTime = -1;
        this.creationTime = gameTime;

        if (this.name == "lobby"){
            this.id = -2
        }

        if (this.type == "portal"){
            this.text = "Press E to enter: " + this.name
        } else if (this.type == "bag") {
            this.text = "Press E to open";
            this.expireTime = 30000;
            this.inventory = {
                inventorySize: 8,
                items: [],
                rects: [new Rect(900, 50, 400, 400)]
            }
            for (var i = 0; i < this.inventory.inventorySize; i ++){
                if (i <this.inventory.inventorySize/2){
                    this.inventory.items.push(new ItemFrame("", i, 930 + i*(350/(this.inventory.inventorySize/2)), 100, 80, 80));
                } else {
                    this.inventory.items.push(new ItemFrame("", i, 930 + (i-this.inventory.inventorySize/2)*
                    (350/(this.inventory.inventorySize/2)), 190, 80, 80));
                }
            }
        } else if (this.type == "healStation"){
            this.text = "Press E to spawn healing"
        } else if (this.type == "button"){
            this.text = "Press E to pull switch"
        }
    }

    touching(rectList){
        for(var i = 0; i < rectList.length; i++){
            if (this.rectRectDetect(this, rectList[i]) && this != rectList[i]){
                return true;
            }
        }
        return false;
    }

    checkExpire(gameTime, interactables){
        if (gameTime - this.creationTime > this.expireTime && this.expireTime != -1){
            interactables.splice(interactables.indexOf(this), 1)
        }
    }

    checkForDuplicate(array){
        for (var i = 0; i < array.length; i ++){
            if (array[i].id == this.id){
                return true;
            }
        }
        return false;
    }

    checkEmpty(){
        for (var i = 0; i < this.inventory.items.length; i ++){
            if (this.inventory.items[i].itemName != ""){
                return false;
            }
        }
        return true;
    }

    addToInventory(itemName){
        var itemAdded = false;
        for (var i = 0; i < this.inventory.items.length && !itemAdded; i ++){
            if (this.inventory.items[i].itemName == ""){
                this.inventory.items[i].itemName = itemName;
                this.inventory.items[i].refreshItem();
                itemAdded = true;
            }
        }
    }

    update(blocks){
        this.x += this.xSpeed;
        for (var c = 0; c < blocks.length; c ++){
            if (this.rectRectDetect(this, blocks[c]) && this != blocks[c] && blocks[c].type != "blood"){
                this.x += -this.xSpeed;
                this.xSpeed = 0;
            }
        }

        this.ySpeed += 0.3;
        this.y += this.ySpeed;
        for (var c = 0; c < blocks.length; c ++){
            if (this.rectRectDetect(this, blocks[c]) && this != blocks[c] && blocks[c].type != "blood"){
                this.y += -this.ySpeed;
                this.ySpeed = 0;
            }
        }
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