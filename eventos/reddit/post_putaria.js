const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");

const db = new sqlite3.Database("database_sqlite.db");
const subredditURLs = [
  'https://www.reddit.com/r/nsfw/new/.json?limit=800',              //nsfw (padrão)
  'https://www.reddit.com/r/MonsterGirl/new/.json?limit=800',       //Monster
  'https://www.reddit.com/r/rape_hentai/new/.json?limit=800',       //Hentai 
  //'https://www.reddit.com/r/HelplessHentai/new/.json?limit=800',    //Hentai Sado
  'https://www.reddit.com/r/cosplaybutts/new/.json?limit=800',      //Cosplay (bundas)
  'https://www.reddit.com/r/nsfwcosplay/new/.json?limit=800',       //Cosplay
  //'https://www.reddit.com/r/HomemadeNsfw/new/.json?limit=800',      //Caseiro
  //'https://www.reddit.com/r/NSFW_GIF/new/.json?limit=800',          //redgifs (links) Principal
  'https://www.reddit.com/r/HardcoreNSFW/new/.json?limit=800',      //redgifs (links) Alguns
];


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomSubredditURL() {
  const randomIndex = Math.floor(Math.random() * subredditURLs.length);
  return subredditURLs[randomIndex];
}

async function postNewPutaria(client) {
  try {
    const { default: fetch } = await import('node-fetch');
    const randomURL = getRandomSubredditURL();
    const response = await fetch(randomURL);
    const data = await response.json();
    const posts = data.data.children;

    if (posts.length > 0) {
      shuffle(posts);

      db.all("SELECT ServidorID, CanalID, Intervalo, UltimoTempoExecucao FROM EventosPost WHERE PostNome = ? AND Status = 'Habilitado'", 'Putaria', (err, rows) => {
        if (err) {
          console.error("Erro ao buscar o canal de eventos", err);
        } else {
          shuffle(rows);

          rows.forEach(row => {
            const servidorId = row.ServidorID;
            const canalId = row.CanalID;
            const intervalo = row.Intervalo;
            const ultimoTempoExecucao = row.UltimoTempoExecucao;

            const agora = Date.now();
            const INTERVALO_DESEJADO = intervalo * 60000;
            //const INTERVALO_DESEJADO = intervalo; // Para Testes

            if (ultimoTempoExecucao === null || (agora - ultimoTempoExecucao) >= INTERVALO_DESEJADO) {
              const randomPost = posts.shift().data;
              const postId = randomPost.id;
              const timestamp = Math.floor(Date.now() / 1000);
              const thresholdTimestamp = timestamp - 24 * 60 * 60 + 5 * 60;

              if (randomPost.url.startsWith('https://i.redgifs.com/i/')) {
                // Ignorar esta postagem
              } else {
                db.get("SELECT PostID FROM PostPutaria WHERE ServidorID = ? AND PostID = ?", [servidorId, postId], (err, row) => {
                  if (err) {
                    console.error("Erro ao verificar postagem enviada:", err);
                  } else if (!row) {
                    if (timestamp > thresholdTimestamp) {
                      db.run("INSERT INTO PostPutaria (ServidorID, PostID, timestamp) VALUES (?, ?, ?)", [servidorId, postId, timestamp], (err) => {
                        if (err) {
                          console.error("Erro ao inserir o registro na tabela PostPutaria:", err);
                        } else {
                          const embed = {
                            color: Bot.Cor2,
                            title: randomPost.title,
                            image: {},
                          };
                          if (randomPost.is_video) {
                            // Adicione lógica para lidar com vídeos, se necessário
                          } else if (randomPost.url.includes("https://www.redgifs.com/watch") || randomPost.url.includes("https://v3.redgifs.com/watch")) {
                            const codeBlock = "```\nNem sempre o Discord oferece suporte para todos os vídeos. (Clique no link para ouvir o áudio).```" + randomPost.url;
                            const channel = client.channels.cache.get(canalId);
                            channel.send(codeBlock);
                          } else {
                            if (randomPost.url.endsWith('.gif')) {
                              embed.image.url = randomPost.url;
                            } else if (randomPost.url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
                              embed.image.url = randomPost.url;
                            } else if (randomPost.url.match(/^https?:\/\/\S+/i)) {
                              embed.description = `[Link Externo (clique aqui para acessar)](${randomPost.url_overridden_by_dest})`;
                            }
                            const channel = client.channels.cache.get(canalId);
                            if (channel) {
                              channel.send({ embeds: [embed] });
                            }
                          }
                        }
                      });
                    }
                  }
                });
              }

              // Atualize o valor de 'UltimoTempoExecucao' no banco de dados após o envio
              const novoUltimoTempoExecucao = Date.now();
              db.run("UPDATE EventosPost SET UltimoTempoExecucao = ? WHERE ServidorID = ? AND PostNome = ?", [novoUltimoTempoExecucao, servidorId, 'Putaria'], (err) => {
                if (err) {
                  console.error("Erro ao atualizar 'UltimoTempoExecucao'", err);
                }
              });
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
  }
}

//const intervalPutaria = 9000; // 9 segundos em milissegundos
//const intervalPutaria = 11000; // 17 segundos em milissegundos
//const intervalPutaria = 80000; // 1 minuto e 10 segundos em milissegundos
const intervalPutaria = 340000; // 5 minutos e 40 segundos em milissegundos
//const intervalPutaria = 3620000; // 1 hora e 20 segundos em milissegundos

module.exports = {
  postNewPutaria,
  intervalPutaria,
};
