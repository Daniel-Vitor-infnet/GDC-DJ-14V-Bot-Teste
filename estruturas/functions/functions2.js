const Discord = require("discord.js")
const Cor = require("../cores");
const Bot = require("../botinfo.js");
const Gif = require("../midia/gifs.js");
const sqlite3 = require("sqlite3").verbose();




module.exports = {



  capturarIDDoVideo: async function (link) {

    // Verificar se o link contém o padrão do YouTube
    const padraoYouTube = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    let resultado;
    let tipo;

    if (link.includes("https://")) {
      if (link.match(padraoYouTube)) {
        resultado = link.match(/[a-zA-Z0-9_-]{11}/);
        resultado = resultado[0]
        tipo = "link"
      } else {
        resultado = false;
        tipo = false;
      }
    } else {
      resultado = link
      tipo = "id"
    }

    console.log(resultado, tipo)


    return { resultado, tipo };

  }









}


