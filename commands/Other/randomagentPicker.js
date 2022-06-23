const Discord = require("discord.js")
const { generateDependencyReport, AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
var fs = require('fs');
var files = fs.readdirSync('./Content/Other/RandomAgentSelectSounds/PreRound')

module.exports.run = async (bot, message, args) => {
    const voiceChannelId = message.member.voice.channelId;
    if(!voiceChannelId) return message.channel.send({content: "You are not in voicechat"})
    State = "Waiting"

   

    //get the voice channel ids
    const voiceChannel = bot.channels.cache.get(voiceChannelId);
    const guildId = "889940595638960178";

    //create audio player
    const player = createAudioPlayer();

    player.on(AudioPlayerStatus.Idle, ()  => {
        if(State == "Done"){
            connection.destroy()
        } else if(State == "AgentPick"){
            var agentfiles = fs.readdirSync('./Content/Other/RandomAgentSelectSounds/Agents')
            selectedAgent = agentfiles[Math.floor(Math.random() * agentfiles.length)]
            agentvoicelines = fs.readdirSync(`./Content/Other/RandomAgentSelectSounds/Agents/${selectedAgent}`)


            resource = createAudioResource(`./Content/Other/RandomAgentSelectSounds/Agents/${selectedAgent}/${agentvoicelines[Math.floor(Math.random() * agentvoicelines.length)]}`);
            player.play(resource);




            State = "Done"
        } else {
           
            resource = createAudioResource(`./Content/Other/RandomAgentSelectSounds/PreRound/${files[Math.floor(Math.random() * files.length)]}`);
            player.play(resource);
        }
        
    })

    player.on('error', error => {
        console.error(`Error: ${error.message} with resource`);
    });

    //create and play audio
     resource = createAudioResource(`./Content/Other/RandomAgentSelectSounds/PreRound/${files[Math.floor(Math.random() * files.length)]}`);
    player.play(resource);
    State = "AgentPick"

    //create the connection to the voice channel
    const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // interaction.reply("created voice connection")

    // Subscribe the connection to the audio player (will play audio on the voice connection)
    const subscription = connection.subscribe(player);

    // subscription could be undefined if the connection is destroyed!
    if (subscription) {
        // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
        setTimeout(() => {
            subscription.unsubscribe()
            
        }, 30_000);
    }

},

    module.exports.config = {
        name: "test",
        description: "test",
        aliases: [],
        usage: "",
        permission: "DEVELOPER"
    }