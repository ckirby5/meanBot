const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};

exports.run = function(message, args, bot, db) {
    const window = () => {
        message.reply("", {
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
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }
    const tod = () => {
        message.reply("", {
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
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }
    const bp = () => {
        message.reply("", {
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
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }
    const sp = () => {
        message.reply("", {
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
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }
    const camp = () => {
        message.reply("", {
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
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }
    const event = () => {
        message.reply("", {
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
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }
    const df = () => {
        message.author.send("",{
            embed: {
                color: "#0099ff",
                title: "Please use !help (command) for more info\n",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: {
                    name: "Available Commands",
                    value: "aliases\nwindow\ntod\nbp\nsp\ncamp\nevent\nrte\nbagged\ntoon"
                }
            }
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }

    const rte = () => {
        message.reply("",{
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
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }

    const bagged = () => {
        message.reply("",{
            embed: {
                color: "#0099ff",
                title: "Bagged Command (Member Role)",
                author: {
                    name: "MeanBot",
                    icon_url: "https://i.imgur.com/tYfYIy3.png"
                },
                fields: [
                    {
                    name: "How to use the !bagged command",
                    value: "Use !bagged"
                    }
                ]
            }
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
    }

    const toon = () => {
        message.reply("", {
            embed: {
                color: "0099ff",
                title: "Toon Command (Raider Role)",
                fields: [
                    {
                        name: "To get locations of all bots",
                        value: "!toon -locations"
                    },
                    {
                        name: "Get the credentials for a bot",
                        value: "!toon -name {toon name} -showpassword"
                    },
                    {
                        name: "Get all information for a specific bot",
                        value: "!toon -name {toon name} -showinfo"
                    },
                    {
                        name: "Update the parked location or buffs for a bot",
                        value: "!toon -name {toon name} -park {location} -buff {buff list}"
                    },
                    {
                        name: "Edit the credentials or notes of a bot (Officer Only)",
                        value: "!toon -name {toon name} -setinfo {information}"
                    },
                    {
                        name: "Show all passwords for bots (Officer Only)",
                        value: "!toon -showpasswords"
                    }
                ]
            }
        }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
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
        case "rte":
            rte();
            break;
        case "commands":
            df();
            break;
        case "bagged":
            bagged();
            break;
        case "toon":
            toon();
            break;
        default:
            df();
            break;
    }
}