const Discord = require("discord.js");

module.exports = {
  name: "interactionCreate",
  execute(client, interaction) {
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) {
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
      }
      cmd.run(client, interaction);
    }
  },
};
