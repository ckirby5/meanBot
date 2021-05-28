const responses = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and try again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Very doubtful",
    "lol no",
    "No way",
    "You're a moran",
    "Who the fuck is Tippani?!",
    "PALLYDAN",
    "Quicken's Choccy Milkie",
    "Is piza an open face sandwich?"
  ];
  
  exports.run = function (message, args, bot) {
    let answer = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send("", {
      embed: { title: ":8ball: 8 Ball", description: answer },
    });
  };