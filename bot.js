const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(client.user.tag + ' Ready!');
	client.user.setActivity('', {
		type: "STREAMING",
		url: "https://www.twitch.tv/unkown"
	});
});

client.login(process.env.TOKEN);
