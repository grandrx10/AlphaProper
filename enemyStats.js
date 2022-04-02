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
        var deathAttack;
        var setHp;
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
                drops = [["Ranger Hat", 5],
                        ["Mercenary Cap", 5],
                        ["Leather Tunic", 5],
                        ["Hearthwood Bow", 5],
                        ["Spell of Mending", 5],
                        ["Hefty Club", 10],
                        ["Steel Hammer", 5],
                        ["Minor Health Potion", 10],
                        ["Minor Mana Potion", 10],]
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
                        ["Mercenary Cap", 3],
                        ["Hearthwood Bow", 10],
                        ["Spell of Mending", 10],
                        ["Minor Health Potion", 10],
                        ["Minor Mana Potion", 10],]
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
                        ["Mercenary Cap", 4],
                        ["Hefty Club", 12],
                        ["Spell of Mending", 5],
                        ["Steel Hammer", 10],
                        ["Minor Health Potion", 10],
                        ["Minor Mana Potion", 10],]
                break;
            case "Goblin Warlord":
                length = 30;
                width = 40;
                hp = 1500; // 1500
                weaponName = ["none","Warlord's Club", "Warlord's Stomp"];
                colour = "darkgreen"
                xSpeed = 0.5;
                ySpeed = 7;
                engageRange = 0;
                attacks = [["speech", -1],["warlordShot", 5000], ["warlordSpray", 2000]]
                drops = [["Leather Tunic", 40],
                        ["Mercenary Cap", 40],
                        ["Ranger Hat", 40],
                        ["Hearthwood Bow", 40],
                        ["Hefty Club", 40],
                        ["Spell of Mending", 40],
                        ["Steel Hammer", 40],
                        ["Warlord's Vest", 20],
                        ["Minor Health Potion", 50],
                        ["Minor Health Potion", 50],
                        ["Minor Mana Potion", 50],
                        ["Minor Mana Potion", 50],]
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
            // CRUSADER ENCAMPMENT -----------------------------------------------
            case "Silver Knight":
                length = 25;
                width = 35;
                hp = 200;
                weaponName = ["armourUp", "knightBlade"];
                colour = "silver"
                xSpeed = 0.7;
                ySpeed = 6;
                engageRange = 0;
                attacks = [["armourUp", 500], ["knightChase", 5000]]
                drops = [["Minor Health Potion", 10],
                        ["Minor Mana Potion", 10],
                        ["Legion Shield", 10],
                        ["Summoning Banner", 5],
                        ["Knight's Helm", 12],
                        ["Steel Armour", 10],
                        ["Ranger's Cloak", 3],
                        ["Silver Longsword", 10]]
                break;
            case "Recruiter":
                length = 20;
                width = 30;
                hp = 150;
                weaponName = ["summonSquire"];
                colour = "rgb(235, 158, 52)"
                xSpeed = 0.5;
                ySpeed = 3;
                engageRange = 300;
                attacks = [["summonSquire", -1]]
                drops = [["Minor Health Potion", 10],
                        ["Minor Mana Potion", 10],
                        ["Legion Shield", 5],
                        ["Summoning Banner", 10],
                        ["Knight's Helm", 6],
                        ["Steel Armour", 5],
                        ["Ranger's Cloak", 5],
                        ["Silver Longsword", 5]]
                break;
            case "Squire":
                length = 20;
                width = 30;
                hp = 80;
                weaponName = ["squireBlade"];
                colour = "rgb(196, 196, 196)"
                xSpeed = 0.5;
                ySpeed = 6;
                engageRange = 0;
                attacks = [["shoot", -1]]
                drops = [["Minor Health Potion", 2],
                        ["Minor Mana Potion", 2],
                        ["Legion Shield", 1],
                        ["Steel Armour", 2],
                        ["Ranger's Cloak", 1],
                        ["Silver Longsword", 1]]
                break;
            case "Minion":
                length = 15;
                width = 25;
                hp = 40;
                weaponName = ["squireBlade"];
                colour = "rgb(159, 113, 199)"
                xSpeed = 0.5;
                ySpeed = 6;
                engageRange = 0;
                attacks = [["shoot", -1]]
                drops = []
                break;
            case "Ranger":
                length = 20;
                width = 30;
                hp = 120;
                weaponName = ["tripleBow"];
                colour = "rgb(92, 8, 166)"
                xSpeed = 0.6;
                ySpeed = 6;
                engageRange = 150;
                attacks = [["tripleStraight", -1]]
                drops = [["Minor Health Potion", 2],
                        ["Minor Mana Potion", 2],
                        ["Legion Shield", 4],
                        ["Summoning Banner", 4],
                        ["Knight's Helm", 6],
                        ["Steel Armour", 3],
                        ["Ranger's Cloak", 15],
                        ["Silver Longsword", 3]]
                break;
            // HIGH PRIEST BOSS FIGHT
            case "High Priest":
                length = 20;
                width = 30;
                hp = 1000;
                weaponName = ["", "oneTime"];
                colour = "rgb(196, 196, 196)"
                xSpeed = 0.5;
                ySpeed = 6;
                engageRange = 0;
                attacks = [["speech", -1], ["summonPaladinBoss", 5000]]
                speechList = [["So you are the intruders\nI heard outside.",3000], 
                ["Before you try to kill me,\nI just have one question for you.", 3000],
                ["Do you believe in God?", 2000],
                ["Funny, I've been a priest for many\nyears... and now I'm having doubts.", 3000],
                ["Thousands of people die everyday.\nPlagues run wild.", 3000],
                ["And yet, God hasn't stepped in yet.\nHe hasn't said a word.", 3000],
                ["Humans are not unique. We are just\na million copies of a single person.", 3000],
                ["Maybe he hasn't intervened because\nwe aren't worth his attention.", 3000],
                ["I'll show him a display\nhe'll HAVE to notice.", 2000],
                ["Sadly, that means I cannot stay\nhere to entertain you scoundrels.",3000],
                ["PALADIN! TO MY AID!", 1500],
                ["Goodbye.", 1000]]
                drops = []
                break;
            case "Paladin Of The Order":
                length = 20;
                width = 40;
                hp = 1200;
                weaponName = ["","holyBlade", "futureBullets"];
                colour = "rgb(196, 100, 35)"
                xSpeed = 0.5;
                ySpeed = 6;
                engageRange = 0;
                attacks = [["speech", -1], ["paladinChase", 5000], ["warningShots", 1000]]
                speechList = [["Halt. I will not allow you\nto harm the High Priest.",3000], 
                ["I do not know why you have chosen\nthe path of evil.", 3000],
                ["But I will stop you right where\nyou stand.", 2500],]
                deathAttack = "phase2Paladin"
                boss = true;
                detectRange = 1500;
                break;
            case "Fallen Paladin":
                length = 20;
                width = 40;
                hp = 15000;
                weaponName = ["", "oneTime"];
                colour = "rgb(153, 76, 24)"
                attacks = [["speech", -1], ["rise", -1]]
                speechList = [["I... lost?",3000], 
                ["How can God allow monsters such as\nyourselves to grow so powerful?", 3000],
                ["Please, Lord, grant me the power\nto strike these monsters down.", 3000],
                ["Grant me the power to exact\njustice in your name.", 3000],
                ["...", 3000],
                ["No answer, huh?", 2000],
                ["No. That was God's answer.", 2000],
                ["I understand now. I do not\nneed his help to exact justice.", 3000],
                ["I have the power to do so inside\nof me.", 2500],
                ["Prepare for a reckoning, evildoers.", 3000]]
                setHp = 1000;
                break;
            case "The Ascended Paladin":
                length = 20;
                width = 40;
                hp = 1200;
                weaponName = ["", "oneTime", "explosion","holyBlade", "futureBullets"];
                colour = "rgb(153, 76, 24)"
                xSpeed = 0.5;
                ySpeed = 6;
                engageRange = 0;
                attacks = [["speech", -1], ["jump", 1000], ["explosion", 1000], ["paladinChaseV2", 5000], ["warningShotsV2", 1000]]
                speechList = [["Disappear.",1000]]
                drops = [["Minor Health Potion", 50],
                        ["Minor Mana Potion", 50],
                        ["Legion Shield", 40],
                        ["Summoning Banner", 40],
                        ["Knight's Helm", 40],
                        ["Steel Armour", 40],
                        ["Ranger's Cloak", 40],
                        ["Silver Longsword", 40],
                        ["Holy Blade", 10]]
                boss = true;
                detectRange = 1500;
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
            detectRange: detectRange,
            deathAttack: deathAttack,
            setHp: setHp
        }
    }
}