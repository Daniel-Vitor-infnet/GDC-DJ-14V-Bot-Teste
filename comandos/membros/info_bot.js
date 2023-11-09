const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");
const config = require("../../config.json");
require("moment-duration-format");
let cpuStat = require("cpu-stat")
const moment = require("moment");


module.exports = {
  name: "info_bot", // Coloque o nome do comando
  description: "Fornece informações sobre o bot.", // Coloque a descrição do comando
  type: 1,

  run: async (client, interaction) => {

    const { version } = require("discord.js")
    cpuStat.usagePercent(async function (err, percent, seconds) {
      if (err) {
        return console.error(err);
      }
      const duration = moment.duration(client.uptime).format(" D[d], H[h], m[m]");

      let status;
      switch (client.user.presence.status) {
        case "online":
          status = "online 👨🏻‍💻";
          break;
        case "dnd":
          status = "AFK 💨";
          break;
        case "idle":
          status = "Soneca 😴";
          break;
        case "offline":
          status = "offline 🛌🏻";
          break;
      }
      const info = {
        Servidores: client.guilds.cache.size,
        Canais: client.channels.cache.size,
        Membros: client.users.cache.size,
        BotTag: client.user.tag,
        BotVersion: require("../../package.json").version,
        Ping: Math.round(client.ws.ping),
        Memoria: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
      };


      await interaction.deferReply(); //Aviso que o bot esta pensando
      const InfoBot = new Discord.EmbedBuilder()
        .setColor(Bot.Cor)
        .setThumbnail(Bot.Foto)
        .setTitle(`Olá , Abaixo está uma listinha sobre mim: `)
        .setDescription(`**Requisitos Para me adicionar em seu servidor:( Servidor com no mínimo 70 membros ou Dar Booster Em Meu [Servidor Oficial✨](${Bot.Servidor}) )\n\n Bot Hospedado em Hots 24h/7**\n`)
        .addFields(
          { name: '🖋️ Me chamo', value: `┕\`${info.BotTag}\``, inline: false },
          { name: '👨‍🔧 Meu Criador', value: `┕<@${Bot.NoobSupremo}>`, inline: false },
          { name: '🏡 Minha Casa', value: `┕[Servidor Oficial✨](${Bot.Servidor})`, inline: false },
          { name: '\u2009 ', value: '\u2009 ', inline: false },
          { name: '**\n↓**', value: '\u2009 ', inline: true },
          { name: '🤖 Administro\n↓', value: `\u200B`, inline: true },
          { name: '**\n↓** ', value: '\u2009 ', inline: true },
          { name: '💻 Servidores', value: `┕\`${info.Servidores}\``, inline: true },
          { name: '🛠️ Canais', value: `┕\`${info.Canais}\``, inline: true },
          { name: '👥 Membros', value: `┕\`${info.Membros}\``, inline: true },
          { name: '\u2009 ', value: '\u2009 ', inline: false },
          { name: '🛰️ Agora Estou', value: `┕\`${status}\``, inline: true },
          { name: '\u2009 ', value: '\u2009 ', inline: true },
          { name: '🕒 Tempo de atividade', value: `┕\`${duration}\``, inline: true },
          { name: '📡 Ping', value: `┕\`${info.Ping}ms\``, inline: true },
          { name: '\u2009 ', value: '\u2009 ', inline: true },
          { name: '🗄️ Memoria', value: `┕\`${info.Memoria}mb\``, inline: true },
          { name: '\u2009 ', value: '\u2009 ', inline: false },
          { name: '🤖 Bot', value: `┕\`v${info.BotVersion}\``, inline: true },
          { name: '📘 Discord.js', value: `┕\`v${version}\``, inline: true },
          { name: '📗 Node', value: `┕\`${process.version}\``, inline: true },
        )
        .setFooter({ text: `${interaction.user.username}  🆔(${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()

      interaction.editReply({ embeds: [InfoBot] })


    })
  },

};