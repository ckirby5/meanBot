const moment = require("moment");
const Discord = require("discord.js");
const config = require("../../config.json");


exports.run = function(message, args, bot, db) {
    const now = moment();
    db.query("SELECT t.name, t.windowStart as 'date', t.windowEnd as 'end', t.variance, t.isBaggable, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM meanBot.targets t LEFT JOIN meanBot.tod d1 ON t.todId = d1.todId LEFT JOIN meanBot.tod d2 ON d1.previousTodId = d2.todId where windowStart between ? and ?", [moment().startOf('day').toDate(),moment().endOf('day').add(7, 'days').toDate()],
        function(err, targetResults) {
            if (err) {
                console.error("db error occured: " + err);
            }
            db.query("SELECT name, date FROM meanBot.events where date between ? and ? AND deletedBy IS null", [moment().toDate(),moment().add(7, 'days').toDate()],
                function(err, eventResults) {
                    if (err) {
                        console.error("db error occured: " + err);
                    }
                    const combinedArray = [];
                    targetResults.map((tr) => {
                        combinedArray.push({name: tr.name, date: tr.date, end: tr.end, variance: tr.variance, bagged: tr.killedBy == 'Seal Team' && tr.lastKilledBy == 'Seal Team' && tr.isBaggable})
                    })
                    eventResults.map((er) => {
                        combinedArray.push({name: er.name, date: er.date, bagged: false})
                    })

                    combinedArray.sort((a, b) => a.date - b.date);

                    let days = [];
                    let daysRequired = 7

                    for (let i = 0; i <= daysRequired; i++) {
                        days.push(moment().add(i, 'days'))
                    }

                    const daySchedule = [];
                    for(let i=0; i<days.length; i++) {
                        const daysEvents = combinedArray.filter((item) => moment(item.date).isSame(moment(days[i]), 'day'));
                        if(daysEvents){
                            daySchedule.push( {
                                date: days[i],
                                event: daysEvents
                            })
                        }
                    }
                    const finalSchedule = daySchedule.filter((day) => day.event != undefined);
                    const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Event Schedule\n")
                    .setAuthor("MeanBot", "https://i.imgur.com/HcURdiB.jpg")
                    .addFields(
                        finalSchedule.map((ds)=>{
                            let value = 'Nothing scheduled at this time'
                            if (ds.event.length > 0) { 
                                value = '';
                            ds.event.map((e) => { 
                                value += `\n${e.bagged ? ':handbag: ' : ':tractor: '}**${e.name}**`;
                                value += e.end ? ` ${moment(e.date).format('HH:mm')} ${e.variance == 0 ? '' : `(to ${moment(e.end).format('HH:mm')})`}` : ` at ${moment(e.date).format('HH:mm')}`
                            })
                            }
                            return {
                                name: ds.date.format('dddd MMM Do YYYY'),
                                value 
                            }
                        })
                        
                    ).setImage("https://i.imgur.com/iP9N5Qn.png").setTimestamp().setFooter("\nThese are currently in window! Be prepared!");
                    bot.channels.cache.get(config.eventSchedulesChannel).send(embed);
                }
            )
        }
    )
}