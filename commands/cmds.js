/*
node commands/cmds.js
updates slash cmd
*/
require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

const commands = [
  {
    name: 'toggle',
    description: 'Toggles bot on or off',
    options: [
      {
        name: 'on-or-off',
        description: 'bot on or off',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "on",
            value: "on"
          }, 
          {
            name: "off",
            value: "off"
          }
        ]
        
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: 'set-time',
    description: 'Sets wait time for message delete',
    options: [
      {
        name: 'time',
        description: 'time in milliseconds',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: 'status',
    description: 'Replies with current status of bot',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: 'time',
    description: 'Replies with current time set for message deletes',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: 'set-user',
    description: 'Sets the user whose messages will be deleted',
    options: [
      {
        name: 'user',
        description: 'delete user messages',
        type: ApplicationCommandOptionType.User,
        required: true,        
      },
    ],
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: 'user',
    description: 'Replies with current user whose messages are deleted',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
  },
  {
    name: 'settings',
    description: 'Shows the bot\' current configs/settings.',
    default_member_permissions: PermissionFlagsBits.Administrator.toString(),
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