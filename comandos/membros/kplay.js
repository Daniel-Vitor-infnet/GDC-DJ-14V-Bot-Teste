const { Discord, Cor, Bot } = require("../../estruturas/constantes.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');
const yts = require('yt-search');

const fila = [];

module.exports = {
  name: "kplay",
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
    // Obtém a palavra-chave ou link do YouTube
    const query = interaction.options.getString('link_ou_nome');

    // Usa a API "yt-search" para obter os resultados
    const searchResults = await yts(query);

    // Obtém os 15 primeiros resultados
    const videos = searchResults.videos.slice(0, 15);

    function truncate(str, maxLength) {
        if (str.length > maxLength) {
          return str.substring(0, maxLength - 3) + '...';
        } else {
          return str;
        }
      }


    // Cria as opções para o menu de seleção
    const options = videos.map((video, index) => ({
        label: `${index + 1}. ${truncate(video.title, 30 - (index + 1).toString().length)}`, // Função truncate para limitar o comprimento
      value: index.toString(),
    }));

    // Cria o menu de seleção
    const row = new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
        .setCustomId('select')
        .setPlaceholder('Escolha uma música...')
        .addOptions(options)
    );

    // Envia a mensagem com o menu de seleção
    await interaction.reply({
      content: 'Escolha uma música:',
      components: [row],
    });

    // Aguarda a interação do usuário no menu de seleção
  const filter = (menuInteraction) =>
  menuInteraction.customId === 'select' && menuInteraction.user.id === interaction.user.id;

const collector = interaction.channel.createMessageComponentCollector({
  filter,
  time: 15000, // Tempo em milissegundos para aguardar a interação
});

collector.on('collect', async (menuInteraction) => {
  // Obtém o índice da música escolhida pelo usuário
  const index = parseInt(menuInteraction.values[0]);

  // Obtém a música escolhida
  const chosenVideo = videos[index];

  // Adiciona a música à fila de reprodução
  fila.push(chosenVideo);

  // Responde à interação, deferindo se necessário
  if (!menuInteraction.deferred && !menuInteraction.replied) {
    await menuInteraction.deferReply();
    await menuInteraction.editReply(`Música adicionada à fila: ${chosenVideo.title}`);
  } else {
    await menuInteraction.editReply(`Música adicionada à fila: ${chosenVideo.title}`);
  }

  // Se a fila estiver vazia, inicia a reprodução
  if (fila.length === 1) {
    // Reproduza o vídeo escolhido
    const connection = joinVoiceChannel({
      channelId: menuInteraction.member.voice.channel.id,
      guildId: menuInteraction.guild.id,
      adapterCreator: menuInteraction.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(await ytdl(chosenVideo.url));

    player.play(resource);
    connection.subscribe(player);
  }

  // Encerra o coletor
  collector.stop();
});

collector.on('end', () => {
  // Remove o menu de seleção após o tempo de espera
  const rowEnd = new Discord.ActionRowBuilder().addComponents(
    new Discord.StringSelectMenuBuilder().setCustomId('select').setDisabled(true)
  );

  interaction.editReply({ components: [rowEnd] });
});

}};