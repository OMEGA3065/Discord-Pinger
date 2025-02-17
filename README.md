# PINGER DISCORD BOT
This discord bot ping users (previously selected when running command /set_role) when someone uses /ping command.
Distinguishes between daytime and night time (daytime is from 6AM EST to 11PM EST) and ping the appropriate role.
The /ping command is limited to a whitelist of channels which are added and removed by running /add_channel and /remove_channel respectively.

# Setup

Rename *.env.sample* to *.env* and fill in the fields
To install all required packages run: `npm install`<br>
To register all commands run: `npm run register`<br>
To start the server use: `npm run start`<br>

# Credits

- https://discord.com/developers/docs/quick-start/getting-started
