const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");
const ytdl = require('ytdl-core-discord');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const yts = require('yt-search');


//Aviso já esta desbloqueado
const textoTempoExpirado = `❌ Tempo expirado use o comando novamente!`;
const avisoTempoExpirado = Aviso(textoTempoExpirado);

module.exports = {
  name: "play",
  description: "Reproduz música do YouTube.",
  type: 1,
  options: [
    {
      name: "link_ou_nome",
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
      const query = interaction.options.getString('link_ou_nome');

      

      // Não é um link do YouTube, faça a pesquisa
      const searchResults = await yts(query);

      if (!searchResults.videos || searchResults.videos.length === 0) {
        return interaction.reply({ content: "Não foram encontrados resultados para a sua busca.", ephemeral: true });
      }

      // Mostre os 10 primeiros resultados para o usuário escolher
      const videoList = searchResults.videos.slice(0, 15);

      function truncate(str, maxLength) {
        if (str.length > maxLength) {
          return str.substring(0, maxLength - 3) + '...';
        } else {
          return str;
        }
      }

      const choices = videoList.map((video, index) => ({
        label: `${index + 1}. ${truncate(video.title, 30 - (index + 1).toString().length)}`, // Função truncate para limitar o comprimento
        value: index.toString(),
        description: video.title,
      }));



      const selectMenu = new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('select')
          .setPlaceholder('Escolha uma música')
          .addOptions(choices)
      );

      const escolhaMusicaDaLista = new Discord.EmbedBuilder()
        .setTitle("**Escolha uma música**")
        .setColor(Bot.Cor)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() });

      
      interaction.reply({ embeds: [escolhaMusicaDaLista], components: [selectMenu], ephemeral: true });

      // Aguarde a resposta do usuário
      const filter = (interaction) => interaction.user.id === interaction.user.id && interaction.customId === 'select';
      const collected = await interaction.channel.awaitMessageComponent({ filter});

      console.log(filter)

      // Verifique se a escolha do usuário está dentro dos limites
      const choiceIndex = parseInt(collected.values[0]);


      const chosenVideo = videoList[choiceIndex];

      // Mostra um novo menu de seleção com informações detalhadas
      const videoDetailsMenu = new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('videoDetails')
          .setPlaceholder('Escolha uma opção')
          .addOptions([
            {
              label: `Reproduzir Música `,
              value: 'play',
            },
            {
              label: `Parar`,
              value: 'stop',
            },
          ])
      );

      //Tratar as visualizações
      function formatarNumeroComPontuacao(numero) {
        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      const viewsTratada = formatarNumeroComPontuacao(chosenVideo.views);

      //Pegar a tumbnall do vídeo
      let tumbnallDoVideo = chosenVideo.url;
      tumbnallDoVideo = tumbnallDoVideo.replace("https://youtube.com/watch?v=", "");
      tumbnallDoVideo = `https://img.youtube.com/vi/${tumbnallDoVideo}/maxresdefault.jpg`

      const detailsEmbed = new Discord.EmbedBuilder()
        .setTitle(`**Detalhes do Vídeo**`)
        .setColor(Bot.Cor)
        .setDescription(`**Título:** [${chosenVideo.title}](${chosenVideo.url})\n**Canal:** ${chosenVideo.author.name}\n**Visualizações:** ${viewsTratada}\n**Duração:** ${chosenVideo.timestamp}`)
        .setImage(tumbnallDoVideo)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

        
      interaction.editReply({ embeds: [detailsEmbed], components: [videoDetailsMenu], ephemeral: true });


      // Aguarde a resposta do usuário para o novo menu
      const detailsFilter = (interaction) => interaction.user.id === interaction.member.user.id && interaction.customId === 'videoDetails' && interaction.message.id === interaction.message.id;
      const detailsCollected = await interaction.channel.awaitMessageComponent({ filter: detailsFilter});
      // Processa a escolha do usuário no novo menu
      const detailsChoice = detailsCollected.values[0];
     if (detailsChoice === 'play') {
        // Lógica de reprodução de música
        const stream = await ytdl(chosenVideo.url, { quality: 'highestaudio', highWaterMark: 1 << 25 });
        const resource = createAudioResource(stream);

        const player = createAudioPlayer();
        player.play(resource);

        connection.subscribe(player);

        const nowPlayingEmbed = new Discord.EmbedBuilder()
          .setTitle(`**🎶 Comando Play 🎶**`)
          .setColor(Bot.Cor)
          .setDescription(`**🎵 Música em reprodução no canal de voz: <#${voiceChannel.id}>**\n\n[${chosenVideo.title}](${chosenVideo.url})`)
          .setImage(tumbnallDoVideo)
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTimestamp();

        interaction.followUp({ embeds: [nowPlayingEmbed], components: [] });
      } 
    } catch (error) {
      console.error(error);
      interaction.reply({ content: "Ocorreu um erro ao processar o comando.", ephemeral: true });
    }
  }
};
