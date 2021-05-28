/**
 * Deletes the specified number of messages from the channelID provided up to a maximum of 100 which is the limitation of the Discord API
 * @param {Discord.Client} client Discord Client Object
 * @param {*} channelId Channel ID
 * @param {*} numberOfMessagesToDelete Number of Messages to Delete Maximum of 100
 */
exports.run = function (bot, channelName, itemsToDelete) {
    const channel = bot.channels.cache.get(channelName);

    channel.messages.fetch({ limit: itemsToDelete }).then(messages => {
      console.log(`Received ${messages.size} messages`);
      channel.bulkDelete(messages,true)
    })
}