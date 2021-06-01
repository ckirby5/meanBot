const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");


exports.run = function(message, args, bot, db) {
    const arguments = args.split(' ');
    const command = arguments[0];
    const campName = arguments[1];
    let tracker = "<@" + message.author.id + ">";
    if (arguments.length == 3) {
        tracker = arguments[2];
    }
    
        db.query("SELECT t.todId, t.name, t.targetId, t.variance, t.respawnTime, t.tracker FROM meanBot.targets t JOIN meanBot.aliases a ON a.targetId = t.targetId LEFT JOIN meanBot.tod d ON t.todId = d.todId WHERE a.name = ? AND t.isCamp = 1;", campName.trim(),
        function(err, rows){
            if (err) {
                console.error("Invalid: " + err);
            }
            if (!command) {
                bot.channels.cache.get('833859329589379095').send("Are you starting or stopping your camp?");
            }
            let trackerName = null;
            if(command == 'start') {
                trackerName = tracker;
            }
            if (rows[0] !== null && rows[0] !== undefined) {
                db.query("UPDATE meanBot.targets SET tracker = ? WHERE targetId = ?", [trackerName, rows[0].targetId],
                function(err, result) {
                    if(err) {
                        console.log(err);
                    }
                    bot.channels.cache.get('833859329589379095').send("", {
                        embed :{
                            color: "#0099ff",
                            title: "Camp Started",
                            author: {
                                name: "MeanBot",
                                image_url: "https://i.imgur.com/HcURdiB.jpg"
                            },
                            fields: {
                                name: `Camp name: ${rows[0].name}`,
                                value: `Camped By: ${trackerName}`
                            },
                            timestamp: new Date(),
                            footer: {
                                text: "You have started your camp."
                            }

                        }
                    })
                })
            } else {
                bot.channels.cache.get('833859329589379095').send("Invalid target specified! Fuck you!");
            }
        })
    }