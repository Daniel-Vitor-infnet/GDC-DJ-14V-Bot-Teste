const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database_sqlite.db");
const cron = require("node-cron");
/*
function resetOldData() {
  const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60 + 5 * 60; // Carimbo de tempo de 24 horas e 5 minutos atrás
  const queryPostagens = "DELETE FROM PostPutaria WHERE timestamp < ?";  // Consulta para apagar registros com carimbo de tempo mais antigo
  const queryPostMemes = "DELETE FROM PostMemes WHERE timestamp < ?";   // Consulta para apagar registros com carimbo de tempo mais antigo

  db.run(queryPostagens, twentyFourHoursAgo, (err) => {
    if (err) {
      console.error("Erro ao redefinir registros antigos na tabela PostPutaria:", err);
    }
  });

  db.run(queryPostMemes, twentyFourHoursAgo, (err) => {
    if (err) {
      console.error("Erro ao redefinir registros antigos na tabela PostMemes:", err);
    }
  });
}


db.serialize(() => {
  // Cria a tabela "playlist" 
db.run("CREATE TABLE IF NOT EXISTS playlist (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, url TEXT, duration TEXT);");



  // Agende a função resetOldData() será executada às 00:00, 03:00, 06:00, 10:00, 15:00, 18:00 e 21:00.
  cron.schedule("0 0,3,6,10,15,18,21 * * *", () => {
    resetOldData();
  });


});

  */