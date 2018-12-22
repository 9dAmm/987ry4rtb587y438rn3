const Discord = require('discord.js');
const client = new Discord.Client();
const ownerID = '346629187504832513';

client.on('ready', () => {
    console.log(client.user.tag + ' Ready! (' + client.user.id + ')');
    client.user.setActivity('- 9dAmm , FM', {
        type: "STREAMING",
        url: "https://www.twitch.tv/unkown"
    });
});

client.login(process.env.TOKEN);
