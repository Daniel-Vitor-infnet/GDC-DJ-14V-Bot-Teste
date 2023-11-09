const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


module.exports = {
  name: "ping", // Coloque o nome do comando
  description: "Veja o ping do bot.", // Coloque a descrição do comando
  type: 1,

  run: async (client, interaction) => {

    // Meu código principal

    let ping = client.ws.ping;

    let embed_1 = new Discord.EmbedBuilder()
      .setTitle(`**📡 Ping Carregando📡**`)
      .setColor(Bot.Cor)
      .setThumbnail(Gif.SateliteCarregando)
      .setDescription(`**\n🛰️ Olá ${interaction.user}, estou carregando meus dados \`calculando...\`.**\n`)
      .setTimestamp()
      .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })



    let embed_2 = new Discord.EmbedBuilder()
      .setTitle(`**📡 Ping 📡**`)
      .setColor(Bot.Cor)
      .setThumbnail(Gif.SatelitePronto)
      .setDescription(`**\n🛰️ Olá ${interaction.user}, meu ping está em \`\`${ping}ms\`\`.**\n`)
      .setTimestamp()
      .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })



    interaction.reply({ embeds: [embed_1] }).then(() => {
      setTimeout(() => {
        interaction.editReply({ embeds: [embed_2] })
      }, 7000)
    })
  }
}


