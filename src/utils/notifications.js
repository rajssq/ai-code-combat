/**
 * Envia notificação pública no canal
 */
async function sendChannelNotification(client, channelId, userId) {
  return await client.chat.postMessage({
    channel: channelId,
    text: `Huddle iniciado por <@${userId}>`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Huddle Iniciado*\n<@${userId}> iniciou um huddle neste canal.`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Clique no ícone de fone no cabeçalho do canal para entrar • ${new Date().toLocaleTimeString(
              "pt-BR",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )}`,
          },
        ],
      },
    ],
    unfurl_links: false,
    unfurl_media: false,
  });
}

/**
 * Envia DM para um membro com botão de acesso rápido
 */
async function sendMemberDM(client, memberId, channelId, userId, teamId) {
  return await client.chat.postMessage({
    channel: memberId,
    text: `<@${userId}> iniciou um huddle em <#${channelId}>`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Huddle em Andamento",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<@${userId}> iniciou um huddle em <#${channelId}>`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Acesso Rápido:*\nClique no botão abaixo para abrir o canal e participar.",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Abrir Canal",
            },
            url: `slack://channel?team=${teamId}&id=${channelId}`,
            style: "primary",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Iniciado às ${new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
          },
        ],
      },
    ],
  });
}

/**
 * Notifica todos os membros de um canal sobre huddle iniciado
 */
async function notifyChannelMembers(client, channelId, userId, teamId) {
  try {
    const members = await client.conversations.members({ channel: channelId });

    if (!members.members.includes(userId)) {
      return { notified: false, reason: "user_not_in_channel" };
    }

    // 1. Notificação no canal
    await sendChannelNotification(client, channelId, userId);
    console.log(`✅ Notificação enviada no canal ${channelId}`);

    // 2. DMs individuais (exceto para quem iniciou e bots)
    const memberCount = members.members.length;
    console.log(`📬 Enviando DMs para ${memberCount - 1} membros...`);

    let dmsSent = 0;
    for (const memberId of members.members) {
      if (memberId === userId) continue;

      try {
        const memberInfo = await client.users.info({ user: memberId });
        if (memberInfo.user.is_bot) continue;

        await sendMemberDM(client, memberId, channelId, userId, teamId);
        console.log(`  ✅ DM enviada para ${memberId}`);
        dmsSent++;
      } catch (dmError) {
        console.error(
          `  ❌ Erro ao enviar DM para ${memberId}:`,
          dmError.message
        );
      }
    }

    return { notified: true, dmsSent };
  } catch (error) {
    console.error(`Erro ao notificar canal ${channelId}:`, error.message);
    return { notified: false, error: error.message };
  }
}

module.exports = {
  sendChannelNotification,
  sendMemberDM,
  notifyChannelMembers,
};
