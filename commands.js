import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

// Ping Command
const PING_COMMAND = {
  name: 'ping',
  description: 'Pings the @LookingForPlayers role',
  type: 1,
  options: [
    {
      name: 'game',
      description: 'Game to include in the ping',
      type: 3,
      required: true,
    },
    {
      name: 'message',
      description: 'Optional message to include in the ping',
      type: 3,
      required: false,
    }
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command for setting day/night time roles
const SET_ROLE_COMMAND = {
  name: 'set_role',
  description: 'Sets the role used in /ping command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ADD_CHANNEL_COMMAND = {
  name: 'add_channel',
  description: 'Adds a chanel to the whitelist of /ping command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const REMOVE_CHANNEL_COMMAND = {
  name: 'remove_channel',
  description: 'Removes a chanel from the whitelist of /ping command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [PING_COMMAND, SET_ROLE_COMMAND, ADD_CHANNEL_COMMAND, REMOVE_CHANNEL_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
