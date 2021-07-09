const Discord = require("discord.js");
const bot = new Discord.Client();
const moment = require("moment");
const config = require("../../config.json");

exports.run = async (bot, db, message) => {
    try {
        const timeStamp = moment();
        const rows = await db.query("SELECT t.name, t.windowStart, t.windowEnd, t.variance, t.tracker, t.isBaggable, t.concedes, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM targets t LEFT JOIN tod d1 ON t.todId = d1.todId LEFT JOIN tod d2 ON d1.previousTodId = d2.todId WHERE  (?  BETWEEN t.windowStart AND t.windowEnd) AND t.isCamp = 0 ORDER BY t.windowStart ASC;", timeStamp.toDate())

        if(rows.length > 0) {
            const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Mobs In Window\n")
            .addFields(
                rows.map((row) => {
                    const windowLengthInMinutes = row.variance * 2;
                    let window = '';
                    const windowStart = moment(row.windowStart);
                    const windowEnd = moment(row.windowEnd);
                    const interval = windowLengthInMinutes/16;

                    if (windowLengthInMinutes < 60) {
                        window = `${windowLengthInMinutes} minutes`
                    } else {
                        window = `${windowLengthInMinutes/60} hours`
                    }

                    const fromStart = moment.duration(windowStart.diff(moment())).as('minutes');
                    const toEnd = moment.duration(windowEnd.diff(moment())).as('minutes');

                    const numberOfTicksFromStart = Math.abs(Math.ceil(fromStart/interval));
                    const numberOfTicksToEnd = Math.ceil(toEnd/interval);
                    const positiveTime = Math.abs(toEnd);
                    const timeInWindow = `${Math.floor(positiveTime/60)} hours and ${Math.floor(positiveTime%60)} minutes`

                    let title = `:tractor: ${row.name} (${window})`;
                        const areBagged =  row.killedBy == 'Seal Team' && row.lastKilledBy == 'Seal Team' && row.isBaggable;
                        const conceded = row.concedes > 0;
                        if(areBagged || conceded){
                          title = `${areBagged ? ':handbag:' : ''} ${conceded ? ':do_not_litter:' : ''} ${row.name} (${window})`
                        }
                        return {
                            name: title,
                            value: `\nRemaining Window: ${timeInWindow}\n${":green_square:".repeat(numberOfTicksFromStart)}${":white_large_square:".repeat(numberOfTicksToEnd)}\n`
                    }
                }
            )).setTimestamp().setFooter("\nThese are currently in window! Be prepared!");
            bot.channels.cache.get(config.windowsChannel).send(embed);
        } else {
            bot.channels.cache.get(config.windowsChannel).send("", {
                embed: {
                    color: "#0099ff",
                    title: "Nothing Currently in Window\n",
                    image: {
                        url: 'https://i.imgur.com/Zgppa6s.jpg'
                    },
                    timestamp: new Date(),
                    footer: {
                        text: "\nThere is nothing currently in window! Go to sleep!"
                    }

                }
            })
        }
    } catch (ex) {
        console.log(ex)
    }
    
}
