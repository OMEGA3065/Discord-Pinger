import 'dotenv/config';
import express from 'express';
import { DateTime } from 'luxon';
import {
  // ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { setServerData, getServerData } from './utils.js';

PING_COOLDOWN = 3600000 // in minutes
DAYTIME_START = 6 // in hours, cannot be decimal, from 0 to 23
DAYTIME_END = 23 // in hours, cannot be decimal, from 0 to 23

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { type, data, member, guild_id } = req.body;
  

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;
    
    if (name === 'ping') {
      let date = Date.now()
      if (date > getServerData(guild_id, "last_ping")+PING_COOLDOWN) {
        let hrs = DateTime.now().setZone('America/New_York').hour;
        let role = hrs < DAYTIME_END && hrs > DAYTIME_START ? "ping_role_day" : "ping_role_night";
        let roleId = getServerData(guild_id, role);
        setServerData(guild_id, "last_ping", date);
        
        let message = options ? options[0].value : ""
        
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `<@&${roleId}>\n${message}`
          },
        });
      }
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Not even an hour has passed since the last ping. You can ping once an hour passes.`,
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      });
    }
    if (name === 'set_role') {
      if (Number(member["permissions"]) & 32) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Pick a role to ping when anyone runs /ping`,
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                      type: MessageComponentTypes.ROLE_SELECT,
                      custom_id: "role_day",
                      placeholder: "Choose a role for daytime",
                      min_values: 1,
                      max_values: 1
                  }
                ]
              },
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                      type: MessageComponentTypes.ROLE_SELECT,
                      custom_id: "role_night",
                      placeholder: "Choose a role for night time",
                      min_values: 1,
                      max_values: 1
                  }
                ]
              }
            ]
          },
        });
      }
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `You do not have the required permissions to run this command.`,
          flags: InteractionResponseFlags.EPHEMERAL
        },
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }
  if (type === InteractionType.MESSAGE_COMPONENT) {
    const componentId = data.custom_id;
    if (componentId.startsWith("role_")) {
      const roleId = data.values[0]
      setServerData(guild_id, "ping_"+componentId, roleId)
      let dayOrNight = componentId === "role_day" ? "daytime" : "night time"
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Role for ${dayOrNight} was set to <@&${roleId}> `,
          flags: InteractionResponseFlags.EPHEMERAL
        },
      });
    }

    console.error(`unknown message component: ${componentId}`);
    return res.status(400).json({ error: 'unknown message component' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
