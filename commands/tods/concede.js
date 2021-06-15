const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment-timezone");
moment.tz.setDefault('America/New_York');
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};

exports.run = async (message, args, bot, db) => {
    try {
        let arg = args.split(" ");
        let mobName = arg[0];
        let concessionNumber = arg[1];
        const rows = await db.query("SELECT t.targetId, t.name FROM meanBot.targets t JOIN meanBot.aliases a ON a.targetId = t.targetId WHERE a.name = ?;", mobName);
        if (rows[0] !== null && rows[0] !== undefined) {
            const result = await db.query('UPDATE meanBot.targets SET concedes = ? WHERE targetId = ?;', [concessionNumber, rows[0].targetId]);
            if(result.affectedRows == 1) {
                message.reply("", {
                    embed: {
                        color: "#0099ff",
                        title: 'Concession Update',
                        fields: {
                            name : `${rows[0].name}`,
                            value: `Number of Concessions: ${concessionNumber}`
                        },
                        timestamp: new Date()
                    }
                }).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                }
            }
        } catch (error) {

        }
    } 


