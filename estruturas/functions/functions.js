const Discord = require("discord.js")
const Cor = require("../cores");
const Bot = require("../botinfo.js");
const Gif = require("../midia/gifs.js");
const sqlite3 = require("sqlite3").verbose();
const {
  Aviso,
  Aviso2,
  Aviso3,
  Permissao,
  PermissaoNoob,
  PermissaoDono,
  Erro,
  BloqueadoComando,
  BloqueadoComandoPadrao,
} = require("./embedPersonalizados");

const { converterDataParaPortugues } = require("./datas_horas.js")




module.exports = {


  // Função para notificar o desenvolvedor por mensagem direta (DM)
  consoleCompleto: async function (solicitado, cor) {

    let corEscolhida;

    // Adicionando mais cores ao switch para diferentes opções
    switch (cor) {
      case "laranja":
        corEscolhida = '\x1b[33m'; // Laranja
        break;
      case "vermelho":
        corEscolhida = '\x1b[31m'; // Vermelho
        break;
      case "azul":
        corEscolhida = '\x1b[34m'; // Azul
        break;
      case "verde":
        corEscolhida = '\x1b[32m'; // Verde
        break;
      default:
        corEscolhida = '\x1b[35m'; // Padrão (redefinir a cor)
        break;
    }



    // Código ANSI para redefinir a cor para a padrão
    const resetCor = '\x1b[0m';

    console.log(corEscolhida, JSON.stringify(solicitado, null, 2), resetCor);

    return;

  },


  // Função para notificar o desenvolvedor por mensagem direta (DM)
  voipAtual: async function (interaction, client, voipSolicitado) {

    let status = false;
    let canal = '';

    // Obtenha o estado de voz do bot no servidor
    const guild = interaction.guild

    const botMember = guild.members.cache.get(client.user.id);

    const voiceState = botMember.voice;


    // Verifica se o bot está em algum canal de voz
    if (voiceState && voiceState.channel) {
      if (voiceState.guild.id === voipSolicitado.guild.id) {
        if (voiceState.channel.id === voipSolicitado.id)
          status = true;
        canal = `<#${voipSolicitado.id}>`
      }
    }
    return { status, canal };

  },


  tratarInfosYoutube: async function (video, interaction, voiceChannel) {

    const thumbDoVideoMax = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`

    const membro = interaction.user
    const guild = interaction.guild

    const tag = membro.discriminator === '0' ? "Indisponível (conta criada recentemente)" : `#${membro.discriminator}`

    let solicitado = null;


    if (voiceChannel) {
      solicitado = {
        membro: {
          nome: membro.username,
          tag: tag,
          id: membro.id,
        },
        servidor: {
          nome: guild.name,
          id: guild.id,
          canal: {
            nome: voiceChannel.name,
            id: voiceChannel.id,
          }
        },
      }
    }






    const videosTratados = {
      type: 'video',
      titulo: video.title || "O título possui caracteres, símbolos ou emojis que não posso reproduzir.",
      description: video.description || "Indisponível",
      url: video.url || "Indisponível",
      solocitadoPor: solicitado || "Indisponível",
      id: video.videoId || "Indisponível",
      segundos: video.seconds || "Indisponível",
      tempo: video.timestamp || "Indisponível",
      duration: video.duration || "Indisponível",
      views: video.views ? video.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Indisponível",
      upload: video.ago ? await converterDataParaPortugues(video.ago) : "Indisponível",
      imagem: video.image ? thumbDoVideoMax : Midia.Gif.VideoSemImagem,
      thumb: video.thumbnail ? thumbDoVideoMax : Midia.Gif.VideoSemImagem,
      canalDoYoutube: video.author || "Indisponível",
    };




    return videosTratados
  },







}


