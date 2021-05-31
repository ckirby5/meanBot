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
                            icon_url: "https://i.imgur.com/HcURdiB.jpg"
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
                title: "Window Command",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/HcURdiB.jpg"
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
                title: "Tod Command - All ToDs must use EST!",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/HcURdiB.jpg"
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
                title: "Batphone Command",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/HcURdiB.jpg"
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
                title: "Sockphone Command",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/HcURdiB.jpg"
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
                title: "Camp Command",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/HcURdiB.jpg"
                },
                fields: {
                    name: "How to use the !camp command:",
                    value: "Use !camp start campName\nExample: !camp start idols"
                }
            }
        });
    }
    const event = () => {
        bot.channels.cache.get('833859329589379095').send("", {
            embed: {
                color: "#0099ff",
                title: "Event Command",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/HcURdiB.jpg"
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
                    icon_url: "https://i.imgur.com/HcURdiB.jpg"
                },
                fields: {
                    name: "Available Commands",
                    value: "aliases\nwindow\ntod\nbp\nsp\ncamp\nevent"
                }
            }
        })
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
        case "camp":
            camp();
            break;
        case "event":
            event();
            break;
        default:
            df();
            break;
    }
}