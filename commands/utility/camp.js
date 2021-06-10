const Discord = require("discord.js");
const bot = new Discord.Client();

exports.run = async (message, args, bot, db) => {
    try {
        const arguments = args.split(' ');
        const command = arguments[0];
        const campName = arguments[1];
        let tracker = "<@" + message.author.id + ">";
        if (arguments.length == 3) {
            tracker = arguments[2];
        }
        const rows = await db.query("SELECT t.todId, t.name, t.targetId, t.variance, t.respawnTime, t.tracker FROM meanBot.targets t JOIN meanBot.aliases a ON a.targetId = t.targetId LEFT JOIN meanBot.tod d ON t.todId = d.todId WHERE a.name = ? AND t.isCamp = 1;", campName.trim());
        if (!command) {
            message.reply("Are you starting or stopping your camp?");
        }
        let trackerName = null;
        if(command == 'start') {
            trackerName = tracker;
        }
        if(command == 'end') {
            trackerName = null;
        }
        if (rows[0] !== null && rows[0] !== undefined) {
            await db.query("UPDATE meanBot.targets SET tracker = ? WHERE targetId = ?", [trackerName, rows[0].targetId]);
            message.reply("", {
                embed :{
                    color: "#0099ff",
                    title: `Camp ${command}ed`,
                    author: {
                        name: "MeanBot",
                        image_url: "https://i.imgur.com/tYfYIy3.png"
                    },
                    fields: {
                        name: `Camp name: ${rows[0].name}`,
                        value: `Camped By: ${trackerName ? trackerName : 'Camp is open'}`
                    },
                    timestamp: new Date(),
                    footer: {
                        text: `You have ${command}ed your camp`
                    }

                }
            })
        }
        else {
            message.reply("Not a valid camp! Do you even know Norrath? Fuck you!");
        }

    } catch (error) {
        console.log(error)
    }
}