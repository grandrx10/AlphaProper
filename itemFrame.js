import { Item } from "./item.js"
export class ItemFrame {
    constructor(item, slot, x, y, length, width){
        this.itemName = item;
        this.slot = slot;
        this.x = x;
        this.y = y;
        this.length = length;
        this.width = width;
        this.item = new Item(this.itemName);
    }

    refreshItem (){
        this.item = new Item(this.itemName);
    }
}