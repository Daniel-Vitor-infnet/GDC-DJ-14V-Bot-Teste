const { Discord, sqlite3, Cor, Bot, Gif, Aviso, Aviso2, Aviso3, PermissaoDono, Permissao, Erro, BloqueadoComando } = require("../../estruturas/constantes.js");


// Função para verificar se um URL suporta incorporação de vídeo
async function isEmbeddable(url) {
  const response = await fetch(url, {
    method: 'HEAD', // Usar o método HEAD para obter apenas informações de cabeçalho
  });

  // Verificar se o cabeçalho 'x-frame-options' permite a incorporação
  if (!response.headers.get('x-frame-options')) {
    return true;
  }

  // Se a incorporação for bloqueada, registre um aviso no console
  console.log('Incorporação bloqueada para o URL:', url);
  return false;
}

// Array de URLs dos subreddits
const subredditURLs = [
  'https://www.reddit.com/r/nsfw/new/.json?limit=800',              //nsfw (padrão)
  'https://www.reddit.com/r/MonsterGirl/new/.json?limit=800',       //Monster
  'https://www.reddit.com/r/rape_hentai/new/.json?limit=800',       //Hentai 
  'https://www.reddit.com/r/HelplessHentai/new/.json?limit=800',    //Hentai Sado
  'https://www.reddit.com/r/cosplaybutts/new/.json?limit=800',      //Cosplay (bundas)
  'https://www.reddit.com/r/nsfwcosplay/new/.json?limit=800',       //Cosplay
  'https://www.reddit.com/r/HomemadeNsfw/new/.json?limit=800',      //Caseiro
  //'https://www.reddit.com/r/NSFW_GIF/new/.json?limit=800',          //redgifs (links) Principal
  'https://www.reddit.com/r/HardcoreNSFW/new/.json?limit=800',      //redgifs (links) Alguns
];

module.exports = {
  name: 'putaria',
  description: 'Posta conteúdo +18 de várias páginas do reddit (Funciona apenas em canais com restrição de idade) ',

  run: async (client, interaction) => {
    // Extrair dados relevantes da interação
    const servidorId = interaction.guildId;
    const comando = interaction.commandName;

    // Verificar se o comando está bloqueado no banco de dados
    const db = new sqlite3.Database("database_sqlite.db");
    const bloqueado = await verificaComandoBloqueado(servidorId, comando, db);
    db.close();

    // Bloqueio Embed Personalizado
    const TextoDoBloqueado = `O comando \`${comando}\` foi bloqueado neste servidor pelo dono <@${Bot.NoobSupremo}>. Qualquer dúvida entre em contato com a STAFF `;
    const Bloqueio = BloqueadoComando(TextoDoBloqueado);

    if (bloqueado) {
      interaction.reply({ embeds: [Bloqueio] });
      return;
    }

    // Meu código principal
    //////////////////////////////////////////////////////////////////////////////////EMBEDS////////////////////////////////////////////////////////////////////////////////////////////////
    //Erro Quantidade
    const TextoDeBuscar = `\n Ocorreu um erro ao buscar postagens. Entre em contato com o suporte.`;
    const ErroBuscar = Erro(TextoDeBuscar);

    //Aviso Motivo
    const TextoDoNSFW = `\n Este comando só pode ser executado em canais com restrição de idade (NSFW).`;
    const AvisoNSFW = Aviso(TextoDoNSFW);

    //Aviso Motivo
    const TextoDoNPostagens = `\n Este comando só pode ser executado em canais com restrição de idade (NSFW). Caso tenha dúvidas procure um membro da STAFF e verifique os canais disponíveis`;
    const AvisoNPostagens = Aviso(TextoDoNPostagens);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Verificar se o canal é classificado como NSFW
    if (interaction.channel.nsfw) {
      await interaction.deferReply();

      try {
        import('node-fetch').then(async (nodeFetch) => {
          const fetch = nodeFetch.default;

          // Escolha aleatoriamente um URL de subreddit
          const randomURL = subredditURLs[Math.floor(Math.random() * subredditURLs.length)];

          const response = await fetch(randomURL);
          const data = await response.json();
          const posts = data.data.children;

          if (posts.length === 0) {
            return interaction.followUp({ embeds: [AvisoNPostagens], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
          } else {
            const randomIndex = Math.floor(Math.random() * posts.length);
            const randomPost = posts[randomIndex].data;


            // Adição da primeira regra para links RedGifs
            if (randomPost.url.includes("https://www.redgifs.com/watch") || randomPost.url.includes("https://v3.redgifs.com/watch")) {
              // Link RedGifs com aviso em uma caixa de código
              const codeBlock = "```\nNem sempre o Discord oferece suporte para todos os vídeos. (Clique no link para ouvir o áudio).```" + randomPost.url;
              interaction.followUp(codeBlock);
              return; // Retorna para evitar o envio do embed
            }

            // Adição da segunda regra
            if (randomPost.url.startsWith('https://i.redgifs.com/i/')) {
              // Ignorar esta postagem
              return; // Não faz nada com esta postagem
            }

            const embed = {
              color: Bot.Cor2,
              title: randomPost.title,
              image: {},
            };

            if (randomPost.is_video) {
              const embeddable = await isEmbeddable(randomPost.url_overridden_by_dest);

              if (embeddable) {
                embed.video = {
                  url: randomPost.url_overridden_by_dest,
                };
              } else {
                // Ao invés de apenas adicionar o link, adicione-o ao campo de descrição do embed
                embed.description = `[Link Externo clique aqui para acessar](${randomPost.url_overridden_by_dest})`;
              }
            } else if (randomPost.url.endsWith('.gif')) {
              embed.image.url = randomPost.url;
            } else if (randomPost.url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
              embed.image.url = randomPost.url;
            } else if (randomPost.url.match(/^https?:\/\/\S+/i)) {
              // Novamente, adicione o link ao campo de descrição
              embed.description = `[Link Externo clique aqui para acessar](${randomPost.url_overridden_by_dest})`;
            }


            return interaction.followUp({ embeds: [embed] });
          }
        });
      } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        console.log('URL da postagem problemática:', randomPost.url);
        await interaction.followUp({ embeds: [ErroBuscar], ephemeral: true }).then(response => setTimeout(() => response.delete(), 120000)).catch(console.error);
      }
    } else {
      // Canal não é classificado como NSFW
      await interaction.reply({ embeds: [AvisoNSFW], ephemeral: true }).then(response => setTimeout(() => response.delete(), 50000)).catch(console.error);
    }
  },
};

// Função para verificar se o comando está bloqueado no banco de dados
async function verificaComandoBloqueado(servidorId, comando, db) {
  return new Promise((resolve, reject) => {
    db.get("SELECT Status FROM StatusComandos WHERE ServidorID = ? and Comandos = ? AND Status = 'Desabilitado'", servidorId, comando, (err, row) => {
      if (err) {
        console.error("Erro ao verificar se o comando está bloqueado:", err);
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
}
