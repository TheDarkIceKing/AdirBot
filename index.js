const { Client, Intents } = require('discord.js');
const Discord = require('discord.js')
const botsettings = require('./config.json');
const checkdevs = require('./functions/check_developer');
require('dotenv').config()

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const bot = new Client({ intents: 32767 })


const fs = require("fs");
const matchsniper = require('./functions/matchsniper');
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

bot.slashCommands = new Discord.Collection();
const slashCommands = [];


bot.login(process.env.token);

bot.once('ready', async () => {
    console.log(bot.user.username + " Is online!")
    console.log("Loading valosniper...")
    matchsniper.start(bot).then(() => {
        console.log("Sniper started.")
    })
    const rest = new REST({ version: '9' }).setToken(process.env.token);

    (async () => {
        try {
            const clientId = '862190339141533707';
            const guildId = '889940595638960178';
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: slashCommands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
})


// register command
fs.readdir("./commands/", (err, files) => {
    let folder = files.filter(f => f.split(".").pop())

    for (i = 0; i < folder.length; i++) {
        loadCommands(folder[i])
    }

});

// register slashcommand
fs.readdir("./slashCommands/", (err, files) => {
    let folder = files.filter(f => f.split(".").pop())

    for (i = 0; i < folder.length; i++) {
        loadSlashCommands(folder[i])
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
        message.channel.send({content: "We are slowly moving our commands to slash commands. Some commands may stop functioning"})
        message.delete()
        if (commandfile.config.permission == "DEVELOPER" && await checkdevs.check(message.author.id) == false) {
            message.channel.send({ content: "Only bot developers can access this command" })
            return;
        } else {
            if (commandfile.config.permission == "ADMINISTRATOR") {
                if (!message.member.roles.cache.find(r => r.id == commandfile.config.requiredrole)) {
                    if (!message.member.roles.highest.position > message.guild.roles.cache.get(commandfile.config.requiredrole).rawPosition || !commandfile.config.higherRoleAllowed) {
                        message.channel.send({ content: "You do not have the required role to execute this command" })
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

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    const slashCommand = bot.slashCommands.get(interaction.commandName)
    if(!slashCommand) return


    if (slashCommand.config.permission == "DEVELOPER" && await checkdevs.check(interaction.user.id) == false) {
        interaction.reply({ content: "Only bot developers can access this command", ephemeral: true })
        return;
    } else {
        if (slashCommand.config.permission == "ADMINISTRATOR") {
            console.log(interaction.guild.members.cache.get(interaction.member.id).roles.highest.position)
            if (!interaction.member._roles.find(r => r.id == slashCommand.config.requiredrole)) {
                if (!interaction.guild.members.cache.get(interaction.member.id).roles.highest.position > interaction.guild.roles.cache.get(slashCommand.config.requiredrole).rawPosition || !slashCommand.config.higherRoleAllowed) {
                    interaction.reply({ content: "You do not have the required role to execute this command", ephemeral: true})
                    return
                }
            }
            try{
                await interaction.execute(bot, interaction)
            }catch (err){
                console.log(err)
                await interaction.reply({content: "Interaction failed"})
            }
        } else {
            try{
                await slashCommand.execute(bot, interaction)
            }catch(err){
                console.log(err)
                await interaction.reply({content: "Interaction failed"})
            }
        }

    }

   
});

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
async function loadSlashCommands(folder) {
    fs.readdir(`./slashCommands/${folder}/`, (err, files) => {
        if (err) console.log(err)

        let jsfile = files.filter(f => f.split(".").pop() === "js")

        jsfile.forEach((f, i) => {
            let pull = require(`./slashCommands/${folder}/${f}`);
            bot.slashCommands.set(pull.data.name, pull);
            slashCommands.push(pull.data.toJSON())
        });
    })

}
