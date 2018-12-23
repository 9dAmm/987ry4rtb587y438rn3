const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const GOOGLE_API_KEY = "AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8";
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);
const ownerID = '346629187504832513';
var queue = {};
var sendMessageQueue = true;

client.on('ready', () => {
    console.log(client.user.tag + ' Ready! (' + client.user.id + ')');
    client.user.setActivity('кнαιí∂ αιεnαzí ♛', {
        type: "STREAMING",
        url: "https://www.twitch.tv/unkown"
    });
});

client.on('message', async message => {
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
    if(command == prefix + 'play') {
        if(!message.member.voiceChannel) return message.channel.send('You must in voicechannel.');
        args = message.content.split(' ').slice(1).join(' ');
        if(!args) return message.channel.send('type name of music.');
		var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
		var validate = await ytdl.validateURL(args[1]);
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		if(regexp.test(args[1]) && !validate && !url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) return message.channel.send('Invalid url.');
		if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
	        var videos = await playlist.getVideos();
	        message.channel.send(`All songs of **${playlist.title}** Added to the Queue.`);
		for(const video of Object.values(videos)) {
                	const video2 = await youtube.getVideoByID(video.id);
	            	await handleVideo(video2, message, message.member.voiceChannel, true);
	        }
        }else {
            try {
                var video = await youtube.getVideo(url);
            }catch (error) {
                try {
                    var videos = await youtube.searchVideos(args);
                    if(!videos) return message.channel.send('No videos found.');
                    var video = await youtube.getVideoByID(videos[0].id);
                }catch (error) {
                    console.log(error);
                    return;
                }
            }
        }
        if(regexp.test(args) || validate || url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) return;
        var song = {
        	id: video.id,
		title: video.title,
		url: 'https://www.youtube.com/watch?v=' + video.id,
		avatar: video.thumbnail,
		video: video,
        };
        if(!queue) {
            queue = {
                    textChannel: message.channel,
	            voiceChannel: message.member.voiceChannel,
	            connection: null,
	            songs: [],
	            volume: 100,
	            playing: true,
	            repeat: false
            };
	    try {
                var connection = await message.member.voiceChannel.join();
	        queue.connection = connection;
      	        play(message.guild, queue.songs[0], message);
            }catch (err) {
                console.error(err);
	            queue.songs = [];
	            return;
	        }
        }else {
            queue.songs.push(song);
	        if(playlist) return;
	        await message.channel.send(message, `**${queue.songs[0].title}** added to Queue.`);
        }
    }
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
    var song = {
        id: video.id,
		title: video.title,
		url: 'https://www.youtube.com/watch?v=' + video.id,
		avatar: video.thumbnail,
		video: video,
    };
    if(!queue) {
        queue = {
            textChannel: message.channel,
	        voiceChannel: voiceChannel,
	        connection: null,
	        songs: [],
	        volume: 100,
	        playing: true,
	        repeat: false
        };
	try {
            var connection = await voiceChannel.join();
	    queue.connection = connection;
      	    play(message.guild, queue.songs[0], message);
        }catch (err) {
            console.error(err);
	    queue.songs = [];
	    return;
	}
    }else {
        queue.songs.push(song);
	if(playlist) return;
	await message.channel.send(message, `**${queue.songs[0].title}** added to Queue.`);
    }
};
function play(guild, song, message) {
	if (!song) {
		if(sendMessageQueue == true) queue.textChannel.send('The queue has been finished.');
		return;
	}
	const dispatcher = queue.connection.playStream(ytdl(song.url)).on('end', reason => {
		if(queue.repeat == false) {
			console.log(reason);
			queue.songs.shift();
			play(guild, queue.songs[0], message);
		}else if (queue.repeat == true) {
			play(guild, queue.songs[0], message);
		}
	}).on('error', error => console.error(error));
    	dispatcher.setVolumeLogarithmic(queue.volume / 100);
	queue.textChannel.send(`Now playing 🎶 ${queue.songs[0].title}`);
}

client.login(process.env.TOKEN);
