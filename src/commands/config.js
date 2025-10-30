const { huddleSchedules, channelConfigs } = require("../storage/memory");

/**
 * Comando /huddle-config
 * Exibe canais configurados e huddles agendados
 */
async function handleConfig({ command, ack, client }) {
  await ack();

  try {
    const schedules = Array.from(huddleSchedules.values());
    const configuredChannels = Array.from(channelConfigs.keys());

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Configurações",
        },
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Canais com notificações*\n${configuredChannels.length} ${
            configuredChannels.length === 1 ? "canal" : "canais"
          }`,
        },
      },
    ];

    if (configuredChannels.length > 0) {
      const channelList = configuredChannels.map((id) => `<#${id}>`).join(", ");
      blocks.push({
        type: "context",
        elements: [{ type: "mrkdwn", text: channelList }],
      });
    } else {
      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Nenhum canal configurado. Use `/huddle-setup` para ativar.",
          },
        ],
      });
    }

    blocks.push({ type: "divider" });

    if (schedules.length === 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Huddles agendados*\nNenhum agendamento ativo`,
        },
      });
      blocks.push({
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Use `/huddle-schedule` para criar agendamentos.",
          },
        ],
      });
    } else {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Huddles agendados*\n${schedules.length} ${
            schedules.length === 1 ? "agendamento" : "agendamentos"
          }`,
        },
      });

      schedules.forEach((schedule) => {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${schedule.time} • <#${schedule.channel}>\n${schedule.message}`,
          },
        });
      });
    }

    await client.chat.postEphemeral({
      channel: command.channel_id,
      user: command.user_id,
      blocks,
      text: "Configurações do Huddle Notifier",
    });
  } catch (error) {
    console.error("Erro ao exibir configurações:", error.message);

    await client.chat
      .postEphemeral({
        channel: command.channel_id,
        user: command.user_id,
        text: "Não foi possível carregar as configurações. Tente novamente.",
      })
      .catch(() => {});
  }
}

module.exports = handleConfig;
