const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("../../estruturas/modulos.js");
const functions = require("../../estruturas/functions_import.js");

module.exports = {
    name: 'playlist', // Nome do comando
    description: 'Mostra playlist de músicas atuais', // Descrição do comando
    type: 1,
    options: [
        {
            name: "membro",
            description: "Mencione um membro para ver suas informações.",
            type: 6,
            required: false,
        }
    ],
    run: async (client, interaction) => {

        // Aqui estamos importando a variável playlists do arquivo comandoBatata.js
        const { playlists } = require("./tocar.js")

        // Agora você pode acessar e modificar playlists normalmente neste arquivo
        // Exemplo:
        const guildId = interaction.guild.id;

        if (!playlists.has(guildId)) {
            return console.log("não tem")
        }

        //Pega a lista do servidor que o comando foi utilizado
        const playlistDoServidor = playlists.get(guildId);

        const primeiroVideo = playlistDoServidor[0]

        


    },
};
