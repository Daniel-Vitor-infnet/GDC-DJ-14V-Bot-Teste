const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core-discord');

// Estrutura para armazenar listas de reprodução por guild ID
const playlists = new Map();

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
            const guildId = interaction.guild.id;

            // Verificar se existe uma lista de reprodução para o servidor
            if (!playlists.has(guildId)) {
                playlists.set(guildId, []);
            }

            const playlist = playlists.get(guildId);

            if (!voiceChannel) {
                return interaction.followUp('Você precisa estar em um canal de voz para usar este comando.');
            }

            // Adicionar música à lista de reprodução
            const videoResult = await ytSearch(query);
            const video = videoResult.videos[0];
            playlist.push(video);

            // Se não estiver reproduzindo, iniciar reprodução
            if (playlist.length === 1) {
                playMusic(voiceChannel, interaction, guildId);
            }

            // Responder ao usuário
            const embed = new Discord.EmbedBuilder()
                .setTitle('Adicionado à lista de reprodução:')
                .setDescription(`[${video.title}](${video.url})`)
                .setColor('#9370DB');

            if (playlist.length > 1) {
                interaction.followUp({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.followUp('Ocorreu um erro ao executar o comando.');
        }
    },
};

// Função para reproduzir música da lista de reprodução
async function playMusic(voiceChannel, interaction, guildId) {
    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const playlist = playlists.get(guildId);
        const video = playlist[0];

        const stream = await ytdl(video.url, { quality: 'highestaudio', highWaterMark: 1 << 25 });
        const resource = createAudioResource(stream, { inputType: 'opus' });
        const player = createAudioPlayer();

        connection.subscribe(player);
        player.play(resource);

        player.on('stateChange', (oldState, newState) => {
            if (oldState.status !== newState.status && newState.status === 'idle') {
                // Remover música da lista de reprodução após terminar de reproduzir
                playlist.shift();
                const membrosAtuisDoCanal = voiceChannel.members.size || 0;

                if (membrosAtuisDoCanal <= 1) {
                    setTimeout(() => {
                        if (membrosAtuisDoCanal <= 1) {
                            if (playlists.has(guildId)) {
                                playlists.delete(guildId);
                            }
                            if (connection.state.status === VoiceConnectionStatus.Ready) {
                                connection.destroy(); // Se n tiver ninguém na call sair 
                            }
                            if (interaction) {
                                return;
                            }
                        }
                    }, 180_000); // 5 min
                }

                if (playlist.length > 0) {
                    playMusic(voiceChannel, interaction, guildId);
                } else {
                    if (playlist.length === 0) {
                        setTimeout(() => {
                            if (playlist.length === 0) {
                                if (playlists.has(guildId)) {
                                    playlists.delete(guildId);
                                }
                                if (connection.state.status === VoiceConnectionStatus.Ready) {
                                    connection.destroy(); // Se n tiver ninguém na call sair 
                                }
                                if (interaction) {
                                    return;
                                }
                            }
                        }, 300_000); // 5 min
                    }
                }
            }
        });

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
