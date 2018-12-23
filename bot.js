const Discord = require('discord.js');
const client = new Discord.Client();
const ownerID = '325165115131428864';

client.on('ready', () => {
    console.log(client.user.tag + ' Ready! (' + client.user.id + ')');
    client.user.setActivity('кнαιí∂ αιεnαzí ♛', {
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
    if(command == prefix + 'say') {
        args = message.content.split(' ').slice(1).join(' ');
        if(!args) return message.delete();
        message.delete();
        message.channel.send(args);
    }
    if(command == prefix + 'bc') {
        args = message.content.split(' ').slice(1).join(' ');
        if(!args) return;
        message.delete();
        message.guild.members.filter(m => !m.user.bot).forEach(m => m.send(args));
        message.channel.send(`Successfully send to ${message.guild.members.filter(m => !m.user.bot).size} member(s).`);
    }
});

client.login(process.env.TOKEN);
