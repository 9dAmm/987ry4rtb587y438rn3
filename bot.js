const Discord = require('discord.js');
const client = new Discord.Client();
const ownerID = '346629187504832513';

client.on('ready', () => {
    console.log(client.user.tag + ' Ready! (' + client.user.id + ')');
    client.user.setActivity('- 9dAmm , FM', "https://www.twitch.tv/xiaboodz_");
});

client.login(process.env.TOKEN);
