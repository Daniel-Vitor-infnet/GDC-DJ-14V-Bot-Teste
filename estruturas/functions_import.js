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
  verificaComandoBloqueado,
} = require("./functions/functions.js")

//const {
//} = require("./functions/functions2.js")

const {
  dataDefault,
  dataPersonalizada,
  calcularTempo,
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
  verificaComandoBloqueado,
  ///functions2
  ///datas_horas
  dataDefault,
  dataPersonalizada,
  calcularTempo,
};

