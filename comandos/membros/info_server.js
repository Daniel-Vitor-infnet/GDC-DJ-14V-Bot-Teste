const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


module.exports = {
  name: "info_server",
  description: "Exibe informações do servidor.",
  type: 1,

  run: async (client, interaction) => {
    // Extrair dados relevantes da interação
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
    let ft = interaction.guild.iconURL({ dynamic: true, size: 1024 }) || 'https://wingandaprayerdotlive.files.wordpress.com/2018/07/no-image-available.jpg';

    // Calcula os canais
    const canais_total = interaction.guild.channels.cache.size;
    const canais_texto = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildText).size;
    const canais_voz = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice).size;
    const canais_categoria = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildCategory).size;

    const calcularTempo = (data) => {
      const diferencaTempo = new Date() - data;
      const anos = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24 * 365.25));
      const meses = Math.floor((diferencaTempo % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      const dias = Math.floor((diferencaTempo % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
      const partes = [];

      if (anos > 0) partes.push(`${anos} ano${anos > 1 ? 's' : ''}`);
      if (meses > 0) partes.push(`${meses} mês${meses > 1 ? 'es' : ''}`);
      if (dias > 0) partes.push(`${dias} dia${dias > 1 ? 's' : ''}`);

      return `há ${partes.join(' || ')}`;
    };

    const serverembed = new Discord.EmbedBuilder()
      .setColor(Bot.Cor)
      .setThumbnail(ft)
      .setTitle(':satellite: Servidor Status')
      .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: ':clipboard: Nome', value: `\`${interaction.guild.name}\``, inline: true },
        { name: '🆔 Servidor', value: `\`${interaction.guild.id}\``, inline: true },
        { name: ':camera_with_flash: Foto Do Servidor', value: `[Clique Aqui Para Baixar a foto](${ft})`, inline: true },
        { name: '\u2009 ', value: '\u2009 ' },
        { name: ':mechanic_tone1: Fundador do Servidor', value: `<@${interaction.guild.ownerId}>`, inline: true },
        { name: '🆔 Fundador', value: `\`${interaction.guild.ownerId}\``, inline: true },
        { name: '\u2009 ', value: '\u2009 ' },
        { name: '👨🏻‍🦱Membros e Bots🤖', value: `Total de Bots: \`${interaction.guild.members.cache.filter(member => member.user.bot).size}\` | \`${Math.round((interaction.guild.members.cache.filter(member => member.user.bot).size / interaction.guild.memberCount) * 100)}\`%\nTotal Humanos: \`${interaction.guild.memberCount - interaction.guild.members.cache.filter(member => member.user.bot).size}\` | \`${Math.round(((interaction.guild.memberCount - interaction.guild.members.cache.filter(member => member.user.bot).size) / interaction.guild.memberCount) * 100)}\`%\nTotal de Membros: \`${interaction.guild.memberCount}\``, inline: false },
        { name: '\u2009 ', value: '\u2009 ' },
        { name: '🎙 Canais', value: `Chats de Voz: \`${canais_voz}\` | \`${Math.round((canais_voz / canais_total * 100))}%\` \nCanais de Texto: \`${canais_texto}\` | \`${Math.round((canais_texto / canais_total * 100))}%\`  \nCategorias: \`${canais_categoria}\` | \`${Math.round((canais_categoria / canais_total * 100))}%\``, inline: false },
        { name: '\u2009 ', value: '\u2009 ' },
        { name: 'Nível de Boost do servidor', value: `\`${interaction.guild.premiumTier}\``, inline: true },
        { name: 'Total de boosts', value: `\`${interaction.guild.premiumSubscriptionCount}\``, inline: true },
        { name: '\u2009 ', value: '\u2009 ' },
        { name: '🔧 Server Criado em', value: `\`${interaction.guild.createdAt.toLocaleDateString("pt-BR")}\` \n\`${calcularTempo(interaction.guild.createdAt)}\``, inline: false },
        { name: '\u2009 ', value: '\u2009 ' },
        { name: '🗓 Você Entrou em', value: `\`${interaction.member.joinedAt.toLocaleDateString("pt-BR")}\` \n \`${calcularTempo(interaction.member.joinedAt)}\``, inline: false }
      )
      .setFooter({ text: `${interaction.user.username}  🆔(${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

    await interaction.reply({ embeds: [serverembed] });
  },
};




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
