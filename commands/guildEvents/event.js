const parse = require('../../helpers/argParser')
const moment = require("moment");
// use would be !event -add -name hate -date 6/1/2021 19:00
// use would be !event -remove -name hate -date 6/1/2021 19:00
exports.run = function(message, args, bot, db) {
    const params = parse(args);

    if(params.hasOwnProperty('default')) {
        bot.channels.cache.get('833859329589379095').send( "No arguments specified");
        return;
    }
    
    if(params.hasOwnProperty('add') && params.hasOwnProperty('remove')) {
        bot.channels.cache.get('833859329589379095').send("Too many commands specified");
        return;
    }

    if(!params.hasOwnProperty('add') && !params.hasOwnProperty('remove')) {
        bot.channels.cache.get('833859329589379095').send("No command specified");
        return;
    }

    if(!params.hasOwnProperty('name')) {
        bot.channels.cache.get('833859329589379095').send("No event name specified");
        return;
    }

    if(!params.hasOwnProperty('date')) {
        bot.channels.cache.get('833859329589379095').send("No event date specified");
        return;
    }


    const date = moment(params.date);
    if(params.hasOwnProperty('add') && params.add){
        db.query("INSERT INTO meanBot.events (name, date) VALUES (?, ?);", [params.name, date.toDate()],
        function(err, result) {
            if (err) throw err 
            bot.channels.cache.get('833859329589379095').send(`Added ${params.name} to the schedule on ${date.format('LLL')}`);
        })
    }
    if(params.hasOwnProperty('remove') && params.remove){
        db.query("DELETE from meanBot.events where name = ? and date = ?;", [params.name, date.toDate()],
        function(err, result) {
            if (err) throw err 
            bot.channels.cache.get('833859329589379095').send(`Removed ${params.name} on ${date.format('LLL')} from the schedule`);
        })
    }

}