const parse = require('../../helpers/argParser')
const moment = require("moment");
// use would be !event -add -name hate -date 6/1/2021 19:00
// use would be !event -remove -name hate -date 6/1/2021 19:00
exports.run = async (message, args, bot, db) => {
    const params = parse(args);

    if(params.hasOwnProperty('default')) {
        message.reply( "No arguments specified");
        return;
    }
    
    if(params.hasOwnProperty('add') && params.hasOwnProperty('remove')) {
        message.reply("Too many commands specified");
        return;
    }

    if(!params.hasOwnProperty('add') && !params.hasOwnProperty('remove')) {
        message.reply("No command specified");
        return;
    }

    if(!params.hasOwnProperty('name')) {
        message.reply("No event name specified");
        return;
    }

    if(!params.hasOwnProperty('date')) {
        message.reply("No event date specified");
        return;
    }


    try{
        const date = moment(params.date);
        if(params.hasOwnProperty('add') && params.add){
            await db.query("INSERT INTO events (name, date, updatedBy) VALUES (?, ?, ?);", [params.name, date.toDate(), message.author.id]);
            message.reply(`Added ${params.name} to the schedule on ${date.format('LLL')}`);
            
        }
        if(params.hasOwnProperty('remove') && params.remove){
            db.query("UPDATE events SET deletedBy = ? where name = ? and date = ?;", [message.author.id, params.name, date.toDate()]);
            message.reply(`Removed ${params.name} on ${date.format('LLL')} from the schedule`);
        }
    } catch(ex) {
        console.log(ex)
    }
}