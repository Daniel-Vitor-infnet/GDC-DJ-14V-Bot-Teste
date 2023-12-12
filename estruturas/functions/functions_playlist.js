const Discord = require("discord.js")
const Cor = require("../cores");
const Bot = require("../botinfo.js");
const Gif = require("../midia/gifs.js");
const sqlite3 = require("sqlite3").verbose();
const fs = require('fs').promises;
const path = require('path');
const rimraf = require('rimraf');
let arquivoPlaylist;
let idDoServidor;
let pastaPlaylists = path.join('./playlist');

const { converterDataParaPortugues } = require("./datas_horas.js")
const { consoleCompleto } = require("./functions.js")



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


        return { resultado, tipo };

    },


    // Função principal para editar playlist
    manipularPlaylist: async function (interaction, operacao, video) {

        // Seção para criar a estrutura de pastas e arquivos
        idDoServidor = interaction.guild.id;
        arquivoPlaylist = path.join(pastaPlaylists, `${idDoServidor}.json`);

        if (operacao === "verificar") {
            try {
                await fs.access(arquivoPlaylist);
            } catch (error) {
                return false;
            }
        }


        if (operacao === "criar") {
            await module.exports.criarPastaPlaylists();
            await module.exports.verificarEIniciarPlaylist();
            return;
        }


        //console.log(video)
        // Carrega o conteúdo atual do arquivo
        const conteudoArquivo = await fs.readFile(arquivoPlaylist, 'utf-8');
        const playlist = JSON.parse(conteudoArquivo);

        // Executa a operação desejada
        switch (operacao) {
            case 'push':
                playlist.push(video);
                break;
            case 'shift':
                playlist.shift();
                break;
            case 'pop':
                playlist.pop();
                break;
            /// Informações (return)
            case 'delete':
                return await module.exports.removerArquivo();
            case 'tamanho':
                return playlist.length;
            case 'playlist':
                return playlist;
            default:
                console.error('Operação não reconhecida.');
                return;
        }

        // Escreve o novo conteúdo de volta no arquivo
        await fs.writeFile(arquivoPlaylist, JSON.stringify(playlist, null, 2));
    },


    // Função principal para editar playlist
    manipularPlaylistIndices: async function (interaction, operacao) {

        // Seção para criar a estrutura de pastas e arquivos
        idDoServidor = interaction.guild.id;

        arquivoPlaylist = path.join(pastaPlaylists, `${idDoServidor}.json`);



        // Carrega o conteúdo atual do arquivo
        const conteudoArquivo = await fs.readFile(arquivoPlaylist, 'utf-8');
        const playlist = JSON.parse(conteudoArquivo);

        // Executa a operação desejada
        switch (operacao) {
            case 'primeiroVideo':
                return playlist[0];
            case 'hora':
                playlist[0].solocitadoPor.membro.hora = new Date().getTime();
                const dataAtual = new Date();
                const dataFormatada = `${dataAtual.getHours().toString().padStart(2, '0')}:${dataAtual.getMinutes().toString().padStart(2, '0')}:${dataAtual.getSeconds().toString().padStart(2, '0')} ${dataAtual.getDate().toString().padStart(2, '0')}/${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}/${dataAtual.getFullYear()}`;
                playlist[0].solocitadoPor.membro.horaConvertida = dataFormatada
                break;
            default:
                console.error('Operação não reconhecida.');
                return;
        }

        // Escreve o novo conteúdo de volta no arquivo
        await fs.writeFile(arquivoPlaylist, JSON.stringify(playlist, null, 2));

    },





    // Verifica se a pasta 'playlist' existe do contrario cria
    criarPastaPlaylists: async function () {
        try {
            await fs.access(pastaPlaylists);
        } catch (error) {
            await fs.mkdir(pastaPlaylists);
        }
    },

    // Verifica se o arquivo da playlist já existe
    verificarEIniciarPlaylist: async function () {
        try {
            await fs.access(arquivoPlaylist);
        } catch (error) {
            // Se não existe, cria um arquivo inicial com um array vazio
            await fs.writeFile(arquivoPlaylist, '[]');
        }
    },

    // Função para remover o arquivo associado ao idDoServidor
    removerArquivo: async function () {
        try {
            await fs.unlink(arquivoPlaylist);
        } catch (error) {
            console.error(`Erro ao remover o arquivo ${arquivoPlaylist}:`, error);
        }
    },


    // Função para apagar todos os arquivos dentro da pasta "playlist"
    apagarTodosArquivosPlaylist: async function () {
        try {
            const arquivos = await fs.readdir(pastaPlaylists);

            // Itera sobre a lista de arquivos e os remove
            for (const arquivo of arquivos) {
                const caminhoArquivo = path.join(pastaPlaylists, arquivo);
                await fs.unlink(caminhoArquivo);
                console.log(`Arquivo ${caminhoArquivo} removido com sucesso.`);
            }

        } catch (error) {
            console.error('Erro ao remover os arquivos na pasta "playlist":', error);
        }
    },




    tratarInfosYoutube: async function (interaction, video) {


        const thumbDoVideoMax = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`

        const voiceChannel = interaction.member.voice.channel;
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
            imagem: video.image ? thumbDoVideoMax : Gif.VideoSemImagem,
            thumb: video.thumbnail ? thumbDoVideoMax : Gif.VideoSemImagem,
            canalDoYoutube: video.author || "Indisponível",
        };




        return videosTratados
    },



}








