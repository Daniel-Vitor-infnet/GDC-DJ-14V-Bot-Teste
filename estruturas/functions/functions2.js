const Discord = require("discord.js")
const Cor = require("../cores");
const Bot = require("../botinfo.js");
const Gif = require("../midia/gifs.js");
const sqlite3 = require("sqlite3").verbose();




module.exports = {

  verificaCargosBloqueado: async function (servidorID, interationRoles, db) {
    // Encapsula a consulta ao banco de dados em uma Promise
    const consultarCargosIgnorados = () => {
      return new Promise((resolve, reject) => {
        db.all("SELECT CargoID FROM CargosIgnorados WHERE ServidorID = ?", [servidorID], (err, cargosIgnorados) => {
          if (err) {
            reject(err);
          } else {
            // Extrai os valores do campo CargoID
            const cargosIgnoradosIDs = cargosIgnorados.map(ignoredRole => ignoredRole.CargoID);
            resolve(cargosIgnoradosIDs);
          }
        });
      });
    };

    try {
      // Aguarda a conclusão da consulta ao banco de dados
      const cargosIgnoradosIDs = await consultarCargosIgnorados();
      const cargosIgnoradosNomes = ["@everyone", "everyone", "DISBOARD.org", "𝑮𝒂𝒎𝒆𝒔 𝑫𝒆𝒂𝒍𝒔", "𝑮𝑫𝑪 𝑩𝒐𝒕 𝑫𝑱 𝑻𝒆𝒔𝒕𝒆 𝑶𝒇𝒊𝒄𝒊𝒂𝒍", "𝑮𝑫𝑪 𝑩𝒐𝒕 𝑻𝒆𝒔𝒕𝒆 𝑶𝒇𝒊𝒄𝒊𝒂𝒍", "𝑮𝑫𝑪 𝑩𝒐𝒕 𝑫𝑱 𝑻𝒆𝒔𝒕𝒆 𝑶𝒇𝒊𝒄𝒊𝒂𝒍", "Server Booster", "𝑮𝑫𝑪 𝑨𝑫𝑴 𝑶𝒇𝒊𝒄𝒊𝒂𝒍", "Streamcord", "Ayana", "Green-bot", "FlaviBot", "lorita", "Lorita"];

      // Filtra e ordena os cargos do servidor, removendo os cargos ignorados
      const roles = interationRoles
        .filter(role => !cargosIgnoradosIDs.includes(role.id) && !cargosIgnoradosNomes.includes(role.name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(role => `• <@&${role.id}>`);

      return {
        roles,
        cargosIgnoradosIDs,
        cargosIgnoradosNomes
      };
    } catch (erro) {
      console.error(erro);
      return [];
    }
  },


  embedModCargo: function (nome, cargosEscolhidos, cargosBloqueados, cargosDuplicados, cargosLista, cargosAtualizados) {

    const cargosEscolhidosEmbed =
      new Set(cargosEscolhidos.map(role => role.id)).size === 1
        ? `**Você escolheu o cargo:** ${cargosEscolhidos}`
        : `**Você escolheu os cargos:** ${cargosEscolhidos}`



    const cargosBloqueadosEmbed =
      new Set(cargosBloqueados.map(role => role.id)).size === 0
        ? ""
        : new Set(cargosBloqueados.map(role => role.id)).size === 1
          ? `\n\n**O cargo ${cargosBloqueados} esta bloqueados neste servidor para escolha. Para ver os cargos bloqueados use \`\`/lista\`\`** `
          : `\n\n**Os seguintes cargos estão bloqueados neste servidor para escolha:** ${cargosBloqueados} \nPara ver os cargos bloqueados use \`\`/lista\`\``

    const cargosDuplicadosEmbed =
      new Set(cargosDuplicados.map(role => role.id)).size === 0
        ? ""
        : new Set(cargosDuplicados.map(role => role.id)).size === 1
          ? `\n\n**Você escolheu o cargo ${cargosDuplicados} mais de uma vez, então será considerado apenas um.** `
          : `\n\n**Você escolheu alguns cargos mais de uma vez, então será considerado apenas um de cada:** ${cargosDuplicados} `



    const embed = new Discord.EmbedBuilder()
      .setColor(Bot.Cor)
      .setTitle(nome)
      .setDescription(`${cargosEscolhidosEmbed} ${cargosBloqueadosEmbed} ${cargosDuplicadosEmbed} ${cargosLista} ${cargosAtualizados} `)
      .setThumbnail(Gif.Cargos)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return embed;
  },

  embedListaCargo: function (nome, cargosEscolhidos, cargosBloqueadosPadrao, cargosDuplicados, cargosLista, cargosAtualizados) {

    const cargosEscolhidosEmbed =
      new Set(cargosEscolhidos.map(role => role.id)).size === 1
        ? `**Você escolheu o cargo:** ${cargosEscolhidos}`
        : `**Você escolheu os cargos:** ${cargosEscolhidos}`



    const cargosBloqueaedoPadraoEmbed =
      new Set(cargosBloqueadosPadrao.map(role => role.id)).size === 0
        ? ""
        : new Set(cargosBloqueadosPadrao.map(role => role.id)).size === 1
          ? `\n\n**Você escolheu o cargo ${cargosBloqueadosPadrao} é bloqueado por padrão, sua configuração é indisponível.** `
          : `\n\n**Você escolheu alguns cargos que são bloqueado por padrão, suas configurações são indisponíveis:** ${cargosBloqueadosPadrao} `

    const cargosDuplicadosEmbed =
      new Set(cargosDuplicados.map(role => role.id)).size === 0
        ? ""
        : new Set(cargosDuplicados.map(role => role.id)).size === 1
          ? `\n\n**Você escolheu o cargo ${cargosDuplicados} mais de uma vez, então será considerado apenas um.** `
          : `\n\n**Você escolheu alguns cargos mais de uma vez, então será considerado apenas um de cada:** ${cargosDuplicados} `



    const embed = new Discord.EmbedBuilder()
      .setColor(Bot.Cor)
      .setTitle(nome)
      .setDescription(`${cargosEscolhidosEmbed} ${cargosBloqueaedoPadraoEmbed} ${cargosDuplicadosEmbed} ${cargosLista} ${cargosAtualizados} `)
      .setThumbnail(Gif.Cargos)
      .setFooter({ text: 'Para mais dúvidas digite /ajuda ', iconURL: Gif.MiniGifHelp })
      .setTimestamp();

    return embed;
  },








}


