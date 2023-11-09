const { ActivityType } = require('discord.js');
var moment = require('moment-timezone');
moment.locale('pt-BR');
let data = moment().tz("America/Sao_Paulo").format('dddd 𝙳𝚒𝚊: LL 𝙰̀𝚜: LTS');
module.exports = {
  name: "ready",
  execute(client) {
    console.log(`🔥 Estou online! ${data}`);
    
    // Defina o status do bot
    client.user.setPresence({
      activities: [{ name: `/ajuda para dúvidas`, type: ActivityType.Custom }], // Você pode usar PLAYING, WATCHING, LISTENING, STREAMING, COMPETING. CUSTOM 
      status: 'online', //dnd = ocupado Online Invisible 
    });
  },
};