const { channelConfigs } = require("../storage/memory");

/**
 * Comando /huddle-setup
 * Ativa/desativa notificações de huddle no canal
 */
async function handleSetup({ command, ack, client }) {
  console.log("🎯 Comando /huddle-setup recebido!");
  console.log("Channel:", command.channel_id);
  console.log("User:", command.user_id);
  await ack();

  const channelId = command.channel_id;
  const isConfigured = channelConfigs.has(channelId);

  try {
    if (isConfigured) {
      // Desativar notificações
      channelConfigs.delete(channelId);
      console.log(`❌ Notificações desativadas no canal ${channelId}`);

      await client.chat.postEphemeral({
        channel: channelId,
        user: command.user_id,
        text: `❌ Notificações desativadas.\n\nPara reativar, use \`/huddle-setup\` novamente.`,
      });
    } else {
      // Ativar notificações
      channelConfigs.set(channelId, {
        activatedBy: command.user_id,
        activatedAt: Date.now(),
      });
      console.log(`✅ Notificações ativadas no canal ${channelId}`);

      await client.chat.postMessage({
        channel: channelId,
        text: `✅ *Notificações de huddle ativadas!*\n\nTodos os membros serão notificados quando alguém iniciar um huddle. 🎙️`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `✅ *Notificações ativadas!*\n\nQuando alguém iniciar um huddle neste canal, todos os membros serão notificados.\n\n💡 _Para desativar, use_ \`/huddle-setup\` _novamente._`,
            },
          },
        ],
      });
    }
  } catch (error) {
    console.error("Erro no comando setup:", error);
    await client.chat.postEphemeral({
      channel: channelId,
      user: command.user_id,
      text: `❌ Erro ao configurar. Tente novamente.`,
    });
  }
}

module.exports = handleSetup;
