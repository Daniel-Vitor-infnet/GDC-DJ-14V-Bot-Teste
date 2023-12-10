const {
  Aviso,
  Aviso2,
  Aviso3,
  Permissao,
  PermissaoNoob,
  PermissaoDono,
  Erro,
  BloqueadoComando,
  subComandoBloqueado,
} = require("./functions/embedPersonalizados.js");

const {
  consoleCompleto,
  voipAtual,
  tratarInfosYoutube,
} = require("./functions/functions.js")

const {
  capturarIDDoVideo,
} = require("./functions/functions2.js")

const {
  dataDefault,
  dataPersonalizada,
  calcularTempo,
  converterDataParaPortugues,
} = require("./functions/datas_horas.js")

module.exports = {
  ///embedPersonalizados
  Aviso,
  Aviso2,
  Aviso3,
  Permissao,
  PermissaoNoob,
  PermissaoDono,
  Erro,
  BloqueadoComando,
  subComandoBloqueado,
  ///functions
  consoleCompleto,
  voipAtual,
  tratarInfosYoutube,
  ///functions2
  capturarIDDoVideo,
  ///datas_horas
  dataDefault,
  dataPersonalizada,
  calcularTempo,
  converterDataParaPortugues,
};

