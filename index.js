const fs = require('fs');
require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');

const client = new Client(
{
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
},  {GatewayIntentBits});

var guild;
var res;
var done = 0;

client.on('ready', async (c) => {
    console.log("Client ready");
    guild = client.guilds.cache.get("1009306799377235980"); //zheng serve
    console.log("Fetching users");
    res = await guild.members.fetch();
    fs.writeFile('nicknames.txt', "" , (err) => {if (err) throw err;});
    res.forEach((member) => {
        // console.log(member.displayName);
        // console.log(member.id);
        fs.appendFile("nicknames.txt", member.id + "\n" + member.displayName + "\n", (err) => {if (err) throw err;});
    });
    console.log("Finished fetching users");
})

client.on('guildMemberAdd', async (member) => {
    console.log("New user joined, updating users...")
    fs.appendFile("nicknames.txt", member.id + "\n" + member.displayName + "\n", (err) => {if (err) throw err;});
    console.log("Finished updating users");
});

client.on('guildMemberRemove', async (member) => {
    console.log("User left, updating users...")
    var arraynick = fs.readFileSync('nicknames.txt').toString().split("\n");
    var index = arraynick.indexOf(member.id);
    var t1 = arraynick.splice(index, 2);
    const stringa = t1.join('\n');
    fs.writeFile("nicknames.txt", stringa , (err) => {if (err) throw err;});
    console.log("Finished updating users");
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
    if(oldMember.nickname !== newMember.nickname) {
        if (done > 0) {
            done--;
            return;
        }
        var nick = newMember.nickname;
        if (newMember.nickname === null){nick = oldMember.nickname}
        console.log(`${oldMember.nickname}` + " changed their nickname to " + `${newMember.nickname}`);
        console.log("Updating data...");
        var arraynick = fs.readFileSync('nicknames.txt').toString().split("\n");
        var index = arraynick.indexOf(oldMember.id);
        arraynick[index + 1] = nick;

        const stringa = arraynick.join('\n');
        fs.writeFile("nicknames.txt", stringa , (err) => {if (err) throw err;});
        console.log("Finished updating");
    }
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'rename') {
        const name = interaction.options.get('name').value;
        console.log("Changing user nicknames");
        res.forEach((member) => {
            if (!member.manageable) {return;}
            done++;
            member.setNickname(name);
            console.log(member.displayName);
        });
        interaction.reply("Finished changing nicknames");
        console.log("Finished changing nicknames")
    }

    if (interaction.commandName === 'revert') {
        console.log("Reverting user nicknames");
        res.forEach((member) => {
            if (!member.manageable) {return;}
            done++;
            var arraynick = fs.readFileSync('nicknames.txt').toString().split("\n");
            var index = arraynick.indexOf(member.id);
            member.setNickname(arraynick[index + 1]);
            console.log(member.displayName);
        });
        interaction.reply("Finished reverting nicknames");
        console.log("Finished reverting nicknames")
    }
});
    


client.login(process.env.TOKEN)