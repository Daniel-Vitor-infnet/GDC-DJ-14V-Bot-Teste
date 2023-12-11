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
  barraDeProgresso: async function (atual, fianl, tipo, porcentagemTrue) {


    // Calcule a porcentagem de progresso
    const progresso = Math.max(0, Math.min(100, (atual / fianl) * 100));



    let prenchidosTipo;
    let vaziosTipo;
    let tamanhoDaBarra
    // Adicionando mais cores ao switch para diferentes opções
    switch (tipo) {
      case 1:
        tamanhoDaBarra = 20;
        vaziosTipo = '░';
        prenchidosTipo = '▓';
        break;
      case 2:
        tamanhoDaBarra = 30;
        vaziosTipo = '▨';
        prenchidosTipo = '■';
        break;
      case 3:
        tamanhoDaBarra = 25;
        vaziosTipo = '○';
        prenchidosTipo = '●';
        break;
      case 4:
        tamanhoDaBarra = 28;
        vaziosTipo = '▒';
        prenchidosTipo = '░';
        break;
      case 5:
        tamanhoDaBarra = 22;
        vaziosTipo = ' ';
        prenchidosTipo = '●';
        break;
      case 6:
        tamanhoDaBarra = 28;
        vaziosTipo = '▝';
        prenchidosTipo = '▒';
        break;
      default:
        tamanhoDaBarra = 28;
        vaziosTipo = '□';
        prenchidosTipo = '▖';
        break;
    }


    const prenchidos = Math.round((tamanhoDaBarra * progresso) / 100);
    const vazios = tamanhoDaBarra - prenchidos;

    let porcentagem = porcentagemTrue

    if (porcentagem !== null) {
       porcentagem = `${progresso.toFixed(2)}%`
    } else {
       porcentagem = ``
    }

    const progressBar = `[${prenchidosTipo.repeat(prenchidos)}${vaziosTipo.repeat(vazios)}] ${porcentagem}%`;

    return progressBar;

  },


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





  // Função para notificar o desenvolvedor por mensagem direta (DM)
  playlistsDoServidor: async function (interaction, guildId) {

    const { playlists } = require("../../comandos/membros/tocar.js")


    if (!playlists.has(guildId) || playlists.get(guildId).length === 0) {
      return null;
    }

    return playlists.get(guildId);

  },


  // Função para notificar o desenvolvedor por mensagem direta (DM)
  calculaHoraAtualVideo: async function (interaction) {

    const guildId = interaction.guild.id

    const playlistsDoServido = await module.exports.playlistsDoServidor(interaction, guildId)


    if (playlistsDoServido === null) {
      return null;
    }

    const tempoSolicitado = playlistsDoServido[0].solocitadoPor.membro.hora

    const tempo = playlistsDoServido[0].duration.timestamp

    const partesTempo = tempo.split(':').reverse();
    let milissegundos = 0;

    for (let i = 0; i < partesTempo.length; i++) {
      milissegundos += partesTempo[i] * Math.pow(60, i) * 1000;
    }

    const calculo = tempoSolicitado - new Date().getTime() + milissegundos


    const horas = Math.floor(calculo / 3600000);
    const minutos = Math.floor((calculo % 3600000) / 60000);
    const segundos = Math.floor((calculo % 60000) / 1000);

    const horasFormatadas = horas > 0 ? horas.toString() + ':' : '';
    const minutosFormatados = minutos.toString().padStart(2, '0');
    const segundosFormatados = segundos.toString().padStart(2, '0');

    return `${horasFormatadas}${minutosFormatados}:${segundosFormatados}`;



  },




}


