const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const ffmpeg = require('ffmpeg-static');
//npm install libsodium-wrappers


module.exports = {
  name: "play",
  description: "Reproduz música do YouTube.",
  type: 1,

  run: async (client, interaction) => {
    // Seu código principal

    // Verifique se o usuário está em um canal de voz
    let voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ content: "Você precisa estar em um canal de voz para usar este comando!", ephemeral: true });
    }

    // Verifique se o bot tem permissão para se conectar ao canal de voz
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return interaction.reply({ content: "Eu não tenho permissão para entrar e falar no canal de voz.", ephemeral: true });
    }

    // Lógica de reprodução de música
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      const url = "https://youtu.be/qKvj12YTtI4"; // Substitua pelo URL do vídeo do YouTube

      const stream = ytdl(url, { filter: "audioonly" });
      const resource = createAudioResource(stream);

      const player = createAudioPlayer();
      player.play(resource);

      connection.subscribe(player);

      let embed = new Discord.EmbedBuilder()
        .setTitle(`**🎶 Comando Play 🎶**`)
        .setColor(Bot.Cor)
        .setDescription(`**🎵 Música em reprodução no canal de voz: ${voiceChannel.name}**`)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

      interaction.reply({ embeds: [embed] });
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      connection.destroy();
    });
  }
};
