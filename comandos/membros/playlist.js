const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("../../estruturas/modulos.js");
const functions = require("../../estruturas/functions_import.js");

module.exports = {
    name: 'playlist', // Nome do comando
    description: 'Mostra playlist de músicas atuais', // Descrição do comando
    type: 1,

    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });


        //Verifica se tem músicas no servidor

        if (!(await functions.manipularPlaylist(interaction, "verificar"))) {
            return interaction.followUp('Não músicas nesse servidor');
        } else {
            let tamanhoDaPlaylist = await functions.manipularPlaylist(interaction, "tamanho");
            tamanhoDaPlaylist = tamanhoDaPlaylist || 0
            if (tamanhoDaPlaylist === 0) {
                return interaction.followUp('Não músicas nesse servidor');
            }

        }

        //Pega a lista do servidor que o comando foi utilizado
        const playlistDoServidor = await functions.manipularPlaylist(interaction, "playlist");






        const batata = await playlistMenuSelect(interaction, playlistDoServidor, client);


    },
};




async function playlistMenuSelect(interaction, videoResultados, client) {
    return new Promise(async (resolve) => {

        const primeiroVideo = videoResultados[0];
        console.log(videoResultados)

        //Barra de Progresso
        function converterTempoYoutube(tempo) {
            const partesTempo = tempo.split(':').reverse();
            let milissegundos = 0;

            for (let i = 0; i < partesTempo.length; i++) {
                milissegundos += partesTempo[i] * Math.pow(60, i) * 1000;
            }

            return milissegundos;
        }

        const finalBarra = converterTempoYoutube(primeiroVideo.duration.timestamp);
        const inicioBarra = await functions.calculaHoraAtualVideo(interaction);
        const inicioBarra2 = finalBarra - converterTempoYoutube(inicioBarra);
        const barraDeProgresso = await functions.barraDeProgresso(inicioBarra2, finalBarra);

        const embedEscolha1 = new Discord.EmbedBuilder()
            .setTitle("🎶🎶 Lista de músicas 🎶🎶")
            .setColor(Bot.Cor)
            .setDescription(`**1º.[${primeiroVideo.titulo}](${primeiroVideo.url}) (música Ataul) \n \`\`\`${inicioBarra} ${barraDeProgresso} ${primeiroVideo.duration.timestamp}\`\`\`**`)
            .setThumbnail(primeiroVideo.thumb)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        let addFieldsQuantidade = 1
        for (const indice in videoResultados) {
            if (parseInt(indice) === 0) {
                continue;
            } else if (parseInt(indice) > 25) {
                break;
            }
            addFieldsQuantidade++
            const numeroDalista = parseInt(indice) + 1
            const videoIndice = videoResultados[indice]
            embedEscolha1.addFields({ name: `Título`, value: `**${numeroDalista}º.[${videoIndice.titulo}](${videoIndice.url})**`, inline: false });


        }


        const valorDoSelectMenu = addFieldsQuantidade <= 25 ? addFieldsQuantidade : 25
        const videoLista = videoResultados.slice(0, valorDoSelectMenu);



        const escolhas = videoLista.map((video, index) => ({
            label: `${index + 1}. ${truncate(video.titulo, 30 - (index + 1).toString().length)}`,
            value: index.toString(),
            description: video.titulo,
        }));

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
            const videoTratado = videoLista[escolhaMenu1]



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


        function truncate(str, maxLength) {
            if (str.length > maxLength) {
                return str.substring(0, maxLength - 3) + '...';
            } else {
                return str;
            }
        }


    });
}