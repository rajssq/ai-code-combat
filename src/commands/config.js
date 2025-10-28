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
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*⚙️ Configurações do Huddle Notifier*",
        },
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📺 Canais com notificações:* ${configuredChannels.length}`,
        },
      },
    ];

    if (configuredChannels.length > 0) {
      configuredChannels.forEach((channelId) => {
        blocks.push({
          type: "section",
          text: { type: "mrkdwn", text: `• <#${channelId}>` },
        });
      });
    } else {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_Nenhum canal configurado. Use `/huddle-setup` para ativar._",
        },
      });
    }

    blocks.push({ type: "divider" });

    if (schedules.length === 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_Nenhum huddle agendado. Use `/huddle-schedule` para criar._",
        },
      });
    } else {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📅 Huddles agendados:* ${schedules.length}`,
        },
      });

      schedules.forEach((schedule, index) => {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${index + 1}. *${schedule.time}* - <#${
              schedule.channel
            }>\n> ${schedule.message}`,
          },
        });
      });
    }

    await client.chat.postEphemeral({
      channel: command.channel_id,
      user: command.user_id,
      blocks: blocks,
    });
  } catch (error) {
    console.error("Erro no comando config:", error);
  }
}

module.exports = handleConfig;
