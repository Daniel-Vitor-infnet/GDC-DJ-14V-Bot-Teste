const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");
const moment = require('moment-timezone');
moment.locale('pt-BR');
let data = moment().tz("America/Sao_Paulo").format('L');


module.exports = {
  name: "ban",
  description: "Banir membros pelo ID",
  options: [
    {
      name: 'user',
      description: 'Digite o ID do membro que deseja banir',
      type: 3,
      required: true,
    },
    {
      name: 'motivo',
      description: 'Diga qual motivo vai banir o membro',
      type: 3,
      required: true,
    }
  ],

  run: async (client, interaction, args) => {
    const userId = interaction.options.getString('user');
    const motivo = interaction.options.getString('motivo')
    const membro = interaction.guild.members.cache.get(userId);
    const member = interaction.guild.members.cache.get(userId);

    //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

    //Permissões
    const TextoDePermissao = `\`\`\`md\n# Você não possui permissão de Administrador ou Banir membros. \`\`\``;
    const PermissaoEmbed = Permissao(TextoDePermissao);

    //Erro ID
    const TextoDeID = `O membro com o ID fornecido não foi encontrado. Certifique-se de fornecer um ID de membro válido.\n\n vídeo de como pegar Id de membros: https://youtu.be/ZR0rYHvST30`;
    const ErroID = Erro(TextoDeID);

    //Erro Banir
    const TextoDeBanir = `Não foi possível banir o usuário.`;
    const ErroBanir = Erro(TextoDeBanir);

    //Erro Aviso já banido
    const TextoDeJaban = `Este membro já foi banido.`;
    const AvisoJaban = Aviso(TextoDeJaban);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!(interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator) || interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers))) {
      return interaction.reply({ embeds: [PermissaoEmbed], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }

    // Verificar se o ID fornecido é uma sequência numérica válida
    if (!/^\d{17,19}$/.test(userId)) {
      return interaction.reply({ embeds: [ErroID], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }

    // Tentar buscar o usuário
    let user;
    try {
      user = await client.users.fetch(userId, false);
    } catch (error) {
      // Tratar o erro
      return interaction.reply({ embeds: [ErroID], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }

    // Verificar se o usuário existe
    if (!user) {
      return interaction.reply({ embeds: [ErroID], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }


    // Verificar se o usuário já está na lista de banidos
    const bans = await interaction.guild.bans.fetch();
    if (bans.some(ban => ban.user.id === userId)) {
      return interaction.reply({ embeds: [AvisoJaban], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }

    if (member) {
      const banCanal = new Discord.EmbedBuilder()
        .setTitle('🔨 Banimento 🔨')
        .setColor(Bot.Cor)
        .setImage(Gif.Ban)
        .setTimestamp()
        .setThumbnail(member.displayAvatarURL())
        .setDescription(`**\n👨🏻‍⚖️ ${interaction.user}, Baniu:**`)
        .addFields(
          { name: '**\n🤵🏻 Membro**', value: membro.user },
          { name: '#️⃣ Tag', value: `**\`${membro.user.tag}\`**`, inline: true },
          { name: '🆔 ID', value: `**\`${membro.user.id}\`**`, inline: true },
          { name: '🛂 Motivo', value: `**\`${motivo}\`**` },
          { name: '🚶🏻 Foi Banido Em:', value: `**\`${data}\`**` }
        )

      interaction.reply({ embeds: [banCanal] })

      //Embed no privado
      const BanPV = new Discord.EmbedBuilder()
        .setTitle('🔨 Você está banido!')
        .setThumbnail(Gif.BanPv)
        .setDescription(`**🔨 Banido Por: ${interaction.user} \n🔨 Do Servidor: \`${interaction.guild.name}\` \n🔨 Motivo: \`${motivo}\` \n🔨 Data: \`${data}\` \`\`\`diff\n- ⚠️ Caso Volte Ao Servidor com outra conta será banido novamente\`\`\`  **`)
        .setColor(Bot.Cor)
        .setTimestamp()
        .setImage(Gif.Vergonha);
      membro.send({ embeds: [BanPV] });
      return await interaction.guild.bans.create(userId);
    }


    // Banir o usuário pelo ID
    try {
      await interaction.guild.bans.create(userId);
      return interaction.reply(`O usuário com ID ${userId} foi banido com sucesso.`);
    } catch (error) {
      console.error(error);
      return interaction.reply({ embeds: [ErroBanir], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
    }
  },
};