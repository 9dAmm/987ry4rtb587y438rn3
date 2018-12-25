const Discord = require('discord.js');
const client = new Discord.Client();
const ownerID = '325165115131428864';

client.on('ready', () => {
    console.log(client.user.tag + ' Ready! (' + client.user.id + ')');
    client.user.setActivity('Khalid Alenazi', {
        type: "STREAMING",
        url: "https://www.twitch.tv/unkown"
    });
});

client.on('message', message => {
    if(message.channel.type !== 'text') return;
    if(message.author.id !== ownerID) return;
    
    var args = message.content.toLowerCase().split(' ');
    var command = args[0];
    var prefix = '9';
    
    if(command == prefix + 'help') {
        
    }
    if(command == prefix + 'setname') {
        
    }
    if(command == prefix + 'setavatar') {
        
    }
    if(command == prefix + 'setplay') {
        
    }
    if(command == prefix + 'setlisten') {
        
    }
    if(command == prefix + 'setwatch') {
        
    }
    if(command == prefix + 'setstream') {
        
    }
    if(command == prefix + 'say') {
        
    }
	if(command == prefix + 'bc') {
		
	}
});
