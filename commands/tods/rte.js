const parse = require('../../helpers/argParser')
const moment = require("moment");
const config = require("../../config.json");
const rteUpdateAction = require('../../commands/tods/rteStatus');

exports.run = async (message, args, bot, db) => {
    const params = parse(args);

    if(params.hasOwnProperty('default')) {
        message.reply( "No arguments specified");
        return;
    }
    
    if(params.hasOwnProperty('start') && params.hasOwnProperty('stop')) {
        message.reply("Too many commands specified");
        return;
    }

    if(!params.hasOwnProperty('start') && !params.hasOwnProperty('stop')) {
        message.reply("No start or stop specified");
        return;
    }

    if(!params.hasOwnProperty('char')) {
        message.reply("No character name specified");
        return;
    }

    if(!params.hasOwnProperty('role')) {
        message.reply("No role specified");
        return;
    }

    if(!params.hasOwnProperty('mob')) {
        message.reply("No mob specified")
    }

    try {
        const date = moment(params.date);
        const targetResults = await db.query("SELECT t.targetId, t.RTERoles FROM targets t LEFT JOIN aliases a ON t.targetId = a.targetId WHERE a.name = ?", params.mob);
        if (targetResults && targetResults.length > 0) {
            const roleResults = await db.query("SELECT id FROM role WHERE name = ?", params.role);
            if (roleResults && roleResults.length > 0) {
                const target = targetResults[0];
                const role = roleResults[0];
                const allowedRoles = target.RTERoles.split(',');
                const roleInAllowedRoles = allowedRoles.indexOf(role.id.toString()) != -1;
                console.log(allowedRoles);
                console.log("$$$$$$$$ " + roleInAllowedRoles);
                if (roleInAllowedRoles) {
                    if(params.hasOwnProperty('start') && params.start){
                        await db.query("INSERT INTO rte (roleId, who, targetId, started) values (?, ?, ?, ?);", [role.id, params.char, target.targetId, moment().toDate()])
                        message.reply(`Added ${params.char} to RTE`);
                    }
                    if(params.hasOwnProperty('stop') && params.stop){
                        await db.query("UPDATE rte SET completed = ? WHERE who =? AND roleId = ? AND targetId = ?;", [moment().toDate(), params.char, role.id, target.targetId]);
                        message.reply(`Removed ${params.char} from RTE`);
                    }
                    
                    setTimeout(() => {rteUpdateAction.run(bot, db), 1000})
                } else {
                    message.reply('This role is invalid for this RTE');
                }
            } else {
                message.reply('This is not a valid RTE role');
            }
        }
        else {
            message.reply('This is not a valid target name');
        }

    } catch (error) {
        console.log(error)
    }
} 
