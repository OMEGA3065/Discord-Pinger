import 'dotenv/config';
import fs from 'fs';
const filePath = './serverData.json';


export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Path to the JSON file where server data will be stored

// Load server data from file
function loadServerData() {
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  }
  return {};
}

// Save server data to file
function saveServerData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Example of setting server data
export function setServerData(serverId, key, value) {
  const data = loadServerData();
  if (!data[serverId]) data[serverId] = {};
  data[serverId][key] = value;
  saveServerData(data);
}

// Example of getting server data
export function getServerData(serverId, key) {
  const data = loadServerData();
  return data[serverId] ? data[serverId][key] : null;
}
