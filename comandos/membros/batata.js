const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core-discord');

// Estrutura para armazenar a lista de reprodução
const playlist = [];

module.exports = {
    name: 'batata',
    description: 'Comando para tocar música',
    type: 1,
    options: [
        {
            name: 'query',
            description: 'Nome ou URL da música a ser reproduzida',
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();



        try {
            const query = interaction.options.getString('query');
            const voiceChannel = interaction.member.voice.channel;

            if (!voiceChannel) {
                return interaction.followUp('Você precisa estar em um canal de voz para usar este comando.');
            }

            // Adicionar música à lista de reprodução
            const videoResult = await ytSearch(query);
            const video = videoResult.videos[0];
            playlist.push(video);

            // Se não estiver reproduzindo, iniciar reprodução
            if (playlist.length === 1) {
                playMusic(voiceChannel, interaction);
            }

            // Responder ao usuário
            const embed = new Discord.EmbedBuilder()
                .setTitle('Adicionado à lista de reprodução:')
                .setDescription(`[${video.title}](${video.url})`)
                .setColor('#9370DB');


            interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.followUp('Ocorreu um erro ao executar o comando.');
        }
    },
};

// Função para reproduzir música da lista de reprodução
async function playMusic(voiceChannel, interaction) {
    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);


        player.on('stateChange', (oldState, newState) => {
            if (oldState.status !== newState.status && newState.status === 'idle') {
                // Remover música da lista de reprodução após terminar de reproduzir
                playlist.shift();

                // Reproduzir a próxima música, se houver
                playMusic(voiceChannel, interaction);
            }
        });

        const video = playlist[0];

        if (!video) {
            // Se não houver mais músicas na lista, sair do canal de voz
            return voiceChannel.leave();
        }

        const stream = await ytdl(video.url, { quality: 'highestaudio', highWaterMark: 1 << 25 });
        const resource = createAudioResource(stream, { inputType: 'opus' });

        player.play(resource);

        // Aguardar a promessa retornada por player.play para determinar quando a música terminou
        await new Promise(resolve => {
            player.once('idle', resolve);
        });

        // Após a música terminar, a próxima música será reproduzida pela chamada recursiva
        const embed = new Discord.EmbedBuilder()
            .setTitle('Reproduzindo agora:')
            .setDescription(`[${video.title}](${video.url})`)
            .setColor('#9370DB');

        interaction.followUp({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        await interaction.followUp('Ocorreu um erro ao reproduzir a música.');
    }
}
