const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../estruturas/constantes.js");

const gdc = Bot.ServidorID;
//const gdc = "866722237204529202";
const log_entrada_gdc = "857970246668386324";

module.exports = {
    name: "GDC",
    execute(member) {
        if (member.guild.id !== gdc) return;
        const emoji = member.guild.emojis.cache.find(emoji => emoji.name === 'GDC');

        const entradaGDC = new Discord.EmbedBuilder()
            .setTitle(`${emoji} 𝑩𝒐𝒂𝒔-𝑽𝒊𝒏𝒅𝒂𝒔 ${emoji}`)
            .setColor(Bot.Cor)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setImage(Gif.BoasVinda)
            .setDescription(`**\n${member}, 𝑩𝒐𝒂𝒔-𝑽𝒊𝒏𝒅𝒂𝒔 𝒂 𝒇𝒂𝒎𝒊́𝒍𝒊𝒂 \`${member.guild.name}\`! 𝑨𝒕𝒖𝒂𝒍𝒎𝒆𝒏𝒕𝒆 𝒆𝒔𝒕𝒂𝒎𝒐𝒔 𝒄𝒐𝒎 📈 \`${member.guild.memberCount} 𝒎𝒆𝒎𝒃𝒓𝒐𝒔.\`**  \n\n **🛡 𝑹𝒆𝒈𝒓𝒂𝒔 🛡** \n 𝑳𝒆𝒊𝒂 𝒂𝒔 𝒓𝒆𝒈𝒓𝒂𝒔 𝒑𝒂𝒓𝒂 𝒆𝒗𝒊𝒕𝒂𝒓 𝒃𝒂𝒏 𝒐𝒖 𝒑𝒖𝒏𝒊𝒄̧𝒐̃𝒆𝒔 <#823442602212196402> \n\n **🎮 𝑮𝒂𝒎𝒆𝒔 🎮 ** \n 𝑻𝒆𝒎𝒐𝒔 𝒔𝒂𝒍𝒂𝒔 𝒅𝒆 𝒈𝒂𝒎𝒆𝒔 𝒈𝒓𝒂𝒕𝒖𝒊́𝒕𝒐 <#728542906998325298> \n\n **🔞 +𝟭𝟴 🔞** \n 𝑻𝒆𝒎𝒐𝒔 𝒖𝒎𝒂 𝒔𝒂𝒍𝒂 𝒗𝒐𝒍𝒕𝒂𝒅𝒂 𝒑𝒂𝒓𝒂 𝒐 𝒄𝒐𝒏𝒕𝒆𝒖́𝒅𝒐 𝒂𝒅𝒖𝒍𝒕𝒐 𝒑𝒂𝒓𝒂 𝒎𝒂𝒊𝒐𝒓𝒆𝒔 𝒅𝒆 18 𝒂𝒏𝒐𝒔 <#810764965341954058> \n\n **😁 𝑴𝒆𝒎𝒆𝒔 😁** \n 𝑻𝒆𝒎𝒐𝒔 𝒖𝒎𝒂 𝒔𝒂𝒍𝒂 𝒗𝒐𝒍𝒕𝒂𝒅𝒂 𝒑𝒂𝒓𝒂 𝒎𝒆𝒎𝒆𝒔 <#809657996942508073> \n\n **🎥 𝒀𝒐𝒖𝒕𝒖𝒃𝒆𝒓𝒔/𝒔𝒕𝒓𝒆𝒂𝒎𝒆𝒓𝒔 🎥** \n 𝑪𝒂𝒏𝒂𝒍 𝒅𝒆 𝒅𝒊𝒗𝒖𝒍𝒈𝒂𝒄̧𝒐̃𝒆𝒔 <#728494733780975626> `)
            .setTimestamp();
        member.guild.channels.cache.get(log_entrada_gdc).send({ embeds: [entradaGDC], content: `${member}` });
        
        const mensagemDMPV = `𝑨𝒃𝒓𝒊𝒈𝒂𝒅𝒐 𝒑𝒐𝒓 𝒆𝒏𝒕𝒓𝒂𝒓 𝒏𝒂 𝑭𝒂𝒎𝒊́𝒍𝒊𝒂  {𝑮𝑫𝑪}  𝒖𝒎𝒂 𝒇𝒂𝒎𝒊́𝒍𝒊𝒂 𝒅𝒆 𝒎𝒂𝒍𝒖𝒄𝒐𝒔 😂😂! \n\n𝑬𝒔𝒔𝒆 𝒔𝒆𝒓𝒗𝒊𝒅𝒐𝒓 𝒇𝒐𝒊 𝒇𝒆𝒊𝒕𝒐 𝒑𝒂𝒓𝒂 𝒑𝒐𝒅𝒆𝒓𝒎𝒐𝒔 𝒄𝒐𝒏𝒗𝒆𝒓𝒔𝒂𝒓 𝒆 𝒏𝒐𝒔 𝒅𝒊𝒗𝒆𝒓𝒕𝒊, 𝒆𝒔𝒑𝒆𝒓𝒐 𝒒𝒖𝒆 𝒂𝒑𝒓𝒐𝒗𝒆𝒊𝒕𝒆𝒎 𝒃𝒆𝒎 😃 !!!!!! 𝑹𝒆𝒔𝒑𝒆𝒊𝒕𝒐 𝒂𝒄𝒊𝒎𝒂 𝒅𝒆 𝒕𝒖𝒅𝒐 🙂. \n \n 𝑽𝒄 𝒑𝒐𝒅𝒆 𝒄𝒉𝒂𝒎𝒂𝒓 𝒒𝒖𝒂𝒏𝒕𝒐𝒔 𝒂𝒎𝒊𝒈𝒐𝒔 𝒒𝒖𝒊𝒔𝒆𝒓 𝒑𝒂𝒓𝒂 𝒄𝒐𝒏𝒗𝒆𝒓𝒔𝒂𝒓 𝒔𝒆 𝒅𝒊𝒗𝒆𝒓𝒕𝒊 ${Bot.Servidor}  \n\n **🛡 𝑹𝒆𝒈𝒓𝒂𝒔** \n 𝑳𝒆𝒊𝒂 𝒂𝒔 𝒓𝒆𝒈𝒓𝒂𝒔 𝒑𝒂𝒓𝒂 𝒆𝒗𝒊𝒕𝒂𝒓 𝒃𝒂𝒏 𝒐𝒖 𝒑𝒖𝒏𝒊𝒄̧𝒐̃𝒆𝒔 <#823442602212196402> \n\n **🔞 +𝟭𝟴** \n 𝑻𝒆𝒎𝒐𝒔 𝒖𝒎𝒂 𝒔𝒂𝒍𝒂 𝒗𝒐𝒍𝒕𝒂𝒅𝒂 𝒑𝒂𝒓𝒂 𝒐 𝒄𝒐𝒏𝒕𝒆𝒖́𝒅𝒐 𝒂𝒅𝒖𝒍𝒕𝒐 𝒑𝒂𝒓𝒂 𝒎𝒂𝒊𝒐𝒓𝒆𝒔 𝒅𝒆 18 𝒂𝒏𝒐𝒔 <#810764965341954058> \n\n **😁 𝑴𝒆𝒎𝒆𝒔 😁** \n 𝑻𝒆𝒎𝒐𝒔 𝒖𝒎𝒂 𝒔𝒂𝒍𝒂 𝒗𝒐𝒍𝒕𝒂𝒅𝒂 𝒑𝒂𝒓𝒂 𝒎𝒆𝒎𝒆𝒔 <#809657996942508073> \n\n **🤖 𝒃𝒐𝒕𝒔** 𝑬𝒔𝒕𝒂𝒎𝒐𝒔 𝒅𝒆𝒔𝒆𝒏𝒗𝒐𝒍𝒗𝒆𝒏𝒅𝒐 𝒏𝒐𝒔𝒔𝒐𝒔 𝒑𝒓𝒐́𝒑𝒓𝒊𝒐𝒔 𝒃𝒐𝒕𝒔 𝒒𝒖𝒆𝒎 𝒒𝒖𝒊𝒔𝒆𝒓 𝒖𝒔𝒂𝒓 𝒆𝒏𝒕𝒓𝒆 𝒆𝒎 𝒄𝒐𝒏𝒕𝒂𝒕𝒐 \n\n **🎮 𝑮𝒂𝒎𝒆𝒔 🎮 ** \n 𝑻𝒆𝒎𝒐𝒔 𝒃𝒐𝒕𝒔 𝒒𝒖𝒆 𝒂𝒏𝒖𝒏𝒄𝒊𝒂 𝑱𝒐𝒈𝒐𝒔 100% 𝑮𝒓𝒂́𝒕𝒊𝒔 𝒏𝒂 𝒔𝒂𝒍𝒂  <#728542906998325298> \n\n **🎥 𝒀𝒐𝒖𝒕𝒖𝒃𝒆𝒓𝒔/𝒔𝒕𝒓𝒆𝒂𝒎𝒆𝒓𝒔 🎥** \n 𝑪𝒂𝒏𝒂𝒍 𝒅𝒆 𝒅𝒊𝒗𝒖𝒍𝒈𝒂𝒄̧𝒐̃𝒆𝒔 <#728494733780975626> \n\n 𝑷𝒂𝒓𝒂 𝒒𝒖𝒂𝒍𝒒𝒖𝒆𝒓 𝒅𝒖𝒗𝒊𝒅𝒂 𝒐𝒖 𝒅𝒊𝒗𝒖𝒍𝒈𝒂𝒄̧𝒐̃𝒆𝒔 𝒎𝒂𝒏𝒅𝒆 𝒎𝒆𝒏𝒔𝒂𝒈𝒆𝒎 == <@${Bot.NoobSupremo}>  \n `

        if (member.user.dmChannel) {
            member.user.dmChannel.send(mensagemDMPV);
        } else {
            member.user.createDM().then(dm => {
                dm.send(mensagemDMPV);
            }).catch(error => {
                console.error(`Erro ao criar ou enviar mensagem na DM: ${error}`);
            });
        }

    },
};
