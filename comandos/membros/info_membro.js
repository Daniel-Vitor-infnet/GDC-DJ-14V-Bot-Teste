const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


module.exports = {
  name: "info_membro",
  description: "Exibe informações sobre um membro.",
  type: 1,
  options: [
    {
      name: "membro",
      description: "Mencione um membro para ver suas informações.",
      type: Discord.ApplicationCommandType.User,
      required: false,
    },
  ],
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
    const user = interaction.options.getUser("membro") || interaction.user;

    const guild = await interaction.guild.members.fetch(user.id);

    let status = "offline 🛌🏻"; // Define um valor padrão para o status
    if (guild && guild.presence) {
      switch (guild.presence.status) {
        case "online":
          status = "online 👨🏻‍💻";
          break;
        case "dnd":
          status = "AFK 💨";
          break;
        case "idle":
          status = "Soneca 😴";
          break;
      }
    }

    let atividade = "Nenhuma atividade";
    if (guild && guild.presence.activities.length > 0) {
      atividade = guild.presence.activities.map((activity, index) => {
        let type = activity.type;
        let name = activity.name;

        // Se a atividade for personalizada do bot, não a inclua
        if (type === 4) {
          //return `Atividade personalizada do bot: **${name}**`;
          return `**${name}**`;
        }

        switch (type) {
          case 0:
            return `Jogando **${name}**`;
          case 1:
            return `Transmitindo **${name}**`;
          case 2:
            return `Ouvindo **${name}**`;
          case 3:
            return `Assistindo **${name}**`;
          default:
            return `Atividade desconhecida: **${type}**`;
        }
      });
    }

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

    const roles = guild.roles.cache
      .filter(role => role.name !== "@everyone") // Ignora o @everyone
      .map(role => role.toString());

    let cargos = "Nenhum cargo";
    if (roles.length > 0) {
      const limiteDeCargos = 25; // Use o limite de campos do embed
      cargos = roles.slice(0, limiteDeCargos).join(" ,");
      if (roles.length > limiteDeCargos) {
        cargos += `, e mais ${roles.length - limiteDeCargos}... \n(Discord limita quantidade de cargos por mensagem)`;
      }
    }

    const member = interaction.guild.members.cache.get(user.id);
    const joinedDate = member ? member.joinedAt : null;

    const embed = new Discord.EmbedBuilder()
      .setTitle(`Informações de \`${user.username}\``)
      .setColor(Bot.Cor)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
      .addFields(
        { name: '🤵🏻Membro:', value: `${user}` },
        { name: '#️⃣Hashtag:', value: `\`#${user.discriminator}\`` },
        { name: '🆔 ID: ', value: `\`${user.id}\`` },
        { name: '📡 Status:', value: `\`${status}\`` },
        { name: '👀 Atividade:', value: Array.isArray(atividade) ? atividade.join("\n") : atividade },
        { name: '🗓 A conta do Discord foi criada em:', value: `\`${user.createdAt.toLocaleDateString("pt-BR")}\` \n \`${calcularTempo(user.createdAt)}\``, inline: false },
        { name: '⌚️ Entrou nesse servidor em:', value: joinedDate ? `\`${joinedDate.toLocaleDateString("pt-BR")}\` \n \`${calcularTempo(joinedDate)}\`` : 'Não disponível', inline: false },
        { name: '👨🏻‍🎨 Avatar:', value: `[Clique Aqui Para Baixar Avatar!](${user.displayAvatarURL({ dynamic: true, size: 1024 })})` },
        { name: '🗄Cargos:', value: cargos }
      )
      .setFooter({ text: `${interaction.user.username}  🆔(${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

    interaction.reply({ embeds: [embed] }).catch((e) => {
      console.error(e);
    });
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
