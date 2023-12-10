const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("../../estruturas/modulos.js");
const functions = require("../../estruturas/functions_import.js");

const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const ytdl = require('ytdl-core-discord');

// Estrutura para armazenar listas de reprodução por guild ID
const playlists = new Map();

module.exports = {
    name: 'tocar',
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
        let linkOuNome = await functions.capturarIDDoVideo(interaction.options.getString('link_ou_nome'));

        if (linkOuNome.tipo === "link") {
            await interaction.deferReply();
        } else {
            await interaction.deferReply({ ephemeral: true });
        }


        try {
            const query = linkOuNome.resultado

            //Verifica se a reposta é válida (Palavra-Chave ou link do Youtube)
            if (!linkOuNome.tipo) {
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

                //Verifica se o bot já está em um outro voip do servidor.
                if (!((await botDentroDoVoip).status)) {
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
            let videoLink;
            let videoPalavraChave;

            //Verifica se a resposta foi link. caso for busca apenas o resultado do link
            if (linkOuNome.tipo === "link") {
                videoLink = await functions.tratarInfosYoutube(videoResult.videos[0], interaction, voiceChannel);
                if (videoLink.id !== linkOuNome.resultado)
                    return interaction.followUp(`Nenhum resultado foi encontrado para o link: ${interaction.options.getString('link_ou_nome')}`);
            } else {
                videoPalavraChave = await procurarPorPalavra(interaction, videoResult, client, voiceChannel);
                if (videoPalavraChave === null) {
                    return interaction.editReply({ content: `Você demorou muito para responder. Use o comando novamente`, embeds: [], components: [], ephemeral: true });
                }
            }


            const video = videoLink || videoPalavraChave

            //Adiciona a música (vídeo) para playlist
            playlist.push(video);

            // Se não estiver reproduzindo, iniciar reprodução
            if (playlist.length === 1) {
                playMusic(voiceChannel, interaction, guildId);
            } else {
                const adicionaFila = new Discord.EmbedBuilder()
                    .setTitle('Adicionado à lista de reprodução:')
                    .setDescription(`[${video.titulo}](${video.url})`)
                    .setColor('#9370DB');

                interaction.followUp({ embeds: [adicionaFila] });
            }



        } catch (error) {
            if (error.message.includes('no query given')) {
                const resposta = interaction.options.getString('link_ou_nome')
                await interaction.followUp(`Você forneceu uma palavra ou link \`\`${resposta}\`\`  inválido verifique`);
            } else {
                await interaction.followUp('Ocorreu um erro ao reproduzir a música. error');
                console.log("Erro no comando de tocar", error)
            }
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
            .setDescription(`[${video.titulo}](${video.url})`)
            .setColor('#9370DB');

        interaction.followUp({ embeds: [embed] });
    } catch (error) {
        await interaction.followUp(`Ocorreu um erro ao reproduzir a música. \`\`${error}\`\``,);
        console.log(`Erro no comando de tocar ${error}`)
    }
}





async function procurarPorPalavra(interaction, videoResultados, client, voiceChannel) {
    return new Promise(async (resolve) => {
        const videoLista = videoResultados.videos.slice(0, 15);

        function truncate(str, maxLength) {
            if (str.length > maxLength) {
                return str.substring(0, maxLength - 3) + '...';
            } else {
                return str;
            }
        }

        const escolhas = videoLista.map((video, index) => ({
            label: `${index + 1}. ${truncate(video.title, 30 - (index + 1).toString().length)}`,
            value: index.toString(),
            description: video.title,
        }));

        const embedEscolha1 = new Discord.EmbedBuilder()
            .setTitle("Escolha sua música")
            .setColor(Bot.Cor)
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        const escolha15 = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder()
                .setCustomId('escolha15')
                .setPlaceholder('Escolha uma opção')
                .addOptions(escolhas)
        );

        interaction.followUp({ embeds: [embedEscolha1], components: [escolha15], ephemeral: true });

        // Aguardar a interação no escolha15
        const filter = i => i.customId === 'escolha15' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const escolhaMenu1 = i.values[0]
            const videoTratado = await functions.tratarInfosYoutube(videoLista[escolhaMenu1], interaction, voiceChannel);



            const embedEscolha1Resultado = new Discord.EmbedBuilder()
                .setTitle(`**Detalhes do Vídeo**`)
                .setColor(Bot.Cor)
                .setDescription(`**Título:** [${videoTratado.titulo}](${videoTratado.url})\n**Visualizações:** ${videoTratado.views}\n**Duração:** ${videoTratado.tempo}`)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            const menu2 = new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('menu2')
                    .setPlaceholder('Tem certeza?')
                    .addOptions([
                        {
                            label: 'Sim',
                            value: 'sim',
                        },
                        {
                            label: 'Não',
                            value: 'nao',
                        },
                    ])
            );

            await i.update({ embeds: [embedEscolha1Resultado], components: [menu2], ephemeral: true });

            // Aguardar a interação no menu2
            const filterMenu2 = j => j.customId === 'menu2' && j.user.id === interaction.user.id;
            const collectorMenu2 = interaction.channel.createMessageComponentCollector({ filter: filterMenu2, time: 60000 });

            collectorMenu2.on('collect', async j => {
                const escolhaMenu2 = j.values[0];

                // Verifica se a resposta do menu2 é 'Sim'
                if (escolhaMenu2 === 'sim') {
                    resolve(videoTratado);
                    collector.stop();
                    collectorMenu2.stop();
                    await interaction.editReply({ embeds: [embedEscolha1Resultado], components: [], ephemeral: true });
                } else {
                    // Permanece aguardando no escolha15
                    await j.update({ embeds: [embedEscolha1], components: [escolha15], ephemeral: true });
                }
            });

            collectorMenu2.on('end', collectedMenu2 => {
                if (collectedMenu2.size === 0) {
                    // Se o coletor do menu2 expirar, resolve com null ou outro valor desejado
                    resolve(null);
                }
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                // Se o coletor do escolha15 expirar, resolve com null ou outro valor desejado
                resolve(null);
            }
        });
    });
}
