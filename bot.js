const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const GOOGLE_API_KEY = "AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8";
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_API_KEY);
const ownerID = '346629187504832513';
const queue = new Map();

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
	
	var args = message.content.split(' ');
	var searchString = args.slice(1).join(' ');
	var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	var serverQueue = queue.get(message.guild.id);
	var command = message.content.toLowerCase().split(' ')[0];
	var prefix = '9';
	
	if(command == prefix + 'play') {
		var voiceChannel = message.member.voiceChannel;
		if(!voiceChannel) return message.channel.send('You must in a voicechannel.');
		var permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = youtube.getPlaylist(url);
			var videos = playlist.getVideos();
			for(const video of Object.values(videos)) {
				var video2 = youtube.getVideoByID(video.id);
				await handleVideo(video2, message, voiceChannel, true);
			}
			return message.channel.send(`All songs of **${playlist.title}** has been added to the Queue.`);
		}else {
			try {
				var video = youtube.getVideo(url);
			}catch (error) {
				try {
					message.channel.send('Please wait ...').then(msg => {
						var videos = youtube.searchVideos(searchString, 5);
						if(!videos[0]) {
							msg.edit('Cannot find any results.');
							return;
						}
						let x = 0;
						let songsSelect = new Discord.RichEmbed()
						.setTitle(`\`${searchString}\``)
						.setColor('RED')
						.setDescription(videos.map(video2 => `**${index++}.** ${video2.title}`).join('\n'))
						.setFooter('Select from 1 to 5.');
						msg.edit({
							embed: songsSelect
						});
					});
					try {
						var response = message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 6, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					}catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = youtube.getVideoByID(videos[videoIndex - 1].id);
				}catch (err) {
					console.error(err);
					return message.channel.send('No results.');
				}
			}
			var serverQueue = queue.get(message.guild.id);
			var song = {
				id: video.id,
				title: video.title,
				url: 'https://www.youtube.com/watch?v=' + video.id
			};
			if(!serverQueue) {
				var queueConstruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true
				};
				queue.set(message.guild.id, queueConstruct);
				queueConstruct.songs.push(song);
				try {
					var connection = await voiceChannel.join();
					queueConstruct.connection = connection;
					play(message.guild, queueConstruct.songs[0]);
				}catch (error) {
					console.error(`I could not join the voice channel: ${error}`);
					queue.delete(message.guild.id);
					return message.channel.send(`I could not join the voice channel: ${error}`);
				}
			}else {
				serverQueue.songs.push(song);
				console.log(serverQueue.songs);
				if(playlist) return undefined;
				else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
			}
		}
	}
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	var serverQueue = queue.get(msg.guild.id);
	var song = {
		id: video.id,
		title: video.title,
		url: 'https://www.youtube.com/watch?v=' + video.id
	};
	if(!serverQueue) {
		var queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);
		queueConstruct.songs.push(song);
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		}catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if(playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url)).on('end', reason => {
		if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
		else console.log(reason);
		serverQueue.songs.shift();
		play(guild, serverQueue.songs[0]);
	}).on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}

client.login(process.env.TOKEN);
