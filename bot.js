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

client.on('message', message => {
    if(message.channel.type !== 'text') return;
    if(message.author.id !== ownerID) return;
    
    var args = message.content.toLowerCase().split(' ');
    var command = args[0];
    var prefix = '9';
    
    if(command == prefix + 'help') {
        
    }
    if(command == prefix + 'setname') {
        args = message.content.split(' ').slice(1).join(' ');
        if(args) return;
        if(args2.length > 32) return;
        client.user.setUsername(args);
        message.channel.send(`Successfully set my name to **${args}**`);
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
});

client.login(process.env.TOKEN);
