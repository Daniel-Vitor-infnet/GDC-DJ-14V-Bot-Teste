const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");



module.exports = {
  name: "gerenciar_post",
  description: "Ative ou desative um post do Reddit (canal atual)",
  type: 1,
  options: [
    {
      name: "post",
      description: "Escolha o tipo de post",
      type: 3,
      required: true,
      choices: [
        { name: "Putaria", value: "Putaria" },
      // { name: "Games", value: "Games" },
        { name: "Memes", value: "Memes" },
      ],
    },
    {
      name: "status",
      description: "Escolha 'Ativar' para ativar o evento ou 'Desativar' para desativá-lo",
      type: 3,
      required: true,
      choices: [
        { name: "Ativar", value: "Ativar" },
        { name: "Desativar", value: "Desativar" },
      ],
    },
    {
      name: "intervalo_em_minutos",
      description: " O intervalo deve ser de no minimo 20 minutos ou mais",
      type: 10,
      required: false,
    },
  ],
  run: async (client, interaction) => {

    const info = {
      ServidorNome:  interaction.guild.name,
      ServidorID:    interaction.guildId,
      CanalID:       interaction.channel.id,
      CanalNome:     interaction.channel.name,
      PostNome:      interaction.options.get("post").value,
      Status:        interaction.options.get("status").value,
      Intervalo:     interaction.options.getNumber("intervalo_em_minutos") !== null ? interaction.options.getNumber("intervalo_em_minutos") : 20,
    };


    const db = new sqlite3.Database("database_sqlite.db");

    //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

    //Permissões
    const TextoDePermissao = `Somente o dono do servidor pode usar este comando`;
    const PermissaoEmbed = Permissao(TextoDePermissao);

    //Erro Status
    const TextoDeStatus = `Ocorreu um erro ao verificar o status do evento \`${info.PostNome}\``;
    const ErroStatus = Erro(TextoDeStatus);

    //Erro Lugar
    const TextoDeTroca = `Ocorreu um erro ao trocar o evento \`${info.PostNome}\` de lugar. `;
    const ErroTroca = Erro(TextoDeTroca);

    //Erro Ativar
    const TextoDeAtivar = `Ocorreu um erro ao ativar o evento \`${info.PostNome}\`. `;
    const ErroAtivar = Erro(TextoDeAtivar);

    //Erro Desativar
    const TextoDeDesativar = `Ocorreu um erro ao desativar o evento \`${info.PostNome}\`. `;
    const ErroDesativar = Erro(TextoDeDesativar);


    //Aviso Desativado
    const TextoDoDesativado = `O evento \`${info.PostNome}\` foi desativado no servidor.`;
    const AvisoDesativado = Aviso3(TextoDoDesativado);

    //Aviso Ativado
    const TextoDoAtivado = `O evento \`${info.PostNome}\` foi ativado neste canal com um intervalo de \`${info.Intervalo} minutos\`.`;
    const AvisoAtivado = Aviso3(TextoDoAtivado);

    //Aviso já desativado
    const TextoDoJaOff = `O evento \`${info.PostNome}\` já está desativado no servidor.`;
    const AvisoJaOff = Aviso(TextoDoJaOff);

    //Aviso de Intervalo minimo
    const TextoDoIntervaloMinimo = `Você forneceu um intervalo de \`${info.Intervalo} minutos\`. \n O intervalo deve ser de no minimo \`20 minutos\` ou maior para eveitar spam`;
    const AvisoIntervaloMinimo = Aviso(TextoDoIntervaloMinimo);

    //Aviso de não escolhido
    const TextoDoIntervaloN = `Caso você não tenha escolhido nenhum intervalo, ele será definido automaticamente para o valor padrão de \`20 minutos\`. Se você já escolheu um intervalo, pode ignorar esta mensagem.`;
    const AvisoIntervaloN = Aviso2(TextoDoIntervaloN);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    if (!(interaction.member.user.id === interaction.guild.ownerId || interaction.member.user.id === Bot.NoobSupremo)) {
      return interaction.reply({ embeds: [PermissaoEmbed], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }

    if (info.Intervalo < 20) {
      return interaction.reply({ embeds: [AvisoIntervaloMinimo], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }


    db.get("SELECT Status, CanalID, Intervalo FROM EventosPost WHERE ServidorID = ? AND PostNome = ?", info.ServidorID, info.PostNome, (err, row) => {
      if (err) {
        console.error("Erro ao verificar o status do canal:", err);
        interaction.reply({ embeds: [ErroStatus], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
        db.close();
      } else {
        if (info.Status === "Ativar") {
          if (row && row.Status === "Habilitado") {
            if (row.CanalID !== info.CanalID) {
              // Código para atualizar o canal quando o CanalID é diferente
              const canalAntigo = interaction.guild.channels.cache.get(row.CanalID);
              db.run("UPDATE EventosPost SET Intervalo = ?, CanalID = ?, CanalNome = ? WHERE ServidorID = ? AND PostNome = ?", info.Intervalo, info.CanalID, info.CanalNome, info.ServidorID, info.PostNome, (err) => {
                if (err) {
                  console.error("Erro ao atualizar o CanalID e CanalNome:", err)
                  interaction.reply({ embeds: [ErroTroca], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
                } else {
                  const TextoDoTroca = `O evento \`${info.PostNome}\` foi movido do canal ${canalAntigo} para o canal atual <#${info.CanalID}> com um intervalo de \`${info.Intervalo} minutos\` \n\`\`\`fix\n Só pode haver um evento de ${info.PostNome} por servidor . \`\`\``;
                  const AvisoTroca = Aviso3(TextoDoTroca);
                  interaction.reply({ embeds: [AvisoTroca] }).then((response) => { interaction.followUp({ embeds: [AvisoIntervaloN], ephemeral: true }); }).catch(console.error);
                }
              });
            } else if (row.Intervalo !== info.Intervalo) {
              const intervaloAntigo = row.Intervalo
              db.run("UPDATE EventosPost SET Intervalo = ?, CanalID = ?, CanalNome = ? WHERE ServidorID = ? AND PostNome = ?", info.Intervalo, info.CanalID, info.CanalNome, info.ServidorID, info.PostNome, (err) => {
                // Código para tratar o caso em que o CanalID é o mesmo, mas o intervalo é diferente
                const TextoDoIntervaloDiferente = `O intervalo do evento \`${info.PostNome}\` foi alterado de \`${intervaloAntigo} minutos para\` \`${info.Intervalo} minutos\`.`;
                const AvisoIntervaloDiferente = Aviso3(TextoDoIntervaloDiferente);
                interaction.reply({ embeds: [AvisoIntervaloDiferente] });
              });
            } else {
              // Nenhuma ação é necessária, o CanalID e o Intervalo são iguais
              const TextoDoAtual = `O evento \`${info.PostNome}\` já está ativo neste canal e o intervalo de \`${info.Intervalo} minutos\` já é o intervalo atual. Use o comando em outro canal para trocar o evento de lugar ou escolha outro intervalo`;
              const AvisoAtual = Aviso(TextoDoAtual);
              interaction.reply({ embeds: [AvisoAtual], ephemeral: true });
            }

          } else {
            db.run("INSERT OR REPLACE INTO EventosPost (PostNome, CanalID, Status, ServidorID, ServidorNome, CanalNome, Intervalo) VALUES (?, ?, 'Habilitado', ?, ?, ?, ?)", info.PostNome, info.CanalID, info.ServidorID, info.ServidorNome, info.CanalNome, info.Intervalo, (err) => {
              if (err) {
                console.error("Erro ao ativar o canal:", err);
                interaction.reply({ embeds: [ErroAtivar], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
              } else {
                interaction.reply({ embeds: [AvisoAtivado] }).then((response) => { interaction.followUp({ embeds: [AvisoIntervaloN], ephemeral: true }); }).catch(console.error);
              }
              db.close();
            });
          }
        } else if (info.Status === "Desativar") {
          if (!row) {
            interaction.reply({ embeds: [AvisoJaOff], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
            db.close();
          } else if (row.Status === "Desabilitado") {
            interaction.reply({ embeds: [AvisoJaOff], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
            db.close();
          } else {
            db.run("UPDATE EventosPost SET Status = 'Desabilitado' WHERE ServidorID = ? ", info.ServidorID, (err) => {
              if (err) {
                console.error("Erro ao Desativar o canal:", err);
                interaction.reply({ embeds: [ErroDesativar], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
              } else {
                interaction.reply({ embeds: [AvisoDesativado] });
              }
              db.close();
            });
          }
        }
      }
    });
  },
};
