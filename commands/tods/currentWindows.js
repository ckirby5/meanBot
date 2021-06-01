const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");

exports.run = function(bot, db, message) {
    const timeStamp = moment();
        db.query("SELECT t.name, t.windowStart, t.windowEnd, t.variance, t.tracker, t.isBaggable, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM meanBot.targets t LEFT JOIN meanBot.tod d1 ON t.todId = d1.todId LEFT JOIN meanBot.tod d2 ON d1.previousTodId = d2.todId WHERE  (?  BETWEEN t.windowStart AND t.windowEnd) AND t.isCamp = 0 ORDER BY t.windowStart ASC;", timeStamp.toDate(),
        function(err, rows){


            if (err) {
                console.error("Invalid: " + err);
            }
            
            if(rows.length > 0) {
                const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle(":rotating_light: Mobs In Window: :rotating_light:\n")
                .setAuthor("MeanBot", "https://i.imgur.com/HcURdiB.jpg")
                .addFields(
                    rows.map((row) => {
                        const windowLengthInMinutes = row.variance * 2;
                        let window = '';
                        const windowStart = moment(row.windowStart);
                        const windowEnd = moment(row.windowEnd);
                        const interval = windowLengthInMinutes/16;

                        if (windowLengthInMinutes < 60) {
                            window = `${windowLengthInMinutes} minutes`
                        } else {
                            window = `${windowLengthInMinutes/60} hours`
                        }

                        const fromStart = moment.duration(windowStart.diff(moment())).as('minutes');
                        const toEnd = moment.duration(windowEnd.diff(moment())).as('minutes');

                        const numberOfTicksFromStart = Math.abs(Math.ceil(fromStart/interval));
                        const numberOfTicksToEnd = Math.ceil(toEnd/interval);
                        const positiveTime = Math.abs(fromStart);
                        const timeInWindow = `${Math.floor(positiveTime/60)} hours and ${Math.floor(positiveTime%60)} minutes`
                        return { 
                            name: `${row.killedBy == 'Seal Team' && row.lastKilledBy == 'Seal Team' && row.isBaggable ?  ':handbag:' : ':tractor:'} ${row.name} (${window})`, 
                            value: `\nCurrent Tracker: ${row.tracker ? row.tracker : 'No Current Tracker'}\nTime in Window: ${timeInWindow}\n\n${":green_square:".repeat(numberOfTicksFromStart)}${":white_large_square:".repeat(numberOfTicksToEnd)}`
                        }
                    }
                )).setImage("https://i.imgur.com/iP9N5Qn.png").setTimestamp().setFooter("\nThese are currently in window! Be prepared!");
                bot.channels.cache.get(config.windowsChannel).send(embed);
            } else {
                bot.channels.cache.get(config.windowsChannel).send("", {
                    embed: {
                        color: "#0099ff",
                        title: ":rotating_light: Mobs In Window: :rotating_light:\n",
                        author: {
                            name: 'MeanBot',
                            icon_url: 'https://i.imgur.com/HcURdiB.jpg'
                        },
                        description: "Nothing in Window",

                        image: {
                            url: 'https://i.imgur.com/Zgppa6s.jpg'
                        },
                        timestamp: new Date(),
                        footer: {
                            text: "\nThere is nothing currently in window! Go to sleep!"
                        }

                    }
                })
            }
        })
     } 