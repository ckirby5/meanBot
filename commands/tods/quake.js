const moment = require("moment");

exports.run = async (message, args, bot, db) => {
    try {
        await db.query("UPDATE meanBot.targets SET windowStart = ?, windowEnd = ?, tracker = null WHERE isAffectedByQuake = 1;", [moment().toDate(), moment.toDate()])
        bot.channels.cache.get('833859329589379095').send("Quake started. All windows ended.");
    } catch (ex) {
        console.log(ex)
    }
}