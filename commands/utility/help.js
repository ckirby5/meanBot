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
            if (rows.length > 0){
                let currentMob = '';
                let aliasDefinitionString = 'Aliases for mobs:'
                const fields = []
                for(let i =0; i < rows.length; i++){
                    if(currentMob != rows[i].name){
                       fields.push({name: currentMob, value: aliasDefinitionString})
                        currentMob = rows[i].name;
                        aliasDefinitionString = '';
                    }
                    aliasDefinitionString +=  `(${rows[i].alias}) `
                }
                fields.shift()
                bot.channels.cache.get('833859329589379095').send("", {
                    embed: {
                        color: "#0099ff",
                        title: "Aliases for targets\n",
                        author: {
                            name: "MeanBot",
                            icon_url: "https://i.imgur.com/tYfYIy3.png"
                        },
                        fields: fields.map((f) => {
                            return {
                                name: `${f.name}`,
                                value: `${f.value}`
                            }
                        }),
                        timestamp: new Date(),
                    }
                })
            }

        })
        
    }
    const window = () => {
        bot.channels.cache.get('833859329589379095').send("", {
            embed: {
                color: "#0099ff",
                title: "Window Command (Member Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: {
                    name: "How to use the !window command:",
                    value: "!window {mobname}\nExample: !window naggy will return information on Lord Nagafen"
                }
            }
        });
    }
    const tod = () => {
        bot.channels.cache.get('833859329589379095').send("", {
            embed: {
                color: "#0099ff",
                title: "Tod Command - All ToDs must use EST! (Member Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: [
                    {
                    name: "For Seal Team exact ToD use:",
                    value: "!tod mobname",
                    },
                    {
                    name: "For Seal Team late entry ToD use:",
                    value: "!tod mobName, [DDD MMM DD HH:MM:SS YYYY]\nExample: !tod Naggy, [Thu May 27 22:42:07 2021]",
                    },
                    {
                    name: "For non Seal Team exact ToD use:",
                    value: "!tod mobName, $guildName\nExample: !tod Naggy, $Kingdom",
                    },
                    {
                    name: "For non Seal Team late entry ToD use:",
                    value: "!tod mobName, [DDD MMM DD HH:MM:SS YYYY], $guildName\nExample: !tod Naggy, [Thu May 27 22:42:07 2021], $Kingom",
                    }
                ]
            }
        });
    }
    const bp = () => {
        bot.channels.cache.get('833859329589379095').send("", {
            embed: {
                color: "#0099ff",
                title: "Batphone Command (Tracker Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: {
                    name: "How to use the !bp command:",
                    value: "Use !bp targetname\nThis sends an actual Batphone using Batphone Bot."
                }
            }
        });
    }
    const sp = () => {
        bot.channels.cache.get('833859329589379095').send("", {
            embed: {
                color: "#0099ff",
                title: "Sockphone Command (Raider Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: {
                    name: "How to use the !bp command:",
                    value: "Use !sp target/activity\nThis is for non major raid targets."
                }
            }
        });
    }
    const camp = () => {
        bot.channels.cache.get('833859329589379095').send("", {
            embed: {
                color: "#0099ff",
                title: "Camp Command (Member Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: [
                    {
                        name: "How to use the !camp start command",
                        value: "Use !camp start campName\nExample: !camp start idols"
                        },
                        {
                        name: "How to use the !camp end command",
                        value: "Use !camp end campName\nExample: !camp end idols"
                        }
                ]
            }
        });
    }
    const event = () => {
        bot.channels.cache.get('833859329589379095').send("", {
            embed: {
                color: "#0099ff",
                title: "Event Command (Scheduler Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: {
                    name: "How to use the !event command:",
                    value: "Use !event -add -name Event Name -date Date\nExample: !event -add -name Hate Clear -date May 27 22:00:00 2021\nUse !event -remove -name Event Name -date Date\nExample: !event -remove -name Hate Clear -date May 27 22:00:00 2021"
                }
            }
        });
    }
    const df = () => {
        bot.channels.cache.get('833859329589379095').send("",{
            embed: {
                color: "#0099ff",
                title: "Please use !help (command) for more info\n",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: {
                    name: "Available Commands",
                    value: "aliases\nwindow\ntod\nbp\nsp\ncamp\nevent\nrte"
                }
            }
        });
    }
    const track = () => {
        bot.channels.cache.get('833859329589379095').send("",{
            embed: {
                color: "#0099ff",
                title: "Track Command (Raider Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: {
                    name: "How to use the !track command",
                    value: "Use !track alias @yourself\nExample: !track naggy @meanBot"
                }
            }
        });
    }

    const rte = () => {
        bot.channels.cache.get('833859329589379095').send("",{
            embed: {
                color: "#0099ff",
                title: "RTE Command (Raider Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: [
                    {
                    name: "How to use the !rte start command",
                    value: "Use !rte -start -char charName -role role -mob mobName\nExample: !rte -start -char Meaners -role Tracker -mob Phinny"
                    },
                    {
                    name: "How to use the !rte stop command",
                    value: "Use !rte -stop -char charName -role role -mob mobName\nExample: !rte -stop -char Meaners -role Tracker -mob Phinny"
                    }
                ]
            }
        });
    }

    
    
    switch(args) {
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
        case "camp":
            camp();
            break;
        case "event":
            event();
            break;
        case "track":
            track();
            break;
        case "rte":
            rte();
            break;
        default:
            df();
            break;
    }
}