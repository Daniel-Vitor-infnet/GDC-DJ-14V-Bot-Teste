const Discord = require("discord.js")
const Cor = require("../cores");
const Bot = require("../botinfo.js");
const Gif = require("../midia/gifs.js");




module.exports = {

  Aviso: function (infoModificada) {
    const Aviso = new Discord.EmbedBuilder()
      .setColor(Cor.Aviso)
      .setAuthor({ name: 'Aviso', iconURL: Gif.MiniGifAviso })
      .setDescription(`**\n${infoModificada}** \n\`\`\`diff\n- Essa message será deletada em 2 minutos\`\`\``)
      .setThumbnail(Gif.Aviso)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return Aviso;
  },

  Erro: function (infoModificada) {
    const Erro = new Discord.EmbedBuilder()
      .setColor(Cor.Erro)
      .setAuthor({ name: 'Erro', iconURL: Gif.MiniGifErro })
      .setDescription(`**\n${infoModificada}** \n\`\`\`diff\n- Essa message será deletada em 2 minutos\`\`\``)
      .setThumbnail(Gif.Erro)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return Erro;
  },

  Permissao: function (infoModificada) {
    infoModificada = infoModificada === undefined ? "." : ` ou ${infoModificada}`
    const Permissao = new Discord.EmbedBuilder()
      .setColor(Cor.Permissao)
      .setAuthor({ name: 'Permissão', iconURL: Gif.MiniGifPermissao })
      .setDescription(`**\`\`\`md\n# Você não possui permissão de Administrador${infoModificada} \`\`\`** \n\`\`\`diff\n- Essa message será deletada em 2 min\`\`\``)
      .setThumbnail(Gif.Permissao)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return Permissao;
  },

  PermissaoDono: function (infoModificada1, infoModificada2) {
    const Permissao = new Discord.EmbedBuilder()
      .setColor(Cor.Permissao)
      .setAuthor({ name: 'Permissão', iconURL: Gif.MiniGifPermissao })
      .setDescription(`**Somente o dono do servidor <@${infoModificada1}> pode usar o comando \`\`${infoModificada2}\`\`  ** \n\`\`\`diff\n- Essa message será deletada em 2 min\`\`\``)
      .setThumbnail(Gif.Permissao)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return Permissao;
  },

  /////////////////////////////////////////////desaparecerá automaticamente 

  Aviso2: function (infoModificada) {
    const Aviso2 = new Discord.EmbedBuilder()
      .setColor(Cor.Aviso)
      .setAuthor({ name: 'Aviso', iconURL: Gif.MiniGifAviso })
      .setDescription(`**\n${infoModificada}** \`\`\`diff\n- Está mensagem desaparecerá automaticamente após o reinício do Discord ou clique em "Ignorar mensagem".\`\`\``)
      .setThumbnail(Gif.Aviso)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return Aviso2;
  },


  /////////////////////////////////////////////Não apaga automaticamente

  PermissaoNoob: function () {
    const PermissaoNoob = new Discord.EmbedBuilder()
      .setColor(Cor.Permissao)
      .setAuthor({ name: 'Permissão Criado', iconURL: Gif.MiniGifPermissaoDono })
      .setDescription(`**\nSomente meu criador <@!${Bot.NoobSupremo}> pode usar esse comando !!! \n**`)
      .setImage(Gif.PermissaoNoob)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return PermissaoNoob;
  },

  BloqueadoComando: function (interaction) {
    const BloqueadoComando = new Discord.EmbedBuilder()
      .setColor(Cor.Permissao)
      .setAuthor({ name: 'Comando Bloqueado', iconURL: Gif.MiniGifAviso })
      .setDescription(`** O comando \`\`/${interaction.commandName}\`\` foi bloqueado neste servidor pelo dono <@${interaction.guild.ownerId}>. Qualquer dúvida entre em contato com a STAFF **`)
      .setThumbnail(Gif.ComandoBloqueado)
      .setFooter({ text: `Para mais dúvidas digite /ajuda`, iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return BloqueadoComando;
  },

  BloqueadoComandoPadrao: function (interaction) {
    const BloqueadoComandoPadrao = new Discord.EmbedBuilder()
      .setColor(Cor.Permissao)
      .setAuthor({ name: 'Comando Bloqueado', iconURL: Gif.MiniGifAviso })
      .setDescription(`** O comando \`\`/${interaction.commandName}\`\` é bloqueado por padrão será necessário que o dono <@${interaction.guild.ownerId}> desbloqueio. **`)
      .setThumbnail(Gif.ComandoBloqueado)
      .setFooter({ text: `Para mais dúvidas digite /ajuda`, iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return BloqueadoComandoPadrao;
  },

  subComandoBloqueado: function (interaction, subComando) {
    const subComandoBloqueado = new Discord.EmbedBuilder()
      .setColor(Cor.Permissao)
      .setAuthor({ name: 'SubComando Bloqueado', iconURL: Gif.MiniGifAviso })
      .setDescription(`**O subcomando \`\`${subComando}\`\` do comando \`\`/${interaction.commandName}\`\` foi bloqueado neste servidor pelo dono <@${interaction.guild.ownerId}>. Qualquer dúvida entre em contato com a STAFF.\n\nLembrando que apenas um subcomando está bloqueado; os demais podem estar funcionando. Para ver comandos bloqueados use \`\`/lista\`\`.**`)
      .setThumbnail(Gif.ComandoBloqueado)
      .setFooter({ text: `Para mais dúvidas digite /ajuda`, iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return subComandoBloqueado;
  },

  Aviso3: function (infoModificada) {
    const Aviso3 = new Discord.EmbedBuilder()
      .setColor(Cor.Aviso)
      .setAuthor({ name: 'Aviso', iconURL: Gif.MiniGifAviso })
      .setDescription(`**\n${infoModificada}\n\n**`)
      .setThumbnail(Gif.Aviso)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return Aviso3;
  },

}


