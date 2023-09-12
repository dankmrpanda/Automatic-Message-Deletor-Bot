const fs = require('fs');
require('dotenv').config();
const {Client, GatewayIntentBits} = require('discord.js');
const { setMaxIdleHTTPParsers } = require('http');

const client = new Client(
{
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
},  {GatewayIntentBits});

var on = {}
var time = {}
var userId = {}
client.on('ready', (c) => {
    var array = fs.readFileSync('serverSettings.txt').toString().split("\n");
    (client.guilds.cache).forEach((guild) => { //checks each server the bot is in
        var setOn = "on";
        var setTime = "2000";
        var setOwner = guild.ownerId;
        var setTxt = guild.name + "\n" + guild.id + "\n" + "on\n" + "2000\n" + setOwner + "\n\n";
        for (let i = 0; i < array.length; i++) 
        {
            if(guild.id == array[i]) //checks if the server is already in serverSettings.txt
            {
                setOn = array[i + 1];
                setTime = array[i + 2];
                setOwner = array[i + 3];
                setTxt = "";
                break;
            }
        }
        fs.appendFile("serverSettings.txt", setTxt, (err) => {if (err) throw err;});
        on[guild.id] = setOn; 
        time[guild.id] = setTime;
        userId[guild.id] = setOwner;
    })
    console.log("bot online");
})

client.on('messageCreate', async(message) =>{
    if (on[message.guild.id] == "on"){
        if(message.author.id == userId[message.guild.id]){
            const stopTime = parseInt(time[message.guild.id]);
            console.log(stopTime);
            setTimeout(function() {
                message.delete()
                .then(e => {
                    console.log("message deleted");
                })
                .catch(error => {
                    console.log("message was already deleted");
                })
            }, stopTime);
        }
    }
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'toggle') {  
        const toggle = interaction.options.get('on-or-off').value;

        interaction.reply("Bot is now " + toggle);
        fs.readFile('serverSettings.txt', function(err, data) {
            if(err) throw err;
            var array = data.toString().split("\n");
            array[array.indexOf(interaction.guildId) + 1] = toggle;
            const stringa = array.join('\n');
            on[interaction.guildId] =  toggle;
            fs.writeFile('serverSettings.txt', stringa , (err) => {if (err) throw err;});
        });
        console.log(interaction.guild.name + "'s bot is now " + toggle);
    }
    if (interaction.commandName === 'set-time') {
        const timeSet = interaction.options.get('time').value;

        interaction.reply("Wait time for message deletes are now " + timeSet);
        fs.readFile('serverSettings.txt', function(err, data) {
            if(err) throw err;
            var array = data.toString().split("\n");
            array[array.indexOf(interaction.guildId) + 2] = timeSet;
            const stringa = array.join('\n');
            time[interaction.guildId] =  timeSet;
            fs.writeFile('serverSettings.txt', stringa , (err) => {if (err) throw err;});
        });
        console.log(interaction.guild.name + "'s bot wait time for message deletes are now " + timeSet);
    }
    if (interaction.commandName === 'status') {
        console.log("called status cmd");
        const status = on[interaction.guildId];
        console.log(status);
        interaction.reply("The bot is " + status);
    }
    if (interaction.commandName === 'time') {
        console.log("called time cmd");
        const timeSet = time[interaction.guildId];
        console.log(timeSet);
        interaction.reply("The current time between message deletes is " + timeSet + " milliseconds");
    }
    if (interaction.commandName === 'set-user') {  
        const user = interaction.options.get('user').value;

        interaction.reply(`Message delete user is now ${client.users.cache.get(user)}`);
        fs.readFile('serverSettings.txt', function(err, data) {
            if(err) throw err;
            var array = data.toString().split("\n");
            array[array.indexOf(interaction.guildId) + 3] = user;
            const stringa = array.join('\n');
            userId[interaction.guildId] = user;
            fs.writeFile('serverSettings.txt', stringa , (err) => {if (err) throw err;});
        });
        console.log(interaction.guild.name + `'s message delete user is now ${client.users.cache.get(user)}`);
    }
    if (interaction.commandName === 'user') {
        console.log("called user cmd");
        const user = userId[interaction.guildId];
        console.log(`<@${user}>`);
        interaction.reply(`The current time user for message delete is <@${user}>`);
    }
});

client.login(process.env.TOKEN)