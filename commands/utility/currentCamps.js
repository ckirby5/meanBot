const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = async (bot, db, message) => {
    try {
        const rows = await db.query('SELECT name, tracker FROM targets WHERE isCamp = 1 AND tracker IS NOT null');   
        if (rows.length > 0) {
            const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle('Current Active Camps').setAuthor("MeanBot", "https://i.imgur.com/tYfYIy3.png")
            .addFields(
                rows.map((row) => {
                    return {
                        name: `${row.name}`,
                        value: `Camp Holder: ${row.tracker}`
                    }
                })
            ).setTimestamp().setFooter("\nCheck with current camp holder to be added to list");
            bot.channels.cache.get(config.campCheckChannel).send(embed);
        } 
    } catch (error) {
        console.log(error)
    }
}
