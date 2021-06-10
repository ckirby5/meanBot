const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");

exports.run = async (message, args, bot, db) => {
    try {
        const rows = await db.query("SELECT t.name, a.name AS 'alias' FROM aliases a JOIN targets t ON t.targetId = a.targetId ORDER BY t.name");
        if (rows.length > 0){
            const map = new Map();
            for (const item of rows) {
                if(!map.has(item.name)){
                    map.set(item.name, `(${item.alias})`); 
                }
                else {
                    const current = map.get(item.name);
                    map.set(item.name, `${current} (${item.alias})`); 
                }
            }

            const fields = Array.from(map, ([name, value]) => ({ name, value }));
            console.log(fields);
            const iteratedEmbed = (embedFields) => {
                let fields = [];
                if(embedFields.length < 10) {
                    fields = embedFields;
                } else{
                    fields = embedFields.slice(0, 9);
                }
            
                
                bot.channels.cache.get(config.aliasesChannel).send("", {
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
                if(embedFields.length > 0 ){
                    iteratedEmbed(embedFields.slice(9))
                }
            }
            iteratedEmbed(fields)

        }
    } catch (error) {
        console.log(error)
    }
}
