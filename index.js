const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("./estruturas/modulos.js");
const functions = require("./estruturas/functions_import.js");
const config = require("./config.json")
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  shards: "auto",
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember
  ]
});

const path = require('node:path');
const fs = require("fs")

module.exports = client;
const eventFiles = [
  "ready",
  "interactionCreate",
  "messageCreate",
];
// Registre os Eventos
for (const eventFile of eventFiles) {
  const event = require(`./eventos/${eventFile}`);
  const eventName = eventFile.replace(/\.(js|ts)$/, ""); // Remove a extensão do arquivo

  if (eventName === "interactionCreate") {
    client.on(eventName, event.execute.bind(null, client));
  } else {
    client.on(eventName, (...args) => event.execute(...args, client));
  }
}




client.slashCommands = new Discord.Collection()
client.categories = fs.readdirSync("./comandos/");

["comandos"].forEach(handler => {
  require(`./eventos/reloadercommand`)(client);
});



client.login(config.token)