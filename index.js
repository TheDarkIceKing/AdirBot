const {Client, Intents} = require('discord.js');
const Discord = require('discord.js')
const botsettings = require('./config.json');
const checkdevs = require ('./functions/check_developer');
require('dotenv').config()

const bot = new Client({intents: 32767})


const fs = require("fs");
const matchsniper = require('./functions/matchsniper');
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

bot.login(process.env.token);

bot.once('ready', async () => {
    console.log(bot.user.username + " Is online!")
    console.log("Loading valosniper...")
    matchsniper.start(bot).then(() => {
        console.log("Sniper started.")
    })
})


// register command
fs.readdir("./commands/", (err, files) => {
    let folder = files.filter(f => f.split(".").pop())

    for (i = 0; i < folder.length; i++) {
        loadCommands(folder[i])
    }

});

// commandhandler
bot.on("messageCreate", async message => {

    let prefix = botsettings.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if (commandfile) {
        message.delete()
        if (commandfile.config.permission == "DEVELOPER" && await checkdevs.check(message.author.id) == false) {
            message.channel.send({content: "Only bot developers can access this command"})
            return;
        } else {
            if (commandfile.config.permission == "ADMINISTRATOR") {
                if(!message.member.roles.cache.find(r => r.id == commandfile.config.requiredrole)){
                    if(!message.member.roles.highest.position > message.guild.roles.cache.get(commandfile.config.requiredrole).rawPosition || !commandfile.config.higherRoleAllowed){
                        message.channel.send({content: "You do not have the required role to execute this command"})
                        return
                    }
                }
                commandfile.run(bot, message, args)
            } else {
                // if (commandfile.config.permission != "BOT" && message.author.bot == true) {
                //     message.reply("Bots cannot execute this command")
                //     return
                // }
                commandfile.run(bot, message, args)
            }

        }

    }
})

async function loadCommands(folder) {
    fs.readdir(`./commands/${folder}/`, (err, files) => {
        if (err) console.log(err)

        let jsfile = files.filter(f => f.split(".").pop() === "js")

        jsfile.forEach((f, i) => {
            let pull = require(`./commands/${folder}/${f}`);
            bot.commands.set(pull.config.name, pull);
            console.log("command " + botsettings.prefix + pull.config.name + " loaded")
            pull.config.aliases.forEach(alias => {
                bot.aliases.set(alias, pull.config.name)
                console.log(`new alias loaded for ${botsettings.prefix + pull.config.name} (${botsettings.prefix + alias})`)
            });
        });
    })





}

