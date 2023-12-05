/*
node commands/cmds.js
updates slash cmd
*/
require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

const commands = [
    {
      name: 'rename',
      description: 'renames all users to name specified',
      options: [
        {
          name: 'name',
          description: 'name',
          type: ApplicationCommandOptionType.String,
          required: true,          
        },
      ],
      default_member_permissions: PermissionFlagsBits.ManageGuild.toString(),
    },
    {
      name: 'revert',
      description: 'reverts all users back to their original nicknames',
      default_member_permissions: PermissionFlagsBits.ManageGuild.toString(),
    },
];


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(
        process.env.ID
      ),
      { body: commands }
    );
    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();