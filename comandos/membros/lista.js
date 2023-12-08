const { Discord, sqlite3, Cor, Bot, Midia, GDC } = require("../../estruturas/modulos.js");
const functions = require("../../estruturas/functions_import.js");

module.exports = {
    name: 'lista', // Nome do comando
    description: 'Mostra lista de músicas atuais', // Descrição do comando
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
        const { playlists } = require("../membros/");

        // Agora você pode acessar e modificar playlists normalmente neste arquivo
        // Exemplo:
        const guildId = interaction.guild.id;

        if (playlists.has(guildId)) {
            const playlistDoServidor = playlists.get(guildId);
            // Faça o que for necessário com a lista de reprodução
        }




    },
};
