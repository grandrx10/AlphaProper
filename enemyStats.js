export class EnemyStats {
    getStats(name){
        var length = 20;
        var width = 30;
        var hp = 100;
        var weaponName = "none";
        var colour = "white"
        var xSpeed = 0;
        var ySpeed = 0;
        var engageRange = 0;
        var attacks = [""]
        var drops = []
        var speechList = []
        var boss = false;
        var detectRange = 500;
        switch(name){
            case "Goblin Grunt":
                length = 20;
                width = 30;
                hp = 100;
                weaponName = ["fist"];
                colour = "green"
                xSpeed = 0.5;
                ySpeed = 6;
                engageRange = 0;
                attacks = [["shoot", -1]]
                drops = [["Ranger Hat", 4],
                        ["Mercenary Cap", 4],
                        ["Leather Tunic", 4]]
                break;
            case "Goblin Archer":
                length = 15;
                width = 30;
                hp = 80;
                weaponName = ["bow"];
                colour = "darkgreen"
                xSpeed = 1;
                ySpeed = 6;
                engageRange = 100;
                attacks = [["shoot",-1]]
                drops = [["Ranger Hat", 7],
                        ["Mercenary Cap", 3]]
                break;
            case "Goblin Brute":
                length = 25;
                width = 35;
                hp = 150;
                weaponName = ["club"];
                colour = "darkgreen"
                xSpeed = 0.5;
                ySpeed = 4;
                engageRange = 0;
                attacks = [["tripleShot",-1]]
                drops = [["Leather Tunic", 6],
                        ["Mercenary Cap", 4]]
                break;
            case "Goblin Warlord":
                length = 30;
                width = 40;
                hp = 1500;
                weaponName = ["none","Warlord's Club", "Warlord's Stomp"];
                colour = "darkgreen"
                xSpeed = 0.5;
                ySpeed = 7;
                engageRange = 0;
                attacks = [["speech", -1],["warlordShot", 5000], ["warlordSpray", 2000]]
                drops = [["Leather Tunic", 40],
                        ["Mercenary Cap", 40],
                        ["Ranger Hat", 40],
                        ["Warlord's Vest", 20]]
                speechList = [["Ah. So the adventurers have\nfinally arrived.",3000], 
                ["I take it you have taken care of my\nwarband already.", 3000],
                ["There is a rule in my culture.", 2000],
                ["The strong must protect the weak.", 2000],
                ["And yet, here I am, still standing\nwhen they are all dead.", 4000],
                ["I don't know what quarrel you have\nwith me, adventurers.", 3000],
                ["But I must avenge my fallen kin.", 2000],
                ["Come.", 1500]]
                boss = true;
                detectRange = 1200;
                break;
        }
        return {
            length: length,
            width: width,
            hp: hp,
            weaponName: weaponName,
            colour: colour,
            xSpeed: xSpeed,
            ySpeed: ySpeed,
            engageRange: engageRange,
            attacks: attacks,
            drops: drops,
            speechList: speechList,
            boss: boss,
            detectRange: detectRange
        }
    }
}