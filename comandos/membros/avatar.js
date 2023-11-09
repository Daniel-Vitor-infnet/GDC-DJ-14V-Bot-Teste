const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


module.exports = {
  name: "avatar",
  description: "Disponibiliza o avatar do próprio usuário ou caso escolha outra membro.",
  type: 1,
  options: [
    {
      name: "membro",
      description: "Escolhja um membro para ver o avatar dele.",
      type: 6,
      required: false,
    },
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
    const user = interaction.options.getUser("membro") || interaction.user;
    const avatar = user.displayAvatarURL({ dynamic: true, size: 1024 });

    const Avatar = new Discord.EmbedBuilder()
      .setColor(Bot.Cor)
      .setTitle(`📸 Avatar de \`${user.username}\``)
      .setImage(avatar)
      .setDescription(`📶 [Link Para Baixar o Avatar](${avatar})`)
      .setFooter({ text: `${interaction.user.username}  🆔(${interaction.user.id})`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

    interaction.reply({ embeds: [Avatar] });
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
