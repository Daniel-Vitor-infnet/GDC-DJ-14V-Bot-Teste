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




module.exports = {



  verificaComandoBloqueado: async function (servidorId, comando, db) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database("database_sqlite.db");
      db.get("SELECT Status FROM StatusComandos WHERE ServidorID = ? and Comandos = ? AND Status = 'Desabilitado'", servidorId, comando, (err, row) => {
        if (err) {
          console.error("Erro ao verificar se o comando está bloqueado:", err);
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });
  },


  verificaComandoBloqueadoPorPadrao: async function (servidorId, servidorNome, comando, interactionExport, Status) {
    const db = new sqlite3.Database("database_sqlite.db");

    db.get("SELECT Status FROM StatusComandos WHERE ServidorID = ? AND Comandos = ?", servidorId, comando, (err, row) => {
      if (err) {
        console.error("Erro ao verificar o status do comando:", err);
        db.close();
      } else {
        if (Status === "Desabilitar") {
          if (row && row.Status === "Desabilitado") {
            db.close();
          } else if (row && row.Status === "Habilitado") {
            db.close();
          } else {
            db.run("INSERT OR REPLACE INTO StatusComandos (Comandos, Status, ServidorID, ServidorNome) VALUES (?, 'Desabilitado', ?, ?)", comando, servidorId, servidorNome, (err) => {
              if (err) {
                console.error("Erro ao Desabilitar o comando:", err);
              } else {
              }
              db.close();
            });
          }
        }
      }
    });

    await interactionExport.deferReply();

    const db3 = new sqlite3.Database("database_sqlite.db");

    let parar = false

    if (await module.exports.verificaComandoBloqueado(servidorId, comando, db3)) {
      interactionExport.followUp({ embeds: [BloqueadoComandoPadrao(`${comando}`, `${interactionExport.guild.ownerId}`)] })
      parar = true
    }

    return parar;
  },



  // Função para notificar o desenvolvedor por mensagem direta (DM)
  notificarNoob: function (importandoNoob, mensagem) {

    if (importandoNoob) {
      importandoNoob.send(mensagem)
        .catch((err) => {
          console.error(`❌ Falha ao enviar mensagem via DM: ${err}`);
        });
    }
  },

  verificarMembro: async function (client, interaction, membroRecebido) {
    //Caso nenhum membro for informado ele retorna null
    if (membroRecebido === null) {
      const membroDoDiscord = null
      const membroServidor = null
      return { membroDoDiscord, membroServidor };
    } else { //Caso não for null ele trata o membro
      //tratamento para String
      let membroRecebidoString = membroRecebido.value
      if (membroRecebido.type === 3 && !/^\d{17,19}$/.test(membroRecebidoString)) {
        const letras = membroRecebidoString.replace(/[^a-zA-Z]/g, '');
        let erro = letras.length > 0 ? `Você colocou letras no ID, não existem letras no ID. \n\n Sua Resposta: \`\`\`${membroRecebidoString}\`\`\` \nLetra(s) no ID: \`\`\`${letras}\`\`\` ` : false;
        if (!erro) {
          erro = membroRecebidoString.length < 17 || membroRecebidoString.length > 19 ? `Você colocou a quantidade de números incorreta, deve fornecer de 17 até 19 números para um ID válido. \n\n Sua Resposta: \`\`\`${membroRecebidoString}\`\`\` \nQuantidade: \`\`\`${membroRecebidoString.length}\`\`\`` : false;
        }

        const membroDoDiscord = erro
        const membroServidor = erro

        return { membroDoDiscord, membroServidor };
      } else {
        //Caso for uma menção ele conver para um id String
        if (membroRecebido.type === 6) {
          membroRecebidoString = membroRecebido.user.id
        }

        const membroDoDiscord = (await client.users.fetch(membroRecebidoString).catch(error => null)) || `O membro \`\`${membroRecebidoString}\`\` não esta no banco de dados do Discord`;
        const avisoForaServidor = `O membro \`\`<@${membroRecebidoString}>\`\` não faz parte do servidor`
        let membroServidor = avisoForaServidor

        //Trata membros fora ou dentros do Servidor
        if (typeof membroDoDiscord !== 'string') {
          membroServidor = (await interaction.guild.members.fetch(membroRecebidoString).catch(error => null)) || avisoForaServidor;
        }

        return { membroDoDiscord, membroServidor };
      }
    }
  },

  // Função para verificar mensagens de um mebro expecifico 
  mensagensDoMembro: async function (interaction, membro, quantidade) {

    let lastMessageId = null;
    const authorMessages = new Map();

    do {
      const messages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId });

      // Filtra e armazena apenas as últimas 4 mensagens do autor
      messages.forEach((message) => {
        if (message.author.id === membro.id && authorMessages.size < quantidade) {
          authorMessages.set(message.id, message);
        }
      });


      // Atualiza o ID da última mensagem para a próxima iteração
      lastMessageId = messages.last()?.id;

    } while (lastMessageId);

    return authorMessages;




  },



  extrairIdCargo: function (cargosBloqueadosFormatados, servidor) {

    const extrairID = (cargosBloqueadosFormatados.match(/\b(\d+)\b/g) || []).map(id => id);
    const cargoBloqueado = extrairID.map(roleId => servidor.guild.roles.cache.get(roleId)).filter(Boolean);

    return cargoBloqueado;
  }







}


