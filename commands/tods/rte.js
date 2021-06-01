const parse = require('../../helpers/argParser')
const moment = require("moment");
const config = require("../../config.json");

exports.run = function(message, args, bot, db) {
    const params = parse(args);

    if(params.hasOwnProperty('default')) {
        bot.channels.cache.get('833859329589379095').send( "No arguments specified");
        return;
    }
    
    if(params.hasOwnProperty('start') && params.hasOwnProperty('stop')) {
        bot.channels.cache.get('833859329589379095').send("Too many commands specified");
        return;
    }

    if(!params.hasOwnProperty('start') && !params.hasOwnProperty('stop')) {
        bot.channels.cache.get('833859329589379095').send("No start or stop specified");
        return;
    }

    if(!params.hasOwnProperty('char')) {
        bot.channels.cache.get('833859329589379095').send("No character name specified");
        return;
    }

    if(!params.hasOwnProperty('role')) {
        bot.channels.cache.get('833859329589379095').send("No role specified");
        return;
    }

    if(!params.hasOwnProperty('mob')) {
        bot.channels.cache.get('833859329589379095').send("No mob specified")
    }


    const date = moment(params.date);
    db.query("SELECT t.targetId, t.RTERoles FROM meanBot.targets t LEFT JOIN meanBot.aliases a ON t.targetId = a.targetId WHERE a.name = ?", params.mob, 
    function(err, targetResults) {
        if(err) {
            console.log(err);
        }
        if (targetResults && targetResults.length > 0) {
            db.query("SELECT id FROM meanBot.role WHERE name = ?", params.role,
            function(err, roleResults) {
                if(err) {
                    console.log(err);
                }
                if (roleResults && roleResults.length > 0) {
                    const target = targetResults[0];
                    const role = roleResults[0];
                    const allowedRoles = target.RTERoles.split(',');
                    const roleInAllowedRoles = allowedRoles.indexOf(role.id.toString()) != -1;
                    console.log(allowedRoles);
                    console.log("$$$$$$$$ " + roleInAllowedRoles);
                    if (roleInAllowedRoles) {
                        if(params.hasOwnProperty('start') && params.start){
                            db.query("INSERT INTO meanBot.rte (roleId, who, targetId, started) values (?, ?, ?, ?);", [role.id, params.char, target.targetId, moment().toDate()],
                            function(err, result) {
                                if (err) throw err 
                                bot.channels.cache.get('833859329589379095').send(`Added ${params.char} to RTE`);
                            })
                        }
                        if(params.hasOwnProperty('stop') && params.stop){
                            db.query("UPDATE meanBot.rte SET completed = ? WHERE who =? AND roleId = ? AND targetId = ?;", [moment().toDate(), params.char, role.id, target.targetId],
                            function(err, result) {
                                if (err) throw err 
                                bot.channels.cache.get('833859329589379095').send(`Removed ${params.char} from RTE`);
                            })
                        }
                        const rteUpdateAction = require('../../commands/tods/rteStatus');
                        setTimeout(() => {rteUpdateAction.run(bot, db), 1000})
                    } else {
                        bot.channels.cache.get('833859329589379095').send('This role is invalid for this RTE');
                    }
                } else {
                    bot.channels.cache.get('833859329589379095').send('This is not a valid RTE role');
                }
            }) 
        } else {
            bot.channels.cache.get('833859329589379095').send('This is not a valid target name');
        }
    })
} 
