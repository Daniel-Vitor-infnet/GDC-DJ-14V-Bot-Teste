const Discord = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const Cor = require("./cores.js");
const Bot = require("./botinfo.js");
const Gifs = require("./midia/gifs.js");
const Imagens = require("./midia/imagens.js");
const EmojisPersonalizados = require("./midia/emojispersonalizados.js");
const cargos = require("./gdc/cargos.js"); // Substitua pelo caminho real do seu arquivo cargos.js
const canais = require("./gdc/canais.js"); // Substitua pelo caminho real do seu arquivo canais.js

// Combina os dois módulos em um novo objeto
const GDC = {
  Cargo: cargos,
  Canal: canais,
};

const Midia = {
  Gif: Gifs,
  Imagem: Imagens,
  EmojiPersonalizado: EmojisPersonalizados,
};




module.exports = {
  Discord,
  sqlite3,
  Cor,
  Bot,
  Midia,
  GDC,
};