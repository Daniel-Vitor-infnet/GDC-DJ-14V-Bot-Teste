const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");
const Comando = require("../../estruturas/estrutura_help/embeds/comandos.js");
const Menu = require("../../estruturas/estrutura_help/embeds/menus.js");
const Selection = require("../../estruturas/estrutura_help/selection.js");





module.exports = {
  name: "ajuda",
  description: "Painel de comandos do bot.",
  type: 1,

  run: async (client, interaction) => {




    interaction.reply({ embeds: [Menu.Inicial], components: [Selection.MenuInicial], ephemeral: true }).then(() => {
      const collector = interaction.channel.createMessageComponentCollector();

      collector.on("collect", (c) => {
        const valor = c.values[0];
        c.deferUpdate();

        switch (valor) {
          case "Menu Inicial":
            interaction.editReply({
              embeds: [Menu.Inicial],
              components: [Selection.MenuInicial],
              ephemeral: true
            });
            break;

          /////////////////////////////////////////////////////////////////////////////ADM////////////////////////////////////////////////////////////////////////////////////////////

          case "Administração":
            interaction.editReply({
              embeds: [Menu.Staff],
              components: [Selection.Staff],
              ephemeral: true
            });
            break;

          case "apagar_tudo":
            interaction.editReply({
              embeds: [Comando.ApagarTudo]
            });
            break;

          case "apagar":
            interaction.editReply({
              embeds: [Comando.Apagar]
            });
            break;

          case "ban":
            interaction.editReply({
              embeds: [Comando.Ban]
            });
            break;
           
            case "gerenciar_chat":
              interaction.editReply({
                embeds: [Comando.gerenciarChat]
              });
              break;


          ////////////////////////////////////////////////////////////////////Dono/////////////////////////////////////////////////////////////////////////////////////////////////////

          case "Dono":
            interaction.editReply({
              embeds: [Menu.Dono],
              components: [Selection.Dono],
              ephemeral: true
            });
            break;

          case "gerenciar_comandos":
            interaction.editReply({
              embeds: [Comando.GerenciarComandos]
            });
            break;

          case "gerenciar_post":
            interaction.editReply({
              embeds: [Comando.GerenciarPost]
            });
            break;

          /////////////////////////////////////////////////////////////////////////////Membros////////////////////////////////////////////////////////////////////////////////////////////

          case "Membros":
            interaction.editReply({
              embeds: [Menu.Membros],
              components: [Selection.Membros],
              ephemeral: true
            });
            break;

          case "ajuda":
            interaction.editReply({
              embeds: [Comando.Ajuda]
            });
            break;

          case "avatar":
            interaction.editReply({
              embeds: [Comando.Avatar]
            });
            break;

        }
      });
    });

  }
};
