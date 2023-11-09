const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../estruturas/constantes.js");

const gdc = Bot.ServidorID;
//const gdc = "866722237204529202";
const log_saida_gdc = "856672548023173142";

module.exports = {
    name: "GDC",
    execute(member) {
        if (member.guild.id !== gdc) return;

        const saidaGDC = new Discord.EmbedBuilder()
            .setTitle(`😔 Deixou nossa família 😔`)
            .setColor(Bot.Cor)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage(Gif.Saida)
            .setDescription(`**\n${member} 𝑺𝒂𝒊𝒖 𝒅𝒐 𝒔𝒆𝒓𝒗𝒊𝒅𝒐𝒓, 𝑬𝒔𝒑𝒆𝒓𝒐 𝒒𝒖𝒆 𝒖𝒎 𝒅𝒊𝒂 𝒆𝒍𝒆(𝒂) 𝒗𝒐𝒍𝒕𝒆, 𝒂𝒈𝒐𝒓𝒂 𝒆𝒔𝒕𝒂𝒎𝒐𝒔 𝒄𝒐𝒎 📉\`${member.guild.memberCount} 𝒎𝒆𝒎𝒃𝒓𝒐𝒔\`.**  `)
            .setTimestamp();
        member.guild.channels.cache.get(log_saida_gdc).send({ embeds: [saidaGDC], content: `${member}` });

    },
};
