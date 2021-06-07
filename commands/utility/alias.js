const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");

exports.run = function(message, args, bot, db) {
    db.query("SELECT t.name, a.name AS 'alias' FROM meanBot.aliases a JOIN meanBot.targets t ON t.targetId = a.targetId ORDER BY t.name",
    function(err, rows) {
        if (err) {
            console.log("error: " +err)
        }
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
            
                
                bot.channels.cache.get('851569391882469476').send("", {
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
    
    })
}
