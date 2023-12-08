const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("../../estruturas/modulos.js");
const functions = require("../../estruturas/functions_import.js");

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
            name: 'link_ou_nome',
            description: 'Nome ou URL da música de escolha',
            type: 3,
            required: true,
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();

        try {
            const query = functions.capturarIDDoVideo(interaction.options.getString('link_ou_nome'));

            //Verifica se a reposta é válida (Palavra-Chave ou link do Youtube)
            if (query) {
                return interaction.followUp('Infelizmente no momento aceito apenas links do Youtube ou pesquisa por palavras chaves');
            }


            const voiceChannel = interaction.member.voice.channel;
            const guildId = interaction.guild.id;

            // Verificar se existe uma lista de reprodução para o servidor
            if (!playlists.has(guildId)) {
                playlists.set(guildId, []);
            }

            const playlist = playlists.get(guildId);


            //Verifica se o membro esta em canal de voip
            if (!voiceChannel) {
                return interaction.followUp('Você precisa estar em um canal de voz para usar este comando.');
            } else if (playlist.length > 0) { // Verifica se o bot já esta em um voip do servidor
                const botDentroDoVoip = functions.voipAtual(interaction, client, voiceChannel)

                //Verifica se o bot já está em um voip do servidor.
                if ((await botDentroDoVoip).status) {
                    return interaction.followUp(`O bot já esta no voip ${(await botDentroDoVoip).canal}. Só é permito um voip por servidor, caso queira mover o bot precisa remover ele da call use \`\`/sair\`\` para tirar o bot`);
                }
            }

            // Verifique se o bot tem permissão para se conectar ao canal de voz
            const permissions = voiceChannel.permissionsFor(client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return interaction.followUp("Eu não tenho permissão para entrar e falar no canal de voz.");
            }


            // Adicionar música à lista de reprodução
            const videoResult = await ytSearch(query);
            const videoSemtratar = videoResult.videos[0];
            const video = await tratarInfosYoutube(videoSemtratar)

            //Adiciona a música (vídeo) para playlist
            playlist.push(video);

            // Se não estiver reproduzindo, iniciar reprodução
            if (playlist.length === 1) {
                playMusic(voiceChannel, interaction, guildId);
            } else {
                const adicionaFila = new Discord.EmbedBuilder()
                    .setTitle('Adicionado à lista de reprodução:')
                    .setDescription(`[${video.title}](${video.url})`)
                    .setColor('#9370DB');

                interaction.followUp({ embeds: [adicionaFila] });
            }



        } catch (error) {
            console.log(error);
            await interaction.followUp('Ocorreu um erro ao executar o comando.');
        }
    },
    playlists,
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
                const playListAtual = playlist.length || 0;

                if (membrosAtuisDoCanal <= 1 || playListAtual === 0) {
                    setTimeout(() => {
                        if (membrosAtuisDoCanal <= 1 || playListAtual === 0) {
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
                } else {
                    playMusic(voiceChannel, interaction, guildId);
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



async function tratarInfosYoutube(video) {

    const thumbDoVideoMax = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`

    const videosTratados = {
        type: 'video',
        title: video.title || "O título possui caracteres, símbolos ou emojis que não posso reproduzir.",
        description: video.description || "Indisponível",
        url: video.url || "Indisponível",
        id: video.videoId || "Indisponível",
        seconds: video.seconds || "Indisponível",
        tempo: video.timestamp || "Indisponível",
        duration: video.duration || "Indisponível",
        views: video.views ? video.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Indisponível",
        ago: video.ago ? await functions.converterDataParaPortugues(video.ago) : "Indisponível",
        imagem: video.image ? thumbDoVideoMax : Midia.Gif.VideoSemImagem,
        thumb: video.thumbnail ? thumbDoVideoMax : Midia.Gif.VideoSemImagem,
        author: video.author || "Indisponível",
    };




    return videosTratados
}