const moment = require("moment");
const Discord = require("discord.js");
const config = require("../../config.json");
const deleteFunc = (oldmsg, msg) => {msg.delete(); oldmsg.delete();};


exports.run = async (message, args, bot, db) => {
    try{
        const now = moment();
        const targetResults = await db.query("SELECT t.name, t.windowStart as 'date', t.windowEnd as 'end', t.variance, t.isBaggable, t.concedes, d1.killedBy, d2.killedBy AS 'lastKilledBy' FROM targets t LEFT JOIN tod d1 ON t.todId = d1.todId LEFT JOIN tod d2 ON d1.previousTodId = d2.todId where windowStart between ? and ?", [moment().startOf('day').toDate(),moment().endOf('day').add(7, 'days').toDate()]);
        const eventResults = await db.query("SELECT name, date FROM events where date between ? and ? AND deletedBy IS null", [moment().toDate(),moment().add(7, 'days').toDate()]);
    
        const combinedArray = [];
        targetResults.map((tr) => {
            combinedArray.push({name: tr.name, date: tr.date, end: tr.end, variance: tr.variance, bagged: tr.killedBy == 'Seal Team' && tr.lastKilledBy == 'Seal Team' && tr.isBaggable, conceded: tr.concedes > 0})
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

        finalSchedule.map((ds)=>{
            const dailySchedule = () => {
                let value = 'Nothing scheduled at this time'
                if (ds.event.length > 0) { 
                    value = '';
                ds.event.map((e) => {
                    value += `\n${e.name}`;
                    value += e.end ? ` ${moment(e.date).format('HH:mm')} ${e.variance == 0 ? '' : `(to ${moment(e.end).format('HH:mm')})`}` : ` at ${moment(e.date).format('HH:mm')}`
                })
                }
                return {
                    name: "Daily Targets",
                    value 
                }
            }
            const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle(`Event Schedule for ${ds.date.format('dddd MMM Do YYYY')}\n`)
            .addFields(dailySchedule()).setTimestamp().setFooter("\nThese are currently in window! Be prepared!");
            message.author.send(embed).then(msg => {setTimeout(() => deleteFunc(message,msg), 60000)});
            
            
        })
    }
    catch(ex){
        console.log(ex);
    }
    
}