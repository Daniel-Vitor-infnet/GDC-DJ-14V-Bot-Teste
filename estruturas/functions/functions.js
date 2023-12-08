const Discord = require("discord.js")
const Cor = require("../cores");
const Bot = require("../botinfo.js");
const Gif = require("../midia/gifs.js");
const sqlite3 = require("sqlite3").verbose();
const {
  Aviso,
  Aviso2,
  Aviso3,
  Permissao,
  PermissaoNoob,
  PermissaoDono,
  Erro,
  BloqueadoComando,
  BloqueadoComandoPadrao,
} = require("./embedPersonalizados");




module.exports = {



  // Função para notificar o desenvolvedor por mensagem direta (DM)
  voipAtual: async function (interaction, client, voipSolicitado) {

    let status = false;
    let canal = '';

    // Obtenha o estado de voz do bot no servidor
    const guild = client.guilds.cache.get(interaction.guildId);

    const botMember = guild.members.cache.get(client.user.id);

    const voiceState = botMember.voice;


    // Verifica se o bot está em algum canal de voz
    if (voiceState && voiceState.channel) {
      if (voiceState.guild.id === voipSolicitado.guild.id) {
        if (voiceState.channel.id !== voipSolicitado.id)
          status = true;
        canal = `<#${voipSolicitado.id}>`
      }
    }
    return { status, canal };

  },








}


