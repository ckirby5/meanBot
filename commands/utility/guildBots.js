const Discord = require("discord.js");
const parse = require('../../helpers/argParser')
const moment = require("moment");
const config = require('../../config.json');
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};


exports.run = async (message, args, bot, db) => {

    const params = parse(args);

    if(params.hasOwnProperty('default')) {
        message.reply( "No arguments specified");
        return;
    }
    try {
        const isLeadershipViewPasswords = params.hasOwnProperty('viewpasswords') && params.viewpasswords;
        const isLeadershipUpdateNotes = params.hasOwnProperty("setnotes") && params.setnotes;
        const isLeadershipUpdatePassword = params.hasOwnProperty("setpassword") && params.setpassword;
        if (message.member.roles.cache.has(config.leadersRole) && isLeadershipViewPasswords) {
               const rows = await db.query("SELECT name, username, password FROM meanBot.guildBots");
               if (rows.length > 0) {
                const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Current Passwords\n")
                .addFields(
                    rows.map((row) => {
                        return {
                            name: `${row.name}`,
                            value: `Username: ${row.username}\nPassword: ${row.password}`
                        }
                    })
                ).setTimestamp();
                    message.author.send(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
               }
        } else if (message.member.roles.cache.has(config.leadersRole) && isLeadershipUpdateNotes) {
            const rows = await db.query("UPDATE meanBot.guildBots SET notes = ? WHERE name = ?", [params.setnotes, params.name]);
            message.author.send(`Updated notes for ${params.name} with ${params.setnotes}`).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
        } else if (message.member.roles.cache.has(config.leadersRole) && isLeadershipUpdatePassword) {
            const rows = await db.query("UPDATE meanBot.guildBots SET password = ? WHERE name = ?", [params.setpassword, params.name]);
            message.author.send(`Updated password for ${params.name} with ${params.setpassword}`).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
        }
        else if (message.member.roles.cache.has(config.raiderRole) && !isLeadershipViewPasswords && !isLeadershipUpdateNotes && !isLeadershipUpdatePassword) {
            console.log(JSON.stringify(params));
            let exists = true;
            if (!(params.hasOwnProperty('location') && params.location) && !(params.hasOwnProperty('class') && params.class) && !(params.hasOwnProperty('park') && params.park)) {
                exists = await db.query("SELECT name FROM meanBot.guildBots WHERE name = ?", params.name);
            }
            if (exists == undefined || exists.length == 0) {
                message.reply("This character does not exist").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
            } else {
                if (params.hasOwnProperty('park') && params.park) {
                    const zones = await db.query("SELECT z.zoneId FROM meanBot.zones z LEFT JOIN meanBot.zoneAliases za ON z.zoneId = za.zoneId WHERE za.zoneName = ?;", params.location);
                    if (zones == undefined || zones.length == 0) {
                        message.reply("Invalid zone specified!").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                        return;
                    }
                    await db.query("UPDATE meanBot.guildBots SET location = ?, buffs = ?, updatedBy = ? WHERE name = ?;", [zones[0].zoneId, params.buffs, message.author.id, params.name]);
                    message.reply(`Parked ${params.name} at ${params.location} with ${params.buffs}`);
                } else if (params.hasOwnProperty('location') && params.location) {
                    const rows = await db.query("SELECT gb.name, gb.notes, z.zoneName FROM meanBot.guildBots gb JOIN meanBot.zones z ON gb.location = z.zoneId;");
                    if (rows.length > 0) {
                        const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Current Bot Locations\n")
                        .addFields(
                            rows.map((row) => {
                                return{
                                    name: `${row.name}`,
                                    value: `Zone: ${row.zoneName}\nNotes: ${row.notes}`
                                }
                            })
                        ).setTimestamp();
                            message.author.send(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                    }
                } else if (params.hasOwnProperty('name') && params.hasOwnProperty('showpassword')) {
                    const rows = await db.query("SELECT name, username, password FROM meanBot.guildBots WHERE name = ?;", params.name);
                    if (rows[0] !== null && rows[0] !== undefined) {
                        const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle(`${rows[0].name}`).addFields(
                            {name: `Username`, value: `${rows[0].username}`},
                            {name: `Password`, value: `${rows[0].password}`}).setTimestamp();
                        message.author.send(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                    }
                } else if (params.hasOwnProperty('name') && params.hasOwnProperty('showinfo')) {
                    const rows = await db.query("SELECT gb.name, z.zoneName, gb.notes, gb.buffs FROM meanBot.guildBots gb JOIN meanBot.zones z ON gb.location = z.zoneId WHERE name = ?;", params.name);
                    if (rows[0] !== null && rows[0] !== undefined) {
                        const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle(`${rows[0].name}`).addFields(
                            {name: `Location`, value: `${rows[0].zoneName}`},
                            {name: `Buffs`, value: `${rows[0].buffs}`},
                            {name: `Notes`, value: `${rows[0].notes}`}).setTimestamp();
                        message.author.send(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                    }
                } else if (params.hasOwnProperty('class') && params.class) {
                    const rows = await db.query("SELECT gb.name, gb.notes, z.zoneName FROM meanBot.guildBots gb JOIN meanBot.zones z ON gb.location = z.zoneId WHERE class = ?;", params.class);
                    if (rows.length > 0) {
                        const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle(`Bot Information for ${params.class}`)
                        .addFields(
                            rows.map((row) => {
                                return {
                                    name: `${row.name}`,
                                    value: `Zone: ${row.zoneName}\nNotes: ${row.notes}`
                                }
                            })
                        ).setTimestamp();
                        message.author.send(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
                    }
                }
            }
        }
         else {
            message.reply("You don't have the role").then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
        }
        
    } catch(ex) {
        console.log("Error with guildBots: " + ex);
    }
}
