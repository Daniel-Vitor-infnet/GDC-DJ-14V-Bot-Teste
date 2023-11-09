const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../constantes.js");
const Emoji = require("../emoji");


const menus = {

  Inicial: new Discord.EmbedBuilder()
    .setColor(Bot.Cor)
    .setTitle(`${Emoji.MenuInicial} Menu Inicial`)
    .setDescription(`**\nOlá, para ver meus comandos clique em "Meus Comandos"\n**`)
    .setThumbnail(Gif.Comandos),

  Staff: new Discord.EmbedBuilder()
    .setColor(Bot.Cor)
    .setTitle(`${Emoji.Staff} Administração`)
    .setDescription(`Olá, meus comandos de \`Administração\` estão disponíveis apenas para membros da STAFF:`),

  Dono: new Discord.EmbedBuilder()
    .setColor(Bot.Cor)
    .setTitle(`${Emoji.Dono} Dono Do Servidor`)
    .setDescription(`Olá, meus comandos de \`Dono Do Servidor\` estão disponíveis apenas para o dono do servidor:`),


  Membros: new Discord.EmbedBuilder()
    .setColor(Bot.Cor)
    .setTitle(`${Emoji.Membros} Membros`)
    .setDescription(`Olá, meus comandos de \`Membros\` estão disponíveis para todos do servidor:`),






};

module.exports = menus;

