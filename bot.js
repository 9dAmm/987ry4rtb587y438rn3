const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(client.user.tag + ' Ready! (' + client.user.id + ')');
});

client.login(process.env.TOKEN);
