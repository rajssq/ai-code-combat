const { channelConfigs } = require("../storage/memory");

/**
 * Comando /huddle-setup
 * Ativa/desativa notificações de huddle no canal
 */
async function handleSetup({ command, ack, client }) {
  await ack();

  const channelId = command.channel_id;
  const userId = command.user_id;
  const isConfigured = channelConfigs.has(channelId);

  console.log(
    `${isConfigured ? "Desativando" : "Ativando"} notificações em ${channelId}`
  );

  try {
    if (isConfigured) {
      channelConfigs.delete(channelId);

      await client.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: "Notificações desativadas",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Notificações desativadas*\nMembros não serão mais notificados sobre huddles neste canal.",
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "Para reativar, use `/huddle-setup` novamente.",
              },
            ],
          },
        ],
      });
    } else {
      channelConfigs.set(channelId, {
        activatedBy: userId,
        activatedAt: Date.now(),
      });

      await client.chat.postMessage({
        channel: channelId,
        text: "Notificações de huddle ativadas",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Notificações ativadas*\nTodos os membros serão notificados quando alguém iniciar um huddle neste canal.",
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "Para desativar, use `/huddle-setup` novamente.",
              },
            ],
          },
        ],
      });
    }
  } catch (error) {
    console.error("Erro ao configurar canal:", error.message);

    await client.chat
      .postEphemeral({
        channel: channelId,
        user: userId,
        text: "Não foi possível alterar a configuração. Verifique as permissões do bot.",
      })
      .catch(() => {});
  }
}

module.exports = handleSetup;
