
const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("../../estruturas/modulos.js");
const functions = require("../../estruturas/functions_import.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    name: 'musica_atual',
    description: 'Comando para pausar a música atual',
    type: 1,
    options: [
        {
            name: "tipo",
            description: "Escolha se deseja pausar ou retomar a música atual",
            type: 3,
            required: true,
            choices: [
                { name: "Pausar", value: "pausar" },
                { name: "Retomar", value: "retomar" },
                { name: "Remover", value: "remover" },
            ],
        },
    ],
    run: async (client, interaction) => {
        const { playlists } = require("./tocar.js")
        const tipo = interaction.options.getString('tipo');
        const voiceChannel = interaction.member.voice.channel;

        await interaction.deferReply({ ephemeral: true });


        if (!voiceChannel) {
            return interaction.followUp('Você precisa estar em um canal de voz para usar este comando.');
        }

        //Verifica se o bot já está em um outro voip do servidor.
        const mesmoVoipBot = functions.voipAtual(interaction, client, voiceChannel)
        if (mesmoVoipBot.status) {
            return interaction.followUp(`Você precisa estar no mesmo canal de voz para usar este comando`);
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const player = connection?.state?.subscription?.player;


        if (tipo === "pausar") {
            if (!player || player.state.status !== AudioPlayerStatus.Playing) {
                return interaction.followUp('Não estou reproduzindo música no momento.');
            }

            player.pause();
            interaction.followUp('Música pausada.');
        } else if (tipo === "retomar") {
            if (!player || player.state.status !== AudioPlayerStatus.Paused) {
                return interaction.followUp('Não há música pausada para retomar.');
            }

            player.unpause();
            interaction.followUp('Música retomada.');
        } else if (tipo === "remover") {

        }

    },
};
