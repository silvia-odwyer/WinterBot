// NPM MODULES
const commando = require("discord.js-commando");
const path = require("path");
const sqlite = require("sqlite");

// Token & relevant IDs for channels
let token_obj = require(`./token.json`);
let token = token_obj["token"];

let owner_id_obj = require(`./owner_id.json`);
let owner_discord_id = owner_id_obj["owner_discord_id"];


sqlite.open("./database.sqlite3");

const client = new commando.Client({
  owner: owner_discord_id,
  commandPrefix: "!",
  disableEveryone: true,
  unknownCommandResponse: false
});

var bot_prefix = "!";
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity(
    `${bot_prefix} help | Running on ${client.guilds.size} servers`
  );
});

// Regulate the bot's status
client
  .on("reconnecting", () => {
    console.warn("ATTEMPTING TO RECONNECT: GitHub4Discord is reconnecting...");
  })
  .on("disconnect", () => {
    console.warn("DISCONNECTED: Warning! GitHub4Discord has disconnected!");
  });

// Error handling; make sure that error messages are all outputted accordingly.
client
  .on("error", console.error)
  .on("warn", console.warn)
  .on("debug", console.log);

client.on("guildCreate", guild => {
  var message = `JOINED NEW SERVER: Joined a new server called: ${
    guild.name
  } (id: ${guild.id}). Member count: ${guild.memberCount} `;
});

client.on("guildDelete", guild => {
  var message = `REMOVAL: Bot was removed from the following server: ${
    guild.name
  } (id: ${guild.id})`;
  console.log(message);
  client.user.setActivity(
    `${bot_prefix} help | Running on ${client.guilds.size} servers`
  );
});

// If there is an error with the Commando module, let the user know.
client
  .on("commandError", (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    var message = `ERRCMD: Error in command ${cmd.groupID}:${
      cmd.memberName
    }, ${err}`;
  })
  .on("commandBlocked", (msg, reason) => {
    console.log(oneLine`
		Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ""}
		blocked; ${reason}
	`);
    msg.reply("BLKCMD: Command has been blocked.");
  })
  .on("groupStatusChange", (guild, group, enabled) => {
    console.log(oneLine`
		Group ${group.id}
		${enabled ? "enabled" : "disabled"}
		${guild ? `in guild ${guild.name} (${guild.id})` : "globally"}.
	`);
  })

  // Event listener for when a message is sent.
  .on("message", async msg => {
    // Make sure it's not a bot.
    if (msg.author.bot) return;

    // Create a placeholder variable for now.
    let message;

    // Check prefix.
    if (
      msg.content.split(" ").slice(0, 1) === bot_prefix ||
      msg.content.split("")[0] === bot_prefix
    ) {
      // Logging
      message = `Message: ${msg.content} Author: ${msg.author} Timestamp: ${
        msg.createdTimestamp
      }  Server: ${msg.guild.name}  Date: ${msg.createdAt}Server Count: ${
        msg.guild.memberCount
      }`;
      try {
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  });

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

client
  .setProvider(
    sqlite
      .open(path.join(__dirname, "database.sqlite3"))
      .then(db => new commando.SQLiteProvider(db))
  )
  .catch(console.error);

client.registry
  .registerDefaultTypes()

  .registerGroups([["digests", "Digests"]])
  .registerDefaultGroups()
  .registerDefaultCommands({ help: false })
  .registerCommandsIn(path.join(__dirname, "commands"));

client.login(token);
