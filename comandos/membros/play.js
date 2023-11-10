const { Discord, Bot } = require("../../estruturas/constantes.js");
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const yts = require('yt-search');

module.exports = {
  name: "play",
  description: "Reproduz música do YouTube.",
  type: 1,
  options: [
    {
      name: "query",
      description: "Insira uma palavra-chave ou link do YouTube.",
      type: 3,
      required: true,
    }
  ],

  run: async (client, interaction) => {
    try {
      // Verifique se o usuário está em um canal de voz
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        return interaction.reply({ content: "Você precisa estar em um canal de voz para usar este comando!", ephemeral: true });
      }

      // Verifique se o bot tem permissão para se conectar ao canal de voz
      const permissions = voiceChannel.permissionsFor(client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return interaction.reply({ content: "Eu não tenho permissão para entrar e falar no canal de voz.", ephemeral: true });
      }

      // Conecte-se ao canal de voz
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      // Lógica para verificar se é um link do YouTube
      const query = interaction.options.getString('query');
      const isYouTubeLink = ytdl.validateURL(query);

      if (isYouTubeLink) {
        // É um link do YouTube, reproduza diretamente
        const stream = ytdl(query, { filter: "audioonly" });
        const resource = createAudioResource(stream);

        const player = createAudioPlayer();
        player.play(resource);

        connection.subscribe(player);

        const nowPlayingEmbed = new Discord.EmbedBuilder()
          .setTitle(`**🎶 Comando Play 🎶**`)
          .setColor(Bot.Cor)
          .setDescription(`**🎵 Música em reprodução no canal de voz: ${voiceChannel.name}**`)
          .setTimestamp()
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

        return interaction.reply({ embeds: [nowPlayingEmbed] });
      }

      // Não é um link do YouTube, faça a pesquisa
      const searchResults = await yts(query);

      if (!searchResults.videos || searchResults.videos.length === 0) {
        return interaction.reply({ content: "Não foram encontrados resultados para a sua busca.", ephemeral: true });
      }

      // Mostre os 10 primeiros resultados para o usuário escolher
      const videoList = searchResults.videos.slice(0, 10);

      const choices = videoList.map((video, index) => ({
        label: `${index + 1}. ${video.title}`,
        value: index.toString(),
        description: video.title,
      }));

      const selectMenu = new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Escolha uma música')
          .addOptions(choices)
      );

      const embed = new Discord.EmbedBuilder()
        .setTitle("**Escolha uma música**")
        .setColor(Bot.Cor)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

      interaction.reply({ embeds: [embed], components: [selectMenu], ephemeral: true });

      // Aguarde a resposta do usuário
      const filter = (interaction) => interaction.user.id === interaction.user.id && interaction.customId === 'select';
      const collected = await interaction.channel.awaitMessageComponent({ filter, time: 30000 });

      // Verifique se a escolha do usuário está dentro dos limites
      const choiceIndex = parseInt(collected.values[0]);
      if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= videoList.length) {
        return interaction.followUp({ content: "Escolha inválida. Por favor, tente novamente.", ephemeral: true });
      }

      const chosenVideo = videoList[choiceIndex];

      // Lógica de reprodução de música
      const stream = ytdl(chosenVideo.url, { filter: "audioonly" });
      const resource = createAudioResource(stream);

      const player = createAudioPlayer();
      player.play(resource);

      connection.subscribe(player);

      const nowPlayingEmbed = new Discord.EmbedBuilder()
        .setTitle(`**🎶 Comando Play 🎶**`)
        .setColor(Bot.Cor)
        .setDescription(`**🎵 Música em reprodução no canal de voz: ${voiceChannel.name}**\n\n${chosenVideo.title}\n${chosenVideo.url}`)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

      interaction.followUp({ embeds: [nowPlayingEmbed], components: [] });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: "Ocorreu um erro ao processar o comando.", ephemeral: true });
    }
  }
};
