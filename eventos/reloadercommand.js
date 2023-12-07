const fs = require("fs");

module.exports = async (client) => {
  const SlashsArray = [];

  // Função para percorrer pastas e subpastas
  const readCommands = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = `${dir}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        // Se for uma pasta, chama a função recursivamente
        readCommands(filePath);
      } else if (file.endsWith(".js")) {
        // Se for um arquivo JavaScript, requer e adiciona aos comandos
        const command = require(`../${filePath}`);
        if (command.name) {
          client.slashCommands.set(command.name, command);
          SlashsArray.push(command);
        }
      }
    }
  };

  // Limpa todos os comandos registrados
  client.guilds.cache.forEach((guild) => guild.commands.set([]));

  // Inicia a leitura dos comandos na pasta "comandos"
  readCommands("./comandos");

  client.on("ready", async () => {
    // Define os novos comandos após limpar os existentes
    client.guilds.cache.forEach((guild) => guild.commands.set(SlashsArray));
  });
};
