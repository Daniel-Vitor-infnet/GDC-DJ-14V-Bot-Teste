const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


module.exports = {
  name: "apagar", // Nome do comando
  description: "Limpe o canal de texto", // Descrição do comando
  type: 1,
  options: [
    {
      name: 'quantidade',
      description: 'Número de mensagens para serem apagadas. Escolha entre 1 e 99',
      type: 10,
      required: true,
    },
    {
      name: "motivo",
      description: "Insira por qual motivo você esta usando esse comando.",
      type: 3,
      required: true,
    }
  ],
  run: async (client, interaction) => {
    const servidorId = interaction.guildId;
    const comando = interaction.commandName;

    // Verificar se o comando está bloqueado no banco de dados
    const db = new sqlite3.Database("database_sqlite.db");
    const bloqueado = await verificaComandoBloqueado(servidorId, comando, db);
    db.close();

    //Bloqueio Embed Personalizado
    const TextoDoBloqueado = `O comando \`${comando}\` foi bloqueado neste servidor pelo dono <@${Bot.NoobSupremo}>. Qualquer dúvida entre em contato com a STAFF `;
    const Bloqueio = BloqueadoComando(TextoDoBloqueado);



    if (bloqueado) {
      interaction.reply({ embeds: [Bloqueio] })
      return;
    }

    // Meu código principal

    //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

    //Permissões
    const TextoDePermissao = `\`\`\`md\n# Você não possui permissão de Administrador ou Gerenciar mensagens. \`\`\``;
    const PermissaoEmbed = Permissao(TextoDePermissao);

    //Erro Quantidade
    const TextoDeQuantidade = `\n Você só pode escolher um inteiro número entre 1 e 99. Utilize /apagar [1 - 99]`;
    const ErroQuantidade = Erro(TextoDeQuantidade);

    //Erro Adm/bot
    const TextoDeADM = `\`\`\`diff\n- Não consigo deletar mensagens de bots (incluindo a mim) ou as mensagens dos membros da STAFF. Para fazer isso, digite /apagar_tudo.  \`\`\``;
    const ErroADM = Erro(TextoDeADM);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const numero = interaction.options.getNumber('quantidade');
    const motivo = interaction.options.getString('motivo');

    if (!(interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator) || interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages))) {
      return interaction.reply({ embeds: [PermissaoEmbed], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }


    // Verifica se o número de mensagens está dentro do intervalo válido
    if (numero < 1 || numero > 99) {
      interaction.reply({ embeds: [ErroQuantidade], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    } else {
      const messages = await interaction.channel.messages.fetch({ limit: parseInt(numero) });
      const messagesToDelete = messages.filter(
        (msg) => !msg.author.bot && !msg.member.permissions.has(Discord.PermissionFlagsBits.Administrator)
      );

      const totalMensagens = messagesToDelete.size; // Obtenha o valor total de mensagens a serem deletadas

      const Apagou = new Discord.EmbedBuilder()
        .setColor(Bot.Cor)
        .setTitle('🗑 Limpou o chat 🗑')
        .setDescription(`**\n${interaction.user} Deletou: \`\`0\`\` mensagens de um total de \`\`${numero}\`\` mensagens \n\`\`\`fix\n○○○○○○○○○○ 0% \`\`\` \n**`)
        .setThumbnail(Gif.Clear)
        .setFooter({ text: `${interaction.user.username}  🆔(${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      // Verifique se há mensagens elegíveis para exclusão
      if (totalMensagens > 0) {
        interaction.reply({ embeds: [Apagou] }).then(async (response) => {
          const responseMessage = response;
          let mensagensDeletadas = 0;

          for (const msg of messagesToDelete.values()) {
            await msg.delete();
            mensagensDeletadas++;

            // Calcular o progresso e atualizar o embed
            const progresso = (mensagensDeletadas / totalMensagens) * 100;
            const numBarras = Math.floor(progresso / 10);
            const barrasApagadas = '◉'.repeat(numBarras);
            const barrasRestantes = '○'.repeat(10 - numBarras);
            Apagou.setDescription(`**\n${interaction.user} Deletou: \`\`${mensagensDeletadas}\`\` mensagens de um total de \`\`${numero}\`\` mensagens \n\`\`\`fix\n${barrasApagadas}${barrasRestantes} ${progresso.toFixed(2)}%\`\`\` \`\`\`diff\n- Esse processo pode levar até 5 minutos. Por favor aguarde!!!  \`\`\` \n**`);
            responseMessage.edit({ embeds: [Apagou] });

            if (mensagensDeletadas === totalMensagens) {
              // Todas as mensagens foram deletadas, atualize a mensagem
              Apagou.setDescription(`**\n${interaction.user} Deletou: \`\`${mensagensDeletadas}\`\` mensagens de um total de \`\`${numero}\`\` mensagens.** \n\`\`\`fix\n Motivo: ${motivo} \`\`\` \`\`\`diff\n- Não consigo deletar mensagens de bots (incluindo a mim) ou as mensagens dos membros da STAFF. Para fazer isso, digite /apagar_tudo.  \`\`\` `);
              responseMessage.edit({ embeds: [Apagou] });
            }
          }
        }).catch(console.error);
      } else {
        // Não há mensagens elegíveis para exclusão
        interaction.reply({ embeds: [ErroADM], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
      }
    }
  }

}



// Função para verificar se o comando está bloqueado no banco de dados
async function verificaComandoBloqueado(servidorId, comando, db) {
  return new Promise((resolve, reject) => {
    db.get("SELECT Status FROM StatusComandos WHERE ServidorID = ? and Comandos = ? AND Status = 'Desabilitado'", servidorId, comando, (err, row) => {
      if (err) {
        console.error("Erro ao verificar se o comando está bloqueado:", err);
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
}
