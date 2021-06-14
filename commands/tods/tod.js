const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment-timezone");
moment.tz.setDefault('America/New_York');
const scheduleUpdateAction = require('../../commands/guildEvents/schedule');
const rteUpdateAction = require('../../commands/tods/rteStatus');
const config = require('../../config.json');
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};

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
        const aliasResult = await db.query('SELECT g.guildName FROM meanBot.guildTable g LEFT JOIN meanBot.guildAliases ga ON ga.guildId = g.guildId WHERE ga.guildName = ?', killedByValue);
        if (aliasResult[0] == null || aliasResult[0] == undefined){
            message.reply("Please enter a valid guild.").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
            return;
        } else {
            killedByValue = aliasResult[0].guildName;
        }
        const rows = await db.query("SELECT t.todId, t.name, t.targetId, t.variance, t.respawnTime, d.tod FROM targets t JOIN aliases a ON a.targetId = t.targetId LEFT JOIN tod d ON t.todId = d.todId WHERE a.name = ?;", mobName.trim());
        if (rows[0] !== null && rows[0] !== undefined) {
            let tod = moment().subtract(modValue, 'minutes');
            if (actualTod) {
                tod = moment(actualTod);
                if(isNaN(tod)) {
                    tod = null;
                }
                if (tod.isAfter()) {
                    message.reply("How do you know the future tod? Are you a GM? Fuck you!").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                    return
                }
            }
            const longerThanFiveMinutes = moment(tod) > moment(rows[0].tod).add(5, 'minutes');
            if (!longerThanFiveMinutes) {
                message.reply(`A ToD has been entered for ${rows[0].name}: ${rows[0].tod}`).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                return;
            }
            if(tod){
                const insertResult = await db.query("INSERT INTO tod (tod, targetId, killedBy, previousTodId, recordedBy) VALUES (?, ?, ?, ?, ?);", [tod.toDate(), rows[0].targetId, killedByValue, rows[0].todId, message.author.id]);
                let killTimeStart = moment();
                let killTimeEnd = moment();
                if (actualTod) {
                    killTimeStart = moment(actualTod);
                    killTimeEnd = moment(actualTod);
                }
                const windowStart = moment(killTimeStart.add(rows[0].respawnTime, 'hours').subtract(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');
                const windowEnd = moment(killTimeEnd.add(rows[0].respawnTime, 'hours').add(rows[0].variance, 'minutes')).subtract(modValue, 'minutes');

                const result = await db.query("UPDATE targets SET todId = ?, windowStart = ?, windowEnd = ?, tracker = null WHERE targetId = ?;", [insertResult.insertId, windowStart.toDate(), windowEnd.toDate(), rows[0].targetId]);
                if(result.affectedRows == 1) {
                    bot.channels.cache.get(config.todChannel).send("", {
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
                    }).then(msg => {setTimeout(() => message.delete(), 60000)});
                }
                await db.query("UPDATE rte SET completed = ? WHERE targetId = ?;", [moment().toDate(), rows[0].targetId]);
                const postActions = () => {
                    const scheduleUpdateAction = require('../../commands/guildEvents/schedule');
                    const rteUpdateAction = require('../../commands/tods/rteStatus');
                    //scheduleUpdateAction.run('', '', bot, db);
                    rteUpdateAction.run(bot, db);
                }
                setTimeout(postActions, 1000);
            } else {
                message.reply("Invalid date specified! Please use valid format, example [5/27/2021 15:07:01]").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});;
            }
        } else {
            message.reply("Invalid target specified! Fuck you!").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});;
        }
    } catch(error){
        console.log(error)
    }
}


