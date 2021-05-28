const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");

exports.run = function(message, args, bot, db) {
    const aliases = () => {
        db.query("SELECT t.name, a.name AS 'alias' FROM meanBot.aliases a JOIN meanBot.targets t ON t.targetId = a.targetId ORDER BY t.name",
        function(err, rows) {
            if (err) {
                console.log("error: " +err)
            }
                let currentMob = '';
                let aliasDefinitionString = 'Aliases for mobs:'
                for(let i =0; i<rows.length; i++){
                    if(currentMob != rows[i].name){
                        currentMob = rows[i].name;
                        aliasDefinitionString += `\n${currentMob} :`
                    }
                    aliasDefinitionString +=  `${rows[i].alias}, `
                }
                bot.channels.cache.get('833859329589379095').send(aliasDefinitionString);

            })
        
    }
    const window = () => {
        bot.channels.cache.get('833859329589379095').send("Use !window mobName");
    }
    const tod = () => {
        bot.channels.cache.get('833859329589379095').send("For Seal Team extact ToD use: !tod mobname\nFor Seal Team late entry ToD use: !tod mobName, [MM/DD/YYYY HH:MM:SS], example [Thu May 27 22:42:07 2021]\nFor non Seal Team exact ToD use: !tod mobName, $guildName\nFor non Seal Team late entry ToD use: !tod mobName, [MM/DD/YYYY HH:MM:SS], $guildName");
    }
    const bp = () => {
        bot.channels.cache.get('833859329589379095').send("Use !bp for MAJOR raid targets only. This sends an actual Batphone using Batphone Bot.");
    }
    const sp = () => {
        bot.channels.cache.get('833859329589379095').send("Use !sp for sockphone alerts. This is for non major raid targets.");
    }
    
    
    switch(args) {
        case 'aliases':
            aliases();
            break;
        case "window":
            window();
            break;
        case "tod":            
            tod();
            break;
        case "bp":
            bp();
            break;
        case "sp":
            sp();
            break;
        default: break;
    }
}