const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


module.exports = {
    name: "lista",
    description: "Todas listas disponíveis",
    type: 1,
    options: [
        {
            name: "tipo",
            description: "Escolha 'Bloquear' para ativar o canal ou 'Desbloquear' para desativá-lo",
            type: 3,
            required: true,
            choices: [
                { name: "Comandos Bloqueados", value: "cmd_bloqueados" },
                { name: "Eventos", value: "eventos" },
                { name: "Chats Bloqueados", value: "chat_bloqueados" },
                { name: "Servidores que estou", value: "servidores" },
            ],
        },
    ],

    run: async (client, interaction) => {

        const tipo = interaction.options.get("tipo").value;


        if (tipo === "cmd_bloqueados") {
            //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

            //Aviso nenhum bloqueado
            const TextoDoNenhum = `Nenhum comando está bloqueado em nenhum servidor.`;
            const AvisoNenhum = Aviso(TextoDoNenhum);

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            const db = new sqlite3.Database("database_sqlite.db");
            const serverID = interaction.guildId;

            db.all("SELECT Comandos, ServidorID FROM StatusComandos WHERE Status = 'Desabilitado' AND ServidorID = ?", [serverID], (err, rows) => {
                if (err) {
                    interaction.reply({ content: "Ocorreu um erro ao listar comandos bloqueados.", ephemeral: true });
                } else if (rows.length > 0) {
                    const StatusComandosByServer = rows.reduce((acc, row) => {
                        const ServidorNome = client.guilds.cache.get(row.ServidorID)?.name || "Desconhecido";
                        if (!acc[ServidorNome]) {
                            acc[ServidorNome] = [];
                        }
                        acc[ServidorNome].push(row.Comandos);
                        return acc;
                    }, {});

                    const StatusComandosTable = new Discord.EmbedBuilder()
                        .setTitle("Comandos Bloqueados\n")
                        .setColor(Bot.Cor)
                        .setImage(Gif.Block);

                    for (const ServidorNome in StatusComandosByServer) {
                        const server = client.guilds.cache.find((guild) => guild.name === ServidorNome);
                        const ServidorID = server ? server.id : "Desconhecido";

                        const formattedServerName = `📑 ${ServidorNome}    🆔:  \`${ServidorID}\``;

                        const StatusComandos = StatusComandosByServer[ServidorNome].map(Comandos => `\`${Comandos}\``).join("\n") + "**\n\n**";
                        StatusComandosTable.addFields({ name: formattedServerName, value: `**\nComandos:**\n${StatusComandos}` });
                    }
                    interaction.reply({ embeds: [StatusComandosTable] });
                } else {
                    interaction.reply({ embeds: [AvisoNenhum], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
                }
            });

            db.close();
        } else if (tipo === "eventos") {

        } else if (tipo === "chat_bloqueados") {
            //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////

            //Aviso nenhum bloqueado
            const TextoDoNenhum = `Não há canais bloqueados no servidor.`;
            const AvisoNenhum = Aviso(TextoDoNenhum);

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            const guild = interaction.guild;
            const blockedChannels = [];

            // Itera por todos os canais do servidor
            guild.channels.cache.forEach((channel) => {
                const permissions = channel.permissionsFor(guild.id);

                if (!permissions.has(Discord.PermissionFlagsBits.SendMessages)) {
                    // Se o canal não permite enviar mensagens, adiciona-o à lista de canais bloqueados
                    blockedChannels.push(`\n<#${channel.id}>`);
                }
            });

            if (blockedChannels.length > 0) {
                const chatsBloqueados = new Discord.EmbedBuilder()
                    .setTitle("Canais bloqueados no servidor: \n")
                    .setColor(Bot.Cor)
                    .setThumbnail(Gif.Block)
                    .setDescription(`**Estes canais estão fechados para membros exceto STAFF \n** ${blockedChannels.join("")}`)
                    .setTimestamp();
                // Se houver canais bloqueados, envie a lista deles
                interaction.reply({ embeds: [chatsBloqueados] })
            } else {
                interaction.reply({ embeds: [AvisoNenhum], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
            }
        } else if (tipo === "servidores") {
            // Obtenha a lista de servidores em que o bot está
            const servers = client.guilds.cache;

            // Crie um array para armazenar informações de todos os servidores
            const serverInfo = [];

            servers.forEach(async (guild) => {
                const guildName = guild.name;
                const guildID = guild.id;
                const ownerID = guild.ownerId;
                const owner = client.users.cache.get(ownerID);

                // Crie um campo personalizado para cada servidor
                const serverField = {
                    name: `🖥 ${guildName}    \`🆔${guildID}\`\n`,
                    value: `**\n:mechanic_tone1: ${owner}**  \`🆔${owner.id}\``,
                    inline: false,
                };

                // Adicione o campo personalizado ao array de campos
                serverInfo.push(serverField);
            });

            // Crie um único embed com todas as informações
            const embed = new Discord.EmbedBuilder()
                .setColor(Bot.Cor)
                .setTitle('Servidores em que o bot está')
                .setDescription('Estou em todos esses servidores')
                .setThumbnail(Gif.Bot)
                .addFields(serverInfo);

            // Responda com o único embed contendo informações de todos os servidores
            interaction.reply({ embeds: [embed] });
        }

    }
};