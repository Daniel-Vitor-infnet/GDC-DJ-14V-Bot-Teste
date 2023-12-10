const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("../../estruturas/modulos.js");
const functions = require("../../estruturas/functions_import.js");

module.exports = {
    name: 'playlist', // Nome do comando
    description: 'Mostra playlist de músicas atuais', // Descrição do comando
    type: 1,

    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const guildId = interaction.guildId

        //Pega a lista do servidor que o comando foi utilizado
        const playlistDoServidor = await functions.playlistsDoServidor(interaction, guildId);

        if (!playlistDoServidor) {
            return interaction.followUp('Não músicas nesse servidor');
        }


        const batata = await playlistMenuSelect(interaction, playlistDoServidor, client);

        functions.consoleCompleto(batata, "verde");

    },
};




async function playlistMenuSelect(interaction, videoResultados, client) {
    return new Promise(async (resolve) => {
        const valorDoSelectMenu = videoResultados.length <= 25 ? videoResultados.length : 25
        const videoLista = videoResultados.slice(0, valorDoSelectMenu);

        function truncate(str, maxLength) {
            if (str.length > maxLength) {
                return str.substring(0, maxLength - 3) + '...';
            } else {
                return str;
            }
        }

        const escolhas = videoLista.map((video, index) => ({
            label: `${index + 1}. ${truncate(video.titulo, 30 - (index + 1).toString().length)}`,
            value: index.toString(),
            description: video.titulo,
        }));

        const primeiroVideo = videoResultados[0];

        const embedEscolha1 = new Discord.EmbedBuilder()
            .setTitle("🎶🎶 Lista de músicas 🎶🎶")
            .setColor(Bot.Cor)
            .setDescription(`**1º.[${primeiroVideo.titulo}](${primeiroVideo.url}) (música Ataul) \n Duração \`\`${primeiroVideo.duration.timestamp}\`\` \n Tempo Restante \`\`${await functions.calculaHoraAtualVideo(interaction)}\`\`**`)
            .setThumbnail(primeiroVideo.thumb)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        let totalCaracteres = 0;
        for (const indice in videoResultados) {
            if (parseInt(indice) === 0){
                continue;
            }
            const numeroDalista = parseInt(indice) + 1
            const videoIndice = videoResultados[indice]

            const field1 = { name: `Título`, value: `**${numeroDalista}º.[${videoIndice.titulo}](${videoIndice.url})**`, inline: true };
            const field2 = { name: `Duração`, value: `\`\`${videoIndice.tempo}\`\``, inline: true };
            const field3 = { name: `Solicitado Por:`, value: `<@${videoIndice.solocitadoPor.membro.id}>`, inline: true };
            const fields = [field1, field2, field3];
            const fieldLength = JSON.stringify(fields).length;

            // Verifica se adicionar o próximo campo ultrapassa o limite
            if (totalCaracteres + fieldLength <= 1_500) {
                embedEscolha1.addFields(fields);
                totalCaracteres += fieldLength;
            } else {
                embedEscolha1.setDescription(`\`\`\`diff\n- Infelizmente não posso exibir todas músicas por limitações do Discord\`\`\``);
                break;
            }

        }

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
    });
}