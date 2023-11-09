const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");







module.exports = {
  name: "remover_bot",
  description: "Remove o bot de um servidor específico pelo ID.", // Descrição do comando
  type: 1,
  options: [
    {
      name: 'id',
      description: 'Apenas ID',
      type: 3,
      required: true,
    }
  ],
  run: async (client, interaction) => {


    //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

    //Erro Quantidade
    const TextoDeID = `\n Não foi possível encontrar o servidor com o ID fornecido.`;
    const ErroID = Erro(TextoDeID);

    //Erro Quantidade
    const TextoDeRemoção = `\n Ocorreu um erro ao remover o bot do servidor. (Verifique o console)`;
    const ErroDeRemoção = Erro(TextoDeRemoção);

    //Aviso Apagar
    const TextoDoApagou = `\`\`\`fix\n  Não consigo deletar mensagens de bots (incluindo a mim) ou as mensagens dos membros da STAFF. Para fazer isso, digite /apagar_tudo.  \`\`\` \`\`\`fix\n Aguarde até que todas mensagens sejam apagadas. (pode demorar até 5 min) \`\`\`  `;
    const Aviso2Apagou = Aviso2(TextoDoApagou);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!(interaction.member.user.id === Bot.NoobSupremo)) {
      return interaction.reply({ embeds: [PermissaoDono()], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }

    const serverId = interaction.options.getString('id');
    try {
      const guild = interaction.client.guilds.cache.get(serverId);

      if (guild) {
        await guild.leave();

        const Dono = await guild.members.fetch(guild.ownerId);
        const serverIcon = guild.iconURL({ dynamic: true });

        const embed = new Discord.EmbedBuilder()
          .setColor(Bot.Cor)
          .setTitle("Bot Removido do Servidor")
          .addFields(
            { name: '🖥 Servidor', value: `\`${guild.name}\``, inline: true },
            { name: '🆔 Servidor', value: `\`${guild.id}\``, inline: true },
            { name: '\u2009 ', value: '\u2009 ' },
            { name: ':mechanic_tone1: Fundador', value: `${Dono}`, inline: true },
            { name: '🆔 Fundador', value: `\`${Dono}\``, inline: true }
          )
          .setThumbnail(serverIcon);

        interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply({ embeds: [ErroID], ephemeral: true }).then(response => setTimeout(() => response.delete(), 40000)).catch(console.error);
      }
    } catch (error) {
      console.error(error);
      interaction.reply({ embeds: [ErroDeRemoção], ephemeral: true }).then(response => setTimeout(() => response.delete(), 40000)).catch(console.error);
    }
  },
};