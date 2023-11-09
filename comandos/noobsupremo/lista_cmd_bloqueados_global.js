const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


module.exports = {
  name: "lista_cmd_bloqueados_global",
  description: "Lista todos os comandos bloqueados em todos os servidores",
  type: 1,
  run: async (client, interaction) => {
    //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

    //Aviso nenhum bloqueado
    const TextoDoNenhum = `Nenhum comando está bloqueado em nenhum servidor.`;
    const AvisoNenhum = Aviso(TextoDoNenhum);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const db = new sqlite3.Database("database_sqlite.db");

    if (!(interaction.member.user.id === Bot.NoobSupremo)) {
      return interaction.reply({ embeds: [PermissaoDono()], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }

    db.all("SELECT Comandos, ServidorID FROM StatusComandos WHERE Status = 'Desabilitado'", (err, rows) => {
      if (err) {
        interaction.reply({ content: "Ocorreu um erro ao listar comandos bloqueados.", ephemeral: true });
      } else if (rows.length > 0) {
        const StatusComandosByServer = rows.reduce((acc, row) => {
          const ServidorNome = client.guilds.cache.get(row.ServidorID)?.name || "Desconhecido";
          if (!acc[ServidorNome]) {
            acc[ServidorNome] = [];
          }
          acc[ServidorNome].push(row.Comandos);
          return acc;
        }, {});

        const StatusComandosTable = new Discord.EmbedBuilder()
          .setTitle("Comandos Bloqueados\n")
          .setColor(Bot.Cor)
          .setImage(Gif.Block);

        for (const ServidorNome in StatusComandosByServer) {
          const server = client.guilds.cache.find((guild) => guild.name === ServidorNome);
          const ServidorID = server ? server.id : "Desconhecido";

          const formattedServerName = `📑 ${ServidorNome}    🆔:  \`${ServidorID}\``;

          const StatusComandos = StatusComandosByServer[ServidorNome].map(Comandos => `\`${Comandos}\``).join("\n") + "**\n\n**";
          StatusComandosTable.addFields({ name: formattedServerName, value: `**\nComandos:**\n${StatusComandos}` });
        }
        interaction.reply({ embeds: [StatusComandosTable] });
      } else {
      interaction.reply({ embeds: [AvisoNenhum], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
      }
    });

    db.close();
  
  
  },
};
