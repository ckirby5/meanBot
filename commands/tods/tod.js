const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const scheduleUpdateAction = require('../../commands/guildEvents/schedule');
const rteUpdateAction = require('../../commands/tods/rteStatus');


exports.run = async (message, args, bot, db) => {
    try {
        const arguments = args.split(',')
        let mobName = ''
        let modValue = 0
        let killedByValue = "Seal Team"
        let actualTod = null;
        arguments.map((arg) => {
            const val = arg.trim();
            if(val.startsWith('-')){ modValue = val.replace('-','') }
            else if(val.startsWith('$')){ killedByValue = val.replace('$','') }
            else if(val.startsWith('[') && val.endsWith(']')){actualTod = val.replace('[', '').replace(']','')}
            else { mobName  = val }
        })
        
        const rows = await db.query("SELECT t.todId, t.name, t.targetId, t.variance, t.respawnTime, d.tod FROM meanBot.targets t JOIN meanBot.aliases a ON a.targetId = t.targetId LEFT JOIN meanBot.tod d ON t.todId = d.todId WHERE a.name = ?;", mobName.trim());
        if (rows[0] !== null && rows[0] !== undefined) {
            const duration = moment.duration(moment().diff(moment(rows[0].tod)));
            let tod = moment().subtract(modValue, 'minutes');
            if (actualTod) {
                tod = moment(actualTod);
                if(isNaN(tod)) {
                    tod = null;
                }
                if (tod.isAfter()) {
                    bot.channels.cache.get('833859329589379095').send("How do you know the future tod? Are you a GM? Fuck you!");
                    return
                }
            }
            if(tod){
                const insertResult = await db.query("INSERT INTO meanBot.tod (tod, targetId, killedBy, previousTodId, recordedBy) VALUES (?, ?, ?, ?, ?);", [tod.toDate(), rows[0].targetId, killedByValue, rows[0].todId, message.author.id]);
                let killTimeStart = moment();
                let killTimeEnd = moment();
                if (actualTod) {
                    killTimeStart = moment(actualTod);
                    killTimeEnd = moment(actualTod);
                }
                const windowStart = moment(killTimeStart.add(rows[0].respawnTime, 'hours').subtract(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');
                const windowEnd = moment(killTimeEnd.add(rows[0].respawnTime, 'hours').add(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');

                const result = await db.query("UPDATE meanBot.targets SET todId = ?, windowStart = ?, windowEnd = ?, tracker = null WHERE targetId = ?;", [insertResult.insertId, windowStart.toDate(), windowEnd.toDate(), rows[0].targetId]);
                if(result.affectedRows == 1) {
                    bot.channels.cache.get('842187750068191243').send("", {
                        embed: {
                            color: "#0099ff",
                            title: "Mob Info Updated",
                            author: {
                                name: 'MeanBot',
                                icon_url: 'https://i.imgur.com/tYfYIy3.png'
                            },
                            description: rows[0].name,
                            fields: [
                                {
                                    name: "New Time of Death",
                                    value: moment(tod).format('LLL')
                                },
                                {
                                    name: "Killed By",
                                    value: killedByValue
                                },
                                {
                                    name: "Updated By",
                                    value: "<@" + message.author.id + ">"
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: "Thank you for keeping Seal Team up to date!"
                            }
                        }
                    });
                }
                await db.query("UPDATE meanBot.rte SET completed = ? WHERE targetId = ?;", [moment().toDate(), rows[0].targetId]);
                const postActions = () => {
                    const scheduleUpdateAction = require('../../commands/guildEvents/schedule');
                    const rteUpdateAction = require('../../commands/tods/rteStatus');
                    scheduleUpdateAction.run('', '', bot, db);
                    rteUpdateAction.run(bot, db);
                }
                setTimeout(postActions, 1000);
            } else {
                bot.channels.cache.get('833859329589379095').send("Invalid date specified! Please use valid format, example [5/27/2021 15:07:01]");
            }
        } else {
            bot.channels.cache.get('833859329589379095').send("Invalid target specified! Fuck you!");
        }
    } catch(error){
        console.log(error)
    }
}


