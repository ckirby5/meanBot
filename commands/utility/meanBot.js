const responses = [
    "Quicken's Tractor",
    "Git Gud",
    "Bag Limits",
    "I'm dead",
    "Starting train up",
    "Force of Will trained again",
    "FUCK YOU!",
    "Boba Time",
    "Focus on getting to Gore",
    "GO EAST",
    "Unda da bridge morans!",
    "Atouk reads a story",
    "Tenning's Thigh Hole",
    "Phatezz trained the raid",
    "Why is Jeptha running?",
    "NO",
    "Patchet rolled a zero",
    "Penis Erection",
    "Windows suck",
    "SHUT THE FUCK UP",
    "Clear comms!",
    "ElmoFire.gif",
    "We wiped on island one in Plane of Sky",
    "Seal Team sucks!",
    "Brad bless us",
    "Let's pretend",
    "#LiveYourWave"
  ];
  
  exports.run = function (message, args, bot) {
    let answer = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send("", {
      embed: { title: ":8ball: MeanBot", description: answer },
    });
  };