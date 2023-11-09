const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../constantes");
const Emoji = require("./emoji");


const selection = {

    MenuInicial: new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
        .setCustomId("MenuInicial_ajuda")
        .setPlaceholder("Meus Comandos")
        .addOptions(

            {
                label: "STAFF",
                description: "Veja meus comandos para Administração.",
                emoji: `${Emoji.Staff}`,
                value: "Administração"
            },
            {
                label: "Dono Do Servidor",
                description: "Veja meus comandos para Dono.",
                emoji: `${Emoji.Dono}`,
                value: "Dono"
            },
            {
                label: "Membros",
                description: "Veja meus comandos para Membros.",
                emoji: `${Emoji.Membros}`,
                value: "Membros"
            },
        )
    ),




    Staff: new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
        .setCustomId("Administração_ajuda")
        .setPlaceholder("Selecione um comando de Administração")
        .addOptions(
            {
                label: "Apagar Tudo",
                description: "Apaga qualquer mensagem do chat",
                emoji: `${Emoji.Staff}`,
                value: "apagar_tudo",
            },
            {
                label: "Apagar",
                description: "Apaga mensagens do chat",
                emoji: `${Emoji.Staff}`,
                value: "apagar"
            },
            {
                label: "Banir",
                description: "Banir qualquer membro do discord no servidor",
                emoji: `${Emoji.Staff}`,
                value: "ban"
            },
            {
                label: "Gerenciar Chat",
                description: "Bloquear ou Desbloquear chats",
                emoji: `${Emoji.Staff}`,
                value: "gerenciar_chat"
            },
            {
                label: "Menu Inicial",
                description: "Volte para o menu inicial",
                emoji: `${Emoji.MenuInicial}`,
                value: "Menu Inicial"
            }
        )
    ),


    Dono: new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
        .setCustomId("Dono_ajuda")
        .setPlaceholder("Selecione um comando de Dono")
        .addOptions(
            {
                label: "Gerenciar Comandos",
                description: "Desative e Ative comandos no seu servidor",
                emoji: `${Emoji.Dono}`,
                value: "gerenciar_comandos",
            },
            {
                label: "Gerenciar Post",
                description: "Desative e Ative eventos no seu servidor",
                emoji: `${Emoji.Dono}`,
                value: "gerenciar_post"
            },
            {
                label: "Menu Inicial",
                description: "Volte para o menu inicial",
                emoji: `${Emoji.MenuInicial}`,
                value: "Menu Inicial"
            }
        )
    ),




    Membros: new Discord.ActionRowBuilder().addComponents(new Discord.StringSelectMenuBuilder()
        .setCustomId("Membros_ajuda")
        .setPlaceholder("Selecione um comando de Membros")
        .addOptions(
            {
                label: "Ajuda",
                description: "Comando para ver todos comandos do bot",
                emoji: `${Emoji.Membros}`,
                value: "ajuda",
            },
            {
                label: "Avatar",
                description: "Veja seu próprio avatar ou de outro membro",
                emoji: `${Emoji.Membros}`,
                value: "avatar"
            },
            {
                label: "Menu Inicial",
                description: "Volte para o menu inicial",
                emoji: `${Emoji.MenuInicial}`,
                value: "Menu Inicial"
            }
        )
    ),






};

module.exports = selection;

