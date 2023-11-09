const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");



module.exports = {
  name: "gerenciar_comandos",
  description: "Habilitar/Desabilitar comandos",
  type: 1,
  options: [
    {
      name: "comando",
      description: "Nome do comando a ser Desabilitado ou Habilitado ",
      type: 3,
      required: true,
      choices: [
        //ADM
        { name: "Apagar Tudo", value: "apagar_tudo" },
        { name: "Apagar", value: "apagar" },
      //{ name: "Ban", value: "ban" },
      //{ name: "Gerenciar Chat", value: "gerenciar_chat" },
        //Dono
      //{ name: "Gerenciar Comandos", value: "gerenciar_comandos"},
      //{ name: "Gerenciar Post", value: "gerenciar_post"},
        //Membros
      //{ name: "Ajuda", value: "ajuda" },
        { name: "Avatar", value: "avatar" },
      //{ name: "info_bot", value: "info_bot"},
        { name: "Info Membro", value: "info_membro" },
        { name: "Info Serve", value: "info_serve" },
      //{ name: "lista_servers", value: "lista_servers"},
      //{ name: "lista_cmd_bloqueados", value: "lista_cmd_bloqueados" },
        { name: "Memes", value: "memes" },
      //{ name: "ping", value: "ping"},
        { name: "Putaria (+18)", value: "putaria" },
      ],
    },
    {
      name: "status",
      description: "Escolha 'Desabilitar' para Desabilitar o comando ou 'Habilitar' para ativá-lo",
      type: 3,
      required: true,
      choices: [
        { name: "Habilitar", value: "Habilitar" },
        { name: "Desabilitar", value: "Desabilitar" },
      ],
    },
  ],
  run: async (client, interaction) => {
    // Meu código principal
    //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

    //Permissões
    const TextoDePermissao = `Somente o dono do servidor pode usar este comando`;
    const PermissaoEmbed = Permissao(TextoDePermissao);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const servidorId = interaction.guildId;
    const servidorNome = interaction.guild.name;
    const comando = interaction.options.get("comando").value;
    const status =  interaction.options.get("status").value;


    if (!(interaction.member.user.id === interaction.guild.ownerId || interaction.member.user.id === Bot.NoobSupremo)) {
      return interaction.reply({ embeds: [PermissaoEmbed], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }


    const db = new sqlite3.Database("database_sqlite.db");

    db.get("SELECT Status FROM StatusComandos WHERE ServidorID = ? AND Comandos = ?", servidorId, comando, (err, row) => {
      if (err) {
        console.error("Erro ao verificar o status do comando:", err);
        interaction.reply({ content: `Ocorreu um erro ao verificar o status do comando '${comando}'.`, ephemeral: true });
        db.close();
      } else {
        if (status === "Desabilitar") {
          if (row && row.Status === "Desabilitado") {
            interaction.reply({ content: `O comando '${comando}' já está desabilitado no servidor '${servidorNome}' (ID: ${servidorId}).`, ephemeral: true });
            db.close();
          } else {
            db.run("INSERT OR REPLACE INTO StatusComandos (Comandos, Status, ServidorID, ServidorNome) VALUES (?, 'Desabilitado', ?, ?)", comando, servidorId, servidorNome, (err) => {
              if (err) {
                console.error("Erro ao Desabilitar o comando:", err);
                interaction.reply({ content: `Ocorreu um erro ao Desabilitar o comando '${comando}'.`, ephemeral: true });
              } else {
                interaction.reply({ content: `O comando '${comando}' foi desabilitado no servidor '${servidorNome}' (ID: ${servidorId}).` });
              }
              db.close();
            });
          }
        } else if (status === "Habilitar") {
          if (!row) {
            interaction.reply({ content: `O comando '${comando}' já está Habilitado no servidor '${servidorNome}' (ID: ${servidorId}).`, ephemeral: true });
            db.close();
          } else if (row.Status === "Habilitado") {
            interaction.reply({ content: `O comando '${comando}' já está Habilitado no servidor '${servidorNome}' (ID: ${servidorId}).`, ephemeral: true });
            db.close();
          } else {
            db.run("UPDATE StatusComandos SET Status = 'Habilitado' WHERE ServidorID = ? AND Comandos = ?", servidorId, comando, (err) => {
              if (err) {
                console.error("Erro ao Habilitar o comando:", err);
                interaction.reply({ content: `Ocorreu um erro ao Habilitar o comando '${comando}'.`, ephemeral: true });
              } else {
                interaction.reply({ content: `O comando '${comando}' foi Habilitado no servidor '${servidorNome}' (ID: ${servidorId}).` });
              }
              db.close();
            });
          }
        }
      }
    });
  },
};
