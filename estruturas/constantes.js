const Discord = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const Cor = require("./cores.js");
const Bot = require("./botinfo.js");
const Gif = require("./gifs.js");
const {
  Aviso,
  Aviso2,
  Aviso3,
  PermissaoDono,
  Permissao,
  Erro,
  BloqueadoComando
} = require("./embedPersonalizados.js");

module.exports = {
  Discord,
  sqlite3,
  Cor,
  Bot,
  Gif,
  Aviso,
  Aviso2,
  Aviso3,
  PermissaoDono,
  Permissao,
  Erro,
  BloqueadoComando
};
