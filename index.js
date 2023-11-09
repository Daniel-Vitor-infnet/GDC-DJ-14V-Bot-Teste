const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("./estruturas/constantes.js");

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
  "manage_database",
  "guildMemberAdd",
  "guildMemberRemove",
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

// Função assíncrona para chamar Post Do Reddit

const { postNewMemes, intervalMemes } = require('./eventos/reddit/post_meme.js');
const { postNewPutaria, intervalPutaria } = require('./eventos/reddit/post_putaria.js');

// Configure o setInterval para ambos os módulos
setInterval(() => postNewMemes(client), intervalMemes);
setInterval(() => postNewPutaria(client), intervalPutaria);



client.slashCommands = new Discord.Collection()
client.categories = fs.readdirSync("./comandos/");

["comandos"].forEach(handler => {
  require(`./eventos/reloadercommand`)(client);
});



client.login(config.token)