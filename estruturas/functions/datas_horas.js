const Discord = require("discord.js")
const Cor = require("../cores");
const Bot = require("../botinfo.js");
const Gif = require("../midia/gifs.js");
let moment = require("moment-timezone");

//Link dos formatos https://momentjs.com

module.exports = {
  dataDefault: function () {
    moment.locale("pt-BR");
    const dataformatada = moment().tz("America/Sao_Paulo").format("dddd 𝙳𝚒𝚊: LL 𝙰̀𝚜: LTS");

    return dataformatada;
  },


  dataPersonalizada: function (personalizado) {
    moment.locale("pt-BR");
    const dataformatada = moment().tz("America/Sao_Paulo").format(personalizado);

    return dataformatada;
  },

  calcularTempo: function (data_hora) {
    const diferencaTempo = new Date() - data_hora;
    if (diferencaTempo > 1000 * 60 * 60 * 24) {
      const anos = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24 * 365.25));
      const meses = Math.floor((diferencaTempo % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
      const dias = Math.floor((diferencaTempo % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
      const partes = [];

      if (anos > 0) partes.push(`${anos} ano${anos > 1 ? 's' : ''}`);
      if (meses > 0) partes.push(`${meses} mês${meses > 1 ? 'es' : ''}`);
      if (dias > 0) partes.push(`${dias} dia${dias > 1 ? 's' : ''}`);

      return `há ${partes.join(' || ')}`;
    } else {
      const horas = Math.floor(diferencaTempo / (1000 * 60 * 60));
      const minutos = Math.floor((diferencaTempo % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencaTempo % (1000 * 60)) / 1000);

      const partes = [];

      if (horas > 0) partes.push(`${horas} hora${horas > 1 ? 's' : ''}`);
      if (minutos > 0) partes.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`);
      if (segundos > 0) partes.push(`${segundos} segundo${segundos > 1 ? 's' : ''}`);

      return `há ${partes.join(' || ')}`;
    }
  },


  converterDataParaPortugues: async function (dataEmIngles) {

    // Mapeia as palavras-chave em inglês para português
    const mapeamentoPalavrasChave = {
      'years': 'anos',
      'months': 'meses',
      'weeks': 'semanas',
      'days': 'dias',
      'hours': 'horas',
      'minutes': 'minutos',
      'seconds': 'segundos',
      'year': 'ano',
      'month': 'mês',
      'week': 'semana',
      'day': 'dia',
      'hour': 'hora',
      'minute': 'minuto',
      'second': 'segundo'
    };
  
    // Divide a string para obter a quantidade e a unidade de tempo
    const partes = dataEmIngles.split(' ');
    const quantidade = partes[0];
    const unidade = partes[1];
  
    // Traduz a unidade de tempo
    const traducao = mapeamentoPalavrasChave[unidade] || unidade;
  
    // Retorna a tradução completa
    return `${quantidade} ${traducao} atrás`;
  },

}


