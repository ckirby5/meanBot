const Discord = require("discord.js");

exports.run = async (message) => {
    try{
        const images = [
            'https://live.staticflickr.com/3223/2307229740_86ed437da8_b.jpg',
            'https://i.imgur.com/8uuWMWN.jpg',
            'https://i.redd.it/k0nkl3p9uot31.png',
            'https://live.staticflickr.com/6101/6248381538_abe291bfaa_b.jpg',
            'https://live.staticflickr.com/21/28907398_9462410e99_b.jpg'
        ];
        const url = images[Math.floor(Math.random() * images.length)];
        const embed = new Discord.MessageEmbed().setColor("#0099ff").setTitle("Current Passwords\n").setImage(url).addField(`Your Random Butthole`, 'Enjoy').setTimestamp();
        message.author.send(embed);
    }
    catch(ex){
        console.log(ex);
    }
    
}